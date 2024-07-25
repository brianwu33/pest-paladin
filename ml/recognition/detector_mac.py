# This is a temporary implementation for the demo
# This reads from the camera, runs object detection, and sends detection data and video stream to the server
# Later each of these will be split into their own components
# Raspberry PI - read from camera, preprocessing, send video stream to hub computer
# Hub computer - read from raspberry PI(s), send video stream(s) to server
# Server - object detection and other heavy processing

import time
import torch
import cv2
from PIL import Image
import numpy as np
import os
import json
from datetime import datetime
import asyncio
import aiohttp

# Check if a GPU is available
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# Load the YOLOv5 model
model = torch.hub.load('ultralytics/yolov5', 'custom', path='weights/best.pt', force_reload=True).to(device)
model.eval()

# Variable to select the camera source ('webcam' or 'realsense')
camera_source = 'webcam'  # Change this to 'realsense' to use the Realsense camera

# Set the desired frames per second (fps)
desired_fps = 10
frame_time = 1.0 / desired_fps

# Parameters for detection and saving frames
min_detected_frames = 3  # Minimum number of frames with detections
min_confidence = 0.5  # Confidence threshold (50%)
detection_count = 0
detected_frames = []

# Directory to save detected frames
os.makedirs('detected_frames', exist_ok=True)

# Variable to select the output method ('file' or 'http')
detector_output = 'file'  # Change this to 'http' to post data to an API endpoint

# API endpoint URL (only used if detector_output is 'http')
box_api_url = 'https://example.com/api:port'  # Replace with your actual API endpoint

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
async def post_data(url, data):
    async with aiohttp.ClientSession() as session:
        async with session.post(url, json=data) as response:
            pass

# Configure the camera streams
if camera_source == 'webcam':
    cap = cv2.VideoCapture(0)

time.sleep(3) # Let camera warm up
start_second = time.time()

try:
    while True:
        start_time = time.time()

        if camera_source == 'webcam':
            ret, frame = cap.read()
            if not ret:
                break
            distance = None

        # Process the frame
        boxes, scores, labels, label_names, runtime = process_frame(frame)

        # Check if the detection meets the confidence threshold
        if any(score > min_confidence for score in scores):
            detection_count += 1
            detected_frames.append((frame, boxes, scores, labels, label_names, distance))

        # Draw bounding boxes on the frame
        for box, score, label_names in zip(boxes, scores, label_names):
            if score > min_confidence:
                x1, y1, x2, y2 = map(int, box)
                cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                cv2.putText(frame, f"{label_names}: {score:.2f}", (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)

        # Display the frame
        cv2.imshow('Detection', frame)

        # Calculate elapsed time and sleep if necessary to maintain the desired fps
        elapsed_time = time.time() - start_time
        if elapsed_time < frame_time:
            time.sleep(frame_time - elapsed_time)

        # Check if a second has passed
        if time.time() - start_second >= 1:
            if detection_count >= min_detected_frames:
                middle_index = len(detected_frames) // 2
                frame, boxes, scores, labels, label_names, distance = detected_frames[middle_index]

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
                        }
                        detections.append(detection)

                output = {
                    'timestamp': timestamp,
                    'userID': 0,
                    'cameraID': 0,
                    'Detections': detections
                }

                if detector_output == 'file':
                    with open(f"detected_frames/detection_{int(start_second)}.json", 'w') as f:
                        json.dump(output, f, indent=4)
                elif detector_output == 'http':
                    asyncio.run(post_data(box_api_url, output))

            # Reset the counters and list
            detection_count = 0
            detected_frames = []
            start_second = time.time()

        # Break the loop if 'q' is pressed
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
finally:
    if camera_source == 'webcam':
        cap.release()
    cv2.destroyAllWindows()
