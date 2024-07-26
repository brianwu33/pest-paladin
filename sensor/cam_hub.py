import warnings
warnings.simplefilter(action='ignore', category=FutureWarning)

import time
import torch
import cv2
from PIL import Image
import os
import json
import grequests
from datetime import datetime
import imagezmq

# Check if a GPU is available
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# Load the YOLOv5 model
model = torch.hub.load('ultralytics/yolov5', 'custom', path='weights/best.pt', force_reload=True).to(device)
model.eval()

# Set the desired frames per second (fps)
desired_fps = 10
frame_time = 1.0 / desired_fps
instance_thresh = 5  # seconds

# Parameters for detection and saving frames
min_confidence = 0.5  # Confidence threshold (50%)
last_detection_time = {}
instance_id_counter = {}
last_post_time = 0  # Initialize the last post time
file_seq = 0

# Directory to save detected frames
os.makedirs('detected_frames', exist_ok=True)

# Variable to select the output method ('file' or 'http')
detector_output = 'http'  # Change this to 'http' to send data to the API endpoint

# API endpoint URL (only used if detector_output is 'http')
api_url = 'https://example.com/api'  # Replace with your actual API endpoint
timeout = 3

# Set my port
port = 'tcp://*:5555'

# Function to process a single frame
def process_frame(frame):
    img = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
    start_time = time.time()
    results = model(img)
    end_time = time.time()
    pred = results.pred[0]
    boxes = pred[:, :4].cpu().numpy()
    scores = pred[:, 4].cpu().numpy()
    labels = pred[:, -1].int().cpu().numpy()
    label_names = [model.names[i] for i in labels]
    runtime = end_time - start_time
    return boxes, scores, labels, label_names, runtime

def response_handler(response, *args, **kwargs):
    if response:
        print(f"Response status code: {response.status_code}")
    else:
        print("No response received")

# Function to post data to the API endpoint
def post_data(url, json_data, frame, timeout=3):
    try:
        print("Making POST")
        _, image = cv2.imencode('.jpg', frame)
        files = {
            'image': ('image.jpg', image.tobytes(), 'image/jpeg')
        }
        payload = {
            'data': json.dumps(json_data)
        }

        req = grequests.post(url, data=payload, files=files, timeout=timeout, hooks={'response': response_handler})
        grequests.send(req, grequests.Pool(1))
        return
    except Exception as e:
        print(f"An error occurred during POST: {e}")
        return 

# Function to create JSON output
def create_json_output(rpi_name, boxes, scores, labels, label_names, timestamp, instance_id_counter):
    detections = []
    for box, score, label, label_name in zip(boxes, scores, labels, label_names):
        if label_name == 'cat':
            label_name = 'rat'
        if score > min_confidence:
            detection = {
                'xmin': float(box[0]),
                'xmax': float(box[2]),
                'ymin': float(box[1]),
                'ymax': float(box[3]),
                'class': int(label),
                'species': label_name,
                'confidence': float(score),
                'instanceID': instance_id_counter[rpi_name]
            }
            detections.append(detection)

    output = {
        'timestamp': timestamp,
        'userID': 1,
        'cameraID': 1,
        'Detections': detections
    }
    return output

# Function to save output
def save_output(seq, output, frame):
    # Save JSON file locally
    with open(f"detected_frames/{seq}_detection.json", 'w') as f:
        json.dump(output, f, indent=4)
    
    # Save the frame image without bounding boxes
    image_save_path = f"detected_frames/{seq}_frame.jpg"
    cv2.imwrite(image_save_path, frame)

# Initialize ImageHub
image_hub = imagezmq.ImageHub(open_port=port)

print("Ready!")

try:
    while True:
        start_time = time.time()

        rpi_name, frame = image_hub.recv_image()
        
        # Skip depth channel images
        if rpi_name.endswith('_depth'):
            image_hub.send_reply(b'OK')
            continue
        
        print("loop")

        if rpi_name not in last_detection_time:
            last_detection_time[rpi_name] = time.time()
            instance_id_counter[rpi_name] = 1

        # Process the frame
        boxes, scores, labels, label_names, runtime = process_frame(frame)

        # Check if the detection meets the confidence threshold
        if any(score > min_confidence for score in scores):
            current_time = time.time()

            # Update instance ID if more than 5 seconds have passed since the last detection
            if current_time - last_detection_time[rpi_name] > instance_thresh:
                instance_id_counter[rpi_name] += 1
            
            last_detection_time[rpi_name] = current_time
            print(current_time - last_post_time)

            # Check if a second has passed since the last post
            if current_time - last_post_time >= 1:
                print("Outputting...")

                timestamp = datetime.now().isoformat()
                output = create_json_output(rpi_name, boxes, scores, labels, label_names, timestamp, instance_id_counter)

                if detector_output == 'file':
                    save_output(file_seq, output, frame)
                    file_seq += 1
                elif detector_output == 'http':
                    post_data(api_url, output, frame, timeout)
                last_post_time = time.time()

        # Draw bounding boxes on the frame
        for box, score, label_name in zip(boxes, scores, label_names):
            if label_name == 'cat':
                label_name = 'rat'
            if score > min_confidence:
                x1, y1, x2, y2 = map(int, box)
                cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                cv2.putText(frame, f"{label_name}: {score:.2f}", (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)

        # Display the frame
        cv2.imshow(rpi_name, frame)
        cv2.waitKey(1)

        # Calculate elapsed time and sleep if necessary to maintain the desired fps
        elapsed_time = time.time() - start_time
        if elapsed_time < frame_time:
            time.sleep(frame_time - elapsed_time)

        image_hub.send_reply(b'OK')

        # Break the loop if 'q' is pressed
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
finally:
    cv2.destroyAllWindows()
