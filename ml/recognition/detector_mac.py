import warnings
warnings.simplefilter(action='ignore', category=FutureWarning)

import time
import torch
import cv2
from PIL import Image
import numpy as np
import os
import json
import requests
from datetime import datetime

# Check if a GPU is available
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# Load the YOLOv5 model
# model = torch.hub.load("ultralytics/yolov5", "yolov5s", pretrained=True)
model = torch.hub.load('ultralytics/yolov5', 'custom', path='weights/best.pt', force_reload=True).to(device)
model.eval()

# Set the desired frames per second (fps)
desired_fps = 10
frame_time = 1.0 / desired_fps

# Parameters for detection and saving frames
min_detected_frames = 3  # Minimum number of frames with detections
min_confidence = 0.5  # Confidence threshold (50%)
detection_count = {}
detected_frames = {}

# Directory to save detected frames
os.makedirs('detected_frames', exist_ok=True)

# Variable to select the output method ('file' or 'http')
detector_output = 'http'  # Change this to 'file' to save data locally

# API endpoint URL (only used if detector_output is 'http')
box_api_url = 'https://example.com/api'  # Replace with your actual API endpoint
timeout = 0.1

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

# Function to post data to the API endpoint
def post_data(url, json_data, image, timeout=30):
    try:
        files = {
            'image': ('image.jpg', image, 'image/jpeg')
        }
        payload = {
            'data': json.dumps(json_data)
        }
        response = requests.post(url, data=payload, files=files, timeout=timeout)
        response.raise_for_status()  # Raise an error for bad status codes
        return response.text
    except Exception as e:
        return f"An error occurred: {e}"


# Initialize webcam
cap = cv2.VideoCapture(0)

start_second = time.time()
print("Ready!")

try:
    while True:
        start_time = time.time()
        # print("loop")

        ret, frame = cap.read()
        if not ret:
            break
        
        rpi_name = 'webcam'

        if rpi_name not in detection_count:
            detection_count[rpi_name] = 0
            detected_frames[rpi_name] = []

        # Process the frame
        boxes, scores, labels, label_names, runtime = process_frame(frame)

        # Check if the detection meets the confidence threshold
        if any(score > min_confidence for score in scores):
            detection_count[rpi_name] += 1
            detected_frames[rpi_name].append((frame.copy(), boxes, scores, labels, label_names))

        # Draw bounding boxes on the frame
        for box, score, label_name in zip(boxes, scores, label_names):
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

        # Check if a second has passed
        if time.time() - start_second >= 1:
            for rpi in detection_count:
                if detection_count[rpi] >= min_detected_frames:
                    middle_index = len(detected_frames[rpi]) // 2
                    frame, boxes, scores, labels, label_names = detected_frames[rpi][middle_index]

                    timestamp = datetime.now().isoformat()
                    detections = []
                    for box, score, label, label_name in zip(boxes, scores, labels, label_names):
                        if score > min_confidence:
                            detection = {
                                'xmin': float(box[0]),
                                'xmax': float(box[2]),
                                'ymin': float(box[1]),
                                'ymax': float(box[3]),
                                'class': int(label),
                                'species': label_name,
                                'confidence': float(score),
                                'instanceID': 1
                            }
                            detections.append(detection)

                    output = {
                        'timestamp': timestamp,
                        'userID': 1,
                        'cameraID': 1,
                        'Detections': detections
                    }

                    if detector_output == 'file':
                        # Save JSON file locally
                        with open(f"detected_frames/{rpi}_detection_{int(start_second)}.json", 'w') as f:
                            json.dump(output, f, indent=4)
                        
                        # Save the frame image without bounding boxes
                        image_save_path = f"detected_frames/{rpi}_frame_{int(start_second)}.jpg"
                        cv2.imwrite(image_save_path, detected_frames[rpi][middle_index][0])
                    elif detector_output == 'http':
                        # Send data to the API endpoint
                        _, image = cv2.imencode('.jpg', detected_frames[rpi][middle_index][0])
                        res = post_data(box_api_url, output, image.tobytes(), timeout)
                        if res:
                            print(res)
                        else:
                            print("No http response")    

                # Reset the counters and list
                detection_count[rpi] = 0
                detected_frames[rpi] = []
            start_second = time.time()

        # Break the loop if 'q' is pressed
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
finally:
    cap.release()
    cv2.destroyAllWindows()
