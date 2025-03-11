import numpy as np
import cv2 as cv
import time
import json
import torch
import onnxruntime
from PIL import Image
import argparse
import pathlib
import logging
import requests
import pyrealsense2 as rs  # Still needed for RealSense mode
from concurrent.futures import ThreadPoolExecutor  # Thread pool for non-blocking API calls
logging.basicConfig(level=logging.INFO)

executor = ThreadPoolExecutor(max_workers=3)  # 3 threads for parallel processing
detection_executor = ThreadPoolExecutor(max_workers=2)  # Separate thread pool for YOLO

# ------------------------
# Parameterization via argparse
# ------------------------
parser = argparse.ArgumentParser(description="Image Difference with YOLO Object Detection")
parser.add_argument("--server_ip", type=str, default="localhost:3001",
                    help="IP address and port of the API server (e.g., 192.168.1.100:3001)")
parser.add_argument("--weights", type=str, default="weights/yolov5x_v2_and_close_1.pt",
                    help="Path to the YOLO weights file")
parser.add_argument("--output_dims", type=str, default="1720x960",
                    help="Output dimensions for each pane in the format WIDTHxHEIGHT")
parser.add_argument("--min_diff_size", type=int, default=128, help="Minimum difference size (w*h)")
parser.add_argument("--threshold_value", type=int, default=50, help="Fixed threshold value")
parser.add_argument("--use_adaptive_threshold", action="store_true", help="Use adaptive thresholding")
parser.add_argument("--adaptive_block_size", type=int, default=11, help="Adaptive thresholding block size (must be odd)")
parser.add_argument("--adaptive_C", type=int, default=2, help="Adaptive thresholding constant C")
parser.add_argument("--blur_kernel", type=int, nargs=2, default=(5, 5), help="Kernel size for Gaussian blur")
parser.add_argument("--bg_method", type=str, choices=["baseline", "mog2", "knn"], default="mog2", help="Background subtraction method")
parser.add_argument("--roi_margin", type=float, default=1, help="Margin ratio to expand ROI (e.g., 0.1 for 10%)")
parser.add_argument("--resize_factor", type=float, default=1.0, help="Resize factor for processing (e.g. 0.5 for half resolution)")
parser.add_argument("--cluster_distance", type=int, default=50, help="Distance threshold for clustering bounding boxes")
# New arguments for noise filtering
parser.add_argument("--apply_noise_filter", action="store_true", help="Apply additional noise filtering using median blur")
parser.add_argument("--noise_filter_kernel", type=int, default=3, help="Kernel size for median noise filter (must be odd)")
# New argument to decide when to pass the whole image to YOLO
parser.add_argument("--yolo_whole_thresh", type=float, default=0.5,
                    help="If the combined ROI area exceeds this fraction of the total image area, pass the whole image to YOLO")
# New argument for YOLO confidence threshold
parser.add_argument("--min_confidence", type=float, default=0.25,
                    help="Minimum confidence threshold for YOLO detections")
# New argument for live mode: target FPS. If set > 0, live mode is enabled.
parser.add_argument("--fps", type=float, default=0,
                    help="Target FPS for live mode. Set > 0 to enable live mode (can be less than 1).")
# Updated camera type choices to include 'video'
parser.add_argument("--camera", type=str, choices=["realsense", "webcam", "realsense_ir", "video"], default="video",
                    help="Camera type to use: realsense, webcam, realsense_ir, or video")
# New argument for video file path when using video mode
parser.add_argument("--video_file", type=str, default="video.mp4", help="Path to video file for streaming on loop")
# New flag: if set, only display the object detection output pane
parser.add_argument("--simple_display", action="store_true",
                    help="Display only the object detection output pane instead of the four-pane view")
args = parser.parse_args()

# Parse output dimensions argument (for each pane, e.g., "640x360")
if args.simple_display:
    output_width, output_height = map(int, args.output_dims.split('x'))
else:
    output_width, output_height = map(int, args.output_dims.split('x'))
    output_width //= 2
    output_height //= 2
    
# ------------------------
# API Call Initialization
# ------------------------
posturl = f"http://{args.server_ip}/api/demo/uploadDetection"

# ------------------------
# YOLO Model Initialization
# ------------------------
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model = torch.hub.load('ultralytics/yolov5', 'custom', path=args.weights, force_reload=True).to(device)
model.conf = args.min_confidence

# ------------------------
# Camera/Video Capture Setup
# ------------------------
if args.camera == "realsense":
    pipeline = rs.pipeline()
    config = rs.config()
    config.enable_stream(rs.stream.color, 1920, 1080, rs.format.bgr8, 30)
    pipeline.start(config)
elif args.camera == "realsense_ir":
    pipeline = rs.pipeline()
    config = rs.config()
    config.enable_stream(rs.stream.infrared, 1, 1280, 720, rs.format.y8, 30)
    selection = pipeline.start(config)
    for s in selection.get_device().query_sensors():
        if s.is_depth_sensor():
            s.set_option(rs.option.emitter_enabled, 0)
elif args.camera == "video":
    # Use a video file as the source
    cap = cv.VideoCapture(args.video_file)
    if not cap.isOpened():
        print(f"Error: Cannot open video file {args.video_file}")
        exit()
else:
    # Normal webcam using OpenCV VideoCapture
    cap = cv.VideoCapture(0)
    cap.set(cv.CAP_PROP_FRAME_WIDTH, 1920)
    cap.set(cv.CAP_PROP_FRAME_HEIGHT, 1080)
    cap.set(cv.CAP_PROP_FPS, 30)
    
# ------------------------
# Function to send detection data asynchronously
# ------------------------
def send_detection_async(image, camera_id, detections):
    """Send detection data asynchronously without blocking the main thread."""

    def send_request():
        try:
            logging.info(f"Preparing to send {len(detections)} detections to API...")

            image_path = f"detection_snapshot_{int(time.time())}.jpg"
            cv.imwrite(image_path, image)
            logging.info(f"📸 Image saved: {image_path}")

            # Get correct MIME type
            import mimetypes
            mimetype, _ = mimetypes.guess_type(image_path)
            if mimetype is None:
                mimetype = "image/jpeg"  # Default if guessing fails

            logging.info(f"[DEBUG] Detected file mimetype: {mimetype}")
            
            with open(image_path, "rb") as img_file:
                files = {"image": (image_path, img_file, mimetype)}  # Ensure correct MIME type

                data = {
                    "cameraID": camera_id,
                    "detections": json.dumps(detections)  #Convert detections to JSON string
                }

                logging.info(f"[DEBUG] Sending POST request to {posturl}")

                response = requests.post(
                    posturl,
                    files=files,  #Must use `files` for image upload
                    data=data,
                    timeout=5
                )

                logging.info(f"[DEBUG] Server Response: {response.text}")

                if response.status_code == 201:
                    logging.info(f"POST Successful")
                else:
                    logging.warning(f"⚠️ POST Failed [{response.status_code}]: {response.text}")

        except requests.exceptions.RequestException as e:
            logging.error(f"API request failed: {e}")
        except Exception as e:
            logging.error(f"Unexpected error: {e}")

    logging.info("Submitting send_detection_async to thread pool.")
    executor.submit(send_request)
    
# ------------------------
# YOLO Object Detection Processing Function
# ------------------------
def run_yolo_on_frame_async(frame, camera_id="550e8400-e29b-41d4-a716-446655440000"):
    """Offload YOLO processing to a separate thread."""
    
    def process_frame():
        image = Image.fromarray(cv.cvtColor(frame, cv.COLOR_BGR2RGB))
        results = model(image)  # Runs on a separate thread now

        detections = []
        for _, row in results.pandas().xyxy[0].iterrows():
            x1, y1, x2, y2, conf, cls, name = row[["xmin", "ymin", "xmax", "ymax", "confidence", "class", "name"]]
            detections.append({
                "x_min": float(x1),
                "x_max": float(x2),
                "y_min": float(y1),
                "y_max": float(y2),
                "class": int(cls),
                "species": name,
                "confidence": round(float(conf), 2)
            })

        if detections:
            # timestamp = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
            # logging.info(f"Detected {len(detections)} objects, sending to API...")
            send_detection_async(frame, camera_id, detections)
        else:
            logging.info("🔵 No detections found, skipping API call.")

    detection_executor.submit(process_frame)

# ------------------------
# Utility Functions for Bounding Box Clustering and ROI Expansion
# ------------------------
def union_box(boxes):
    """Return the union of a list of boxes (each as (x, y, w, h))."""
    x_min = min(box[0] for box in boxes)
    y_min = min(box[1] for box in boxes)
    x_max = max(box[0] + box[2] for box in boxes)
    y_max = max(box[1] + box[3] for box in boxes)
    return (x_min, y_min, x_max - x_min, y_max - y_min)

def boxes_overlap_or_close(boxA, boxB, threshold):
    xA, yA, wA, hA = boxA
    xB, yB, wB, hB = boxB
    leftA, rightA = xA, xA + wA
    topA, bottomA = yA, yA + hA
    leftB, rightB = xB, xB + wB
    topB, bottomB = yB, yB + hB

    # Check if they overlap
    overlap_in_x = not (rightA < leftB or leftA > rightB)
    overlap_in_y = not (bottomA < topB or topA > bottomB)
    if overlap_in_x and overlap_in_y:
        return True

    # Check for "close" boxes if gap <= threshold
    gap_x = 0
    if rightA < leftB:
        gap_x = leftB - rightA
    elif rightB < leftA:
        gap_x = leftA - rightB

    gap_y = 0
    if bottomA < topB:
        gap_y = topB - bottomA
    elif bottomB < topA:
        gap_y = topA - bottomB

    return (gap_x <= threshold) and (gap_y <= threshold)

def cluster_bounding_boxes(boxes, distance_threshold):
    """Cluster nearby bounding boxes into groups and return merged boxes."""
    clusters = []
    boxes_copy = boxes.copy()
    while boxes_copy:
        current = boxes_copy.pop(0)
        cluster = [current]
        merged = union_box(cluster)
        changed = True
        while changed:
            changed = False
            for b in boxes_copy[:]:
                if boxes_overlap_or_close(merged, b, distance_threshold):
                    cluster.append(b)
                    boxes_copy.remove(b)
                    merged = union_box(cluster)
                    changed = True
        clusters.append(merged)
    return clusters

def expand_bbox(bbox, margin_ratio, frame_shape):
    """Expand bounding box by margin_ratio while keeping within frame boundaries."""
    x, y, w, h = bbox
    margin_x = int(w * margin_ratio)
    margin_y = int(h * margin_ratio)
    new_x = max(x - margin_x, 0)
    new_y = max(y - margin_y, 0)
    new_w = min(w + 2 * margin_x, frame_shape[1] - new_x)
    new_h = min(h + 2 * margin_y, frame_shape[0] - new_y)
    return (new_x, new_y, new_w, new_h)

def make_square_bbox(bbox, frame_shape):
    """
    Convert a rectangular bounding box to a square bounding box.
    The square is based on the maximum of width and height and centered on the original bbox.
    It is clamped to the frame boundaries.
    """
    x, y, w, h = bbox
    size = max(w, h)
    cx = x + w // 2
    cy = y + h // 2
    new_x = cx - size // 2
    new_y = cy - size // 2

    new_x = max(new_x, 0)
    new_y = max(new_y, 0)
    if new_x + size > frame_shape[1]:
        new_x = frame_shape[1] - size
    if new_y + size > frame_shape[0]:
        new_y = frame_shape[0] - size

    return (new_x, new_y, size, size)

def run_yolo_on_region(frame, bbox):
    """Run YOLO on the extracted image region, print runtime, and display detections."""
    if bbox is None:
        return 0.0
    x, y, w, h = bbox
    cropped_region = frame[y:y+h, x:x+w]

    # Check if using ONNX weights based on the filename extension
    if args.weights.endswith('.onnx'):
        input_size = (640, 640)
        resized_region = cv.resize(cropped_region, input_size)
        image = Image.fromarray(cv.cvtColor(resized_region, cv.COLOR_BGR2RGB))
    else:
        image = Image.fromarray(cv.cvtColor(cropped_region, cv.COLOR_BGR2RGB))

    start_yolo = time.time()
    results = model(image)
    yolo_runtime = time.time() - start_yolo
    print("YOLO call runtime: {:.2f} ms".format(yolo_runtime * 1000))

    detections = results.pandas().xyxy[0]

    if args.weights.endswith('.onnx'):
        scale_x = cropped_region.shape[1] / input_size[0]
        scale_y = cropped_region.shape[0] / input_size[1]
        for col in ['xmin', 'xmax']:
            detections[col] = detections[col] * scale_x
        for col in ['ymin', 'ymax']:
            detections[col] = detections[col] * scale_y

    for _, row in detections.iterrows():
        x1, y1, x2, y2, conf, cls, name = row[['xmin', 'ymin', 'xmax', 'ymax', 'confidence', 'class', 'name']]
        cv.rectangle(cropped_region, (int(x1), int(y1)), (int(x2), int(y2)), (255, 0, 0), 2)
        cv.putText(cropped_region, f"{name} ({conf:.2f})", (int(x1), int(y1)-10),
                   cv.FONT_HERSHEY_SIMPLEX, 0.5, (255, 0, 0), 2)
    return yolo_runtime



# ------------------------
# Background Initialization
# ------------------------
if args.bg_method == "baseline":
    if args.camera == "realsense":
        frames = pipeline.wait_for_frames()
        color_frame = frames.get_infrared_frame()
        if not color_frame:
            print("Cannot capture from RealSense camera")
            exit()
        frame = np.asanyarray(color_frame.get_data())
        frame = cv.cvtColor(frame, cv.COLOR_GRAY2BGR)
    elif args.camera == "video":
        ret, frame = cap.read()
        if not ret:
            print("Cannot capture from video file")
            exit()
    else:  # webcam
        ret, frame = cap.read()
        if not ret:
            print("Cannot capture from webcam")
            exit()
    if args.resize_factor != 1.0:
        frame_resized = cv.resize(frame, None, fx=args.resize_factor, fy=args.resize_factor)
    else:
        frame_resized = frame
    baseline_gray = cv.cvtColor(frame_resized, cv.COLOR_BGR2GRAY)
    baseline_gray = cv.GaussianBlur(baseline_gray, tuple(args.blur_kernel), 0)
    if args.apply_noise_filter:
        baseline_gray = cv.medianBlur(baseline_gray, args.noise_filter_kernel)
else:
    if args.bg_method == "mog2":
        bg_subtractor = cv.createBackgroundSubtractorMOG2(varThreshold=32, detectShadows=False, history=500)
    elif args.bg_method == "knn":
        bg_subtractor = cv.createBackgroundSubtractorKNN()

diff_data = []

# Determine mode and frame delay if live mode is enabled
live_mode = args.fps > 0
if live_mode:
    delay_ms = int(1000.0 / args.fps)
    print(f"Live mode enabled with target FPS: {args.fps} (delay: {delay_ms} ms per frame)")
else:
    print("Manual mode: Press any key to proceed to the next frame, or 'q' to exit.")

# ------------------------
# Main Processing Loop
# ------------------------
while True:
    total_yolo_runtime = 0.0  # Accumulate YOLO runtimes per loop iteration

    # Capture frame based on selected camera
    if args.camera == "realsense":
        frames = pipeline.wait_for_frames()
        color_frame = frames.get_color_frame()
        if not color_frame:
            print("Failed to acquire color frame. Exiting...")
            break
        frame = np.asanyarray(color_frame.get_data())
    elif args.camera == "realsense_ir":
        frames = pipeline.wait_for_frames()
        ir_frame = frames.get_infrared_frame()
        if not ir_frame:
            print("Failed to acquire IR frame. Exiting...")
            break
        frame = np.asanyarray(ir_frame.get_data())
        frame = cv.cvtColor(frame, cv.COLOR_GRAY2BGR)
    elif args.camera == "video":
        ret, frame = cap.read()
        # If the video has ended, reset to the first frame and try again
        if not ret:
            cap.set(cv.CAP_PROP_POS_FRAMES, 0)
            ret, frame = cap.read()
            if not ret:
                print("Failed to read video file. Exiting...")
                break
    else:  # webcam
        # Flush the buffer if in live mode with very low FPS
        if live_mode and args.fps < 1:
            for _ in range(5):  # adjust the number as needed
                cap.grab()
        ret, frame = cap.read()
        if not ret:
            print("Failed to grab frame from webcam. Exiting...")
            break

    # Save the original input image before any drawings for later display
    original_frame = frame.copy()
    input_display = original_frame.copy()

    # Resize frame for processing if requested
    if args.resize_factor != 1.0:
        frame_resized = cv.resize(frame, None, fx=args.resize_factor, fy=args.resize_factor)
    else:
        frame_resized = frame

    # Convert to grayscale and reduce noise
    gray_frame = cv.cvtColor(frame_resized, cv.COLOR_BGR2GRAY)
    gray_blur = cv.GaussianBlur(gray_frame, tuple(args.blur_kernel), 0)
    if args.apply_noise_filter:
        gray_blur = cv.medianBlur(gray_blur, args.noise_filter_kernel)

    # ------------------------
    # Background Subtraction & Thresholding with timing
    # ------------------------
    start_bg = time.time()
    if args.bg_method == "baseline":
        diff = cv.absdiff(baseline_gray, gray_blur)
    else:
        diff = bg_subtractor.apply(gray_blur)

    if args.use_adaptive_threshold:
        thresh = cv.adaptiveThreshold(diff, 255, cv.ADAPTIVE_THRESH_MEAN_C,
                                      cv.THRESH_BINARY, args.adaptive_block_size, args.adaptive_C)
    else:
        _, thresh = cv.threshold(diff, args.threshold_value, 255, cv.THRESH_BINARY)

    # ------------------------
    # Find contours and cluster differences
    # ------------------------
    contours, _ = cv.findContours(thresh, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE)
    boxes = []
    for cnt in contours:
        x, y, w, h = cv.boundingRect(cnt)
        if w * h > args.min_diff_size:
            boxes.append((x, y, w, h))

    # Expand each detected bounding box before clustering
    expanded_boxes = [expand_bbox(box, args.roi_margin, gray_frame.shape) for box in boxes]
    # Cluster the expanded bounding boxes
    merged_boxes = cluster_bounding_boxes(expanded_boxes, args.cluster_distance) if expanded_boxes else []

    #**Call YOLO Detection Here**
    run_yolo_on_frame_async(original_frame)  #Now processing the frame for detection
    
    bg_runtime = time.time() - start_bg
    print("Background subtraction runtime: {:.2f} ms".format(bg_runtime * 1000))

    # Create an image for Regions of Interest (ROI) by drawing bounding boxes on the threshold image
    thresh_with_boxes = cv.cvtColor(thresh, cv.COLOR_GRAY2BGR)
    for box in merged_boxes:
        square_box = make_square_bbox(box, gray_frame.shape)
        cv.rectangle(thresh_with_boxes, (square_box[0], square_box[1]),
                     (square_box[0] + square_box[2], square_box[1] + square_box[3]), (0, 255, 0), 2)

    # ------------------------
    # YOLO Processing for Object Detection
    # ------------------------
    if merged_boxes:
        union_bbox_all = union_box(merged_boxes)
        union_area = union_bbox_all[2] * union_bbox_all[3]
        total_area = original_frame.shape[0] * original_frame.shape[1]
        if union_area > args.yolo_whole_thresh * total_area:
            runtime = run_yolo_on_region(original_frame, (0, 0, original_frame.shape[1], original_frame.shape[0]))
            total_yolo_runtime += runtime
            cv.rectangle(original_frame, (0, 0), (original_frame.shape[1], original_frame.shape[0]), (0, 255, 0), 2)
        else:
            for bbox in merged_boxes:
                if args.resize_factor != 1.0:
                    scale = 1.0 / args.resize_factor
                    x, y, w, h = bbox
                    bbox = (int(x * scale), int(y * scale), int(w * scale), int(h * scale))
                square_bbox = make_square_bbox(bbox, original_frame.shape)
                cv.rectangle(original_frame, (square_bbox[0], square_bbox[1]),
                             (square_bbox[0] + square_bbox[2], square_bbox[1] + square_bbox[3]), (0, 255, 0), 2)
                runtime = run_yolo_on_region(original_frame, square_bbox)
                total_yolo_runtime += runtime

    print("Total YOLO runtime for this loop: {:.2f} ms".format(total_yolo_runtime * 1000))
    diff_data.append({"timestamp": time.time(), "regions": merged_boxes})

    # ------------------------
    # Display
    # ------------------------
    if args.simple_display:
        obj_disp = cv.resize(original_frame, (output_width, output_height))
        cv.imshow('Object Detection', obj_disp)
    else:
        # Input Image: original unmodified capture
        input_disp = cv.resize(input_display, (output_width, output_height))
        cv.putText(input_disp, "Input Image", (10, 30), cv.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2)

        # Background Subtraction Output: raw threshold image converted to BGR
        bg_disp = cv.resize(cv.cvtColor(thresh, cv.COLOR_GRAY2BGR), (output_width, output_height))
        cv.putText(bg_disp, "Background Subtraction", (10, 30), cv.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2)

        # Regions of Interest: threshold image with ROI boxes drawn
        roi_disp = cv.resize(thresh_with_boxes, (output_width, output_height))
        cv.putText(roi_disp, "Regions of Interest", (10, 30), cv.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2)

        # Object Detection Output: image with YOLO boxes drawn
        obj_disp = cv.resize(original_frame, (output_width, output_height))
        cv.putText(obj_disp, "Object Detection", (10, 30), cv.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2)

        # Combine into a 2x2 grid for four-pane display
        top_row = np.hstack([input_disp, bg_disp])
        bottom_row = np.hstack([roi_disp, obj_disp])
        combined_disp = np.vstack([top_row, bottom_row])
        cv.imshow('Four Panes', combined_disp)

    key = cv.waitKey(delay_ms if live_mode else 0) & 0xFF
    if key == ord('q'):
        break

with open("image_differences.json", "w") as json_file:
    json.dump(diff_data, json_file, indent=4)

# Clean up: release camera resources
if args.camera == "realsense" or args.camera == "realsense_ir":
    pipeline.stop()
else:
    cap.release()

cv.destroyAllWindows()
