import numpy as np
import cv2 as cv
import time
import json
import torch
from PIL import Image
import argparse
import pathlib
import pyrealsense2 as rs  # Still needed for RealSense mode

# For Windows compatibility if needed
temp = pathlib.PosixPath
pathlib.PosixPath = pathlib.WindowsPath

# ------------------------
# Parameterization via argparse
# ------------------------
parser = argparse.ArgumentParser(description="Image Difference with YOLO Object Detection")
parser.add_argument("--weights", type=str, default="weights/yolov5x_v2_and_close_1.pt",
                    help="Path to the YOLO weights file")
parser.add_argument("--output_dims", type=str, default="1920x1080",
                    help="Output dimensions for display in the format WIDTHxHEIGHT")
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
# New argument for live mode: target FPS. If set > 0, live mode is enabled.
parser.add_argument("--live_fps", type=float, default=0,
                    help="Target FPS for live mode. Set > 0 to enable live mode (can be less than 1).")
# New argument to choose the camera type: "realsense" or "webcam"
parser.add_argument("--camera_type", type=str, choices=["realsense", "webcam"], default="realsense",
                    help="Camera type to use: realsense or webcam")
args = parser.parse_args()

# Parse output dimensions argument (e.g., "1920x1080")
output_width, output_height = map(int, args.output_dims.split('x'))

# ------------------------
# YOLO Model Initialization
# ------------------------
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model = torch.hub.load('ultralytics/yolov5', 'custom', path=args.weights, force_reload=True).to(device)

# ------------------------
# Camera Capture Setup
# ------------------------
if args.camera_type == "realsense":
    # Intel RealSense Capture Setup
    pipeline = rs.pipeline()
    config = rs.config()
    # Enable the color stream; adjust resolution and framerate as needed
    config.enable_stream(rs.stream.color, 1920, 1080, rs.format.bgr8, 30)
    pipeline.start(config)
else:
    # Normal webcam using OpenCV VideoCapture
    cap = cv.VideoCapture(0)
    # Set input resolution to 1920x1080 and desired framerate
    cap.set(cv.CAP_PROP_FRAME_WIDTH, 1920)
    cap.set(cv.CAP_PROP_FRAME_HEIGHT, 1080)
    cap.set(cv.CAP_PROP_FPS, 30)

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
    image = Image.fromarray(cv.cvtColor(cropped_region, cv.COLOR_BGR2RGB))
    
    start_yolo = time.time()
    results = model(image)
    yolo_runtime = time.time() - start_yolo
    print("YOLO call runtime: {:.2f} ms".format(yolo_runtime * 1000))
    
    print("YOLO Object Detection Results:")
    print(results.pandas().xyxy[0])
    
    for _, row in results.pandas().xyxy[0].iterrows():
        x1, y1, x2, y2, conf, cls, name = row[['xmin', 'ymin', 'xmax', 'ymax', 'confidence', 'class', 'name']]
        cv.rectangle(cropped_region, (int(x1), int(y1)), (int(x2), int(y2)), (255, 0, 0), 2)
        cv.putText(cropped_region, f"{name} ({conf:.2f})", (int(x1), int(y1)-10),
                   cv.FONT_HERSHEY_SIMPLEX, 0.5, (255, 0, 0), 2)
    return yolo_runtime

# ------------------------
# Background Initialization
# ------------------------
if args.bg_method == "baseline":
    if args.camera_type == "realsense":
        frames = pipeline.wait_for_frames()
        color_frame = frames.get_color_frame()
        if not color_frame:
            print("Cannot capture from RealSense camera")
            exit()
        frame = np.asanyarray(color_frame.get_data())
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
live_mode = args.live_fps > 0
if live_mode:
    delay_ms = int(1000.0 / args.live_fps)
    print(f"Live mode enabled with target FPS: {args.live_fps} (delay: {delay_ms} ms per frame)")
else:
    print("Manual mode: Press any key to proceed to the next frame, or 'q' to exit.")

# ------------------------
# Main Processing Loop
# ------------------------
while True:
    total_yolo_runtime = 0.0  # Accumulate YOLO call runtimes per loop iteration

    # Capture frame based on selected camera
    if args.camera_type == "realsense":
        frames = pipeline.wait_for_frames()
        color_frame = frames.get_color_frame()
        if not color_frame:
            print("Failed to acquire color frame. Exiting...")
            break
        frame = np.asanyarray(color_frame.get_data())
    else:  # webcam
        ret, frame = cap.read()
        if not ret:
            print("Failed to grab frame from webcam. Exiting...")
            break

    original_frame = frame.copy()

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
    # Cluster the already expanded bounding boxes
    merged_boxes = cluster_bounding_boxes(expanded_boxes, args.cluster_distance) if expanded_boxes else []

    bg_runtime = time.time() - start_bg
    print("Background subtraction runtime: {:.2f} ms".format(bg_runtime * 1000))

    # Create a color version of the threshold image to draw ROI boxes
    thresh_with_boxes = cv.cvtColor(thresh, cv.COLOR_GRAY2BGR)
    for box in merged_boxes:
        square_box = make_square_bbox(box, gray_frame.shape)
        cv.rectangle(thresh_with_boxes, (square_box[0], square_box[1]),
                     (square_box[0] + square_box[2], square_box[1] + square_box[3]), (0, 255, 0), 2)

    # ------------------------
    # YOLO Processing
    # ------------------------
    if merged_boxes:
        union_bbox_all = union_box(merged_boxes)
        union_area = union_bbox_all[2] * union_bbox_all[3]
        total_area = original_frame.shape[0] * original_frame.shape[1]
        if union_area > args.yolo_whole_thresh * total_area:
            runtime = run_yolo_on_region(original_frame, (0, 0, original_frame.shape[1], original_frame.shape[0]))
            total_yolo_runtime += runtime
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

    # Resize the images to output dimensions before displaying
    display_thresh = cv.resize(thresh_with_boxes, (output_width, output_height))
    display_original = cv.resize(original_frame, (output_width, output_height))
    cv.imshow('Background Subtraction', display_thresh)
    cv.imshow('Differences', display_original)
    
    key = cv.waitKey(delay_ms if live_mode else 0) & 0xFF
    if key == ord('q'):
        break

with open("image_differences.json", "w") as json_file:
    json.dump(diff_data, json_file, indent=4)

# Clean up: release camera resources
if args.camera_type == "realsense":
    pipeline.stop()
else:
    cap.release()

cv.destroyAllWindows()
