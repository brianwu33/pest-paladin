import numpy as np
import cv2 as cv
import time
import json
import torch
from torchvision import transforms
from PIL import Image

# Load the YOLOv5 model
model = torch.hub.load('ultralytics/yolov5', 'custom', path='weights/yolov5m_v2.pt')

# Initialize the camera
cap = cv.VideoCapture(0)
if not cap.isOpened():
    print("Cannot open camera")
    exit()

# Store the last captured frame
last_frame = None

# Minimum size of detected difference (width * height)
MIN_DIFF_SIZE = 500  # Adjust this value as needed

def get_gray_frame():
    """Captures a frame and converts it to grayscale."""
    ret, frame = cap.read()
    if not ret:
        print("Can't receive frame. Exiting...")
        return None, None
    return frame, cv.cvtColor(frame, cv.COLOR_BGR2GRAY)

def get_combined_bounding_box(boxes):
    """Combines all detected bounding boxes into a single bounding box."""
    if not boxes:
        return None
    
    x_min = min([x for x, _, _, _ in boxes])
    y_min = min([y for _, y, _, _ in boxes])
    x_max = max([x + w for x, _, w, _ in boxes])
    y_max = max([y + h for _, y, _, h in boxes])
    
    return (x_min, y_min, x_max - x_min, y_max - y_min)

def run_yolo_on_region(frame, bbox):
    """Runs YOLO on the extracted image difference region."""
    if bbox is None:
        return
    
    x, y, w, h = bbox
    cropped_region = frame[y:y+h, x:x+w]  # Extract the region of interest
    
    # Convert to PIL Image for YOLO processing
    image = Image.fromarray(cv.cvtColor(cropped_region, cv.COLOR_BGR2RGB))
    
    # Run YOLO detection
    results = model(image)
    
    # Print YOLO results
    print("YOLO Object Detection Results:")
    print(results.pandas().xyxy[0])  # Print detected objects as a DataFrame
    
    # Draw detected objects on the cropped region
    for _, row in results.pandas().xyxy[0].iterrows():
        x1, y1, x2, y2, conf, cls, name = row[['xmin', 'ymin', 'xmax', 'ymax', 'confidence', 'class', 'name']]
        cv.rectangle(cropped_region, (int(x1), int(y1)), (int(x2), int(y2)), (255, 0, 0), 2)
        cv.putText(cropped_region, f"{name} ({conf:.2f})", (int(x1), int(y1)-10),
                   cv.FONT_HERSHEY_SIMPLEX, 0.5, (255, 0, 0), 2)
    
    # Show the detected objects
    cv.imshow("YOLO Detection", cropped_region)

diff_data = []
print("Press 'q' to exit")

while True:
    frame, gray_frame = get_gray_frame()
    
    if gray_frame is None:
        break
    
    if last_frame is not None:
        # Compute the absolute difference between the current frame and the last frame
        diff = cv.absdiff(last_frame, gray_frame)
        
        # Apply a threshold to highlight differences
        _, thresh = cv.threshold(diff, 50, 255, cv.THRESH_BINARY)  # Increased threshold to reduce sensitivity
        
        # Find contours of the differences
        contours, _ = cv.findContours(thresh, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE)
        
        # Draw bounding boxes around significant differences and store them
        diff_locations = []
        for cnt in contours:
            x, y, w, h = cv.boundingRect(cnt)
            if w * h > MIN_DIFF_SIZE:  # Only consider large differences
                diff_locations.append((x, y, w, h))
        
        # Get a single combined bounding box
        final_bbox = get_combined_bounding_box(diff_locations)
        
        # Draw final bounding box and print it
        if final_bbox:
            print("Final bounding box for significant differences:")
            print(f" - {final_bbox}")
            x, y, w, h = final_bbox
            cv.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
            
            # Run YOLO on detected difference region
            run_yolo_on_region(frame, final_bbox)
        
        diff_data.append({"timestamp": time.time(), "difference": final_bbox})
        
        # Display the difference
        cv.imshow('Differences', frame)
    
    # Update last frame
    last_frame = gray_frame
    
    # Wait for 2 seconds before capturing the next frame
    if cv.waitKey(2000) & 0xFF == ord('q'):
        break

# Save difference locations to a JSON file
with open("image_differences.json", "w") as json_file:
    json.dump(diff_data, json_file, indent=4)

# Release the capture and close windows
cap.release()
cv.destroyAllWindows()
