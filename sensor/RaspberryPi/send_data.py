import requests
import json
from datetime import datetime

d_metaData_url = "http://localhost:3001/data" # use express erver IP
d_details_url = "http://localhost:3001/data" # use express erver IP
t_metaData_url = "http://localhost:3001/data" # use express erver IP
t_details_url = "http://localhost:3001/data" # use express erver IP
d_details_url = "http://localhost:3001/api/detection/uploadDetection"


# define some min confidence threshold
min_confidence = 0.5

def create_json_output(rpi_name, boxes, scores, labels, label_names):
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
                'confidence': float(score)
            }
            detections.append(detection)
            
    output = {
        'timestamp': datetime.utcnow().isoformat(),
        'userID': 1,
        'cameraID': 1,
        'Detections': detections
    }
    
    return output

# sample
rpi_name = "RaspberryPi_1"
boxes = [[10, 20, 50, 60], [30, 40, 70, 80]]
scores = [0.9, 0.7]
labels = [1, 2]
label_names = ["rat", "squirrel"]

response = requests.post(url, json=json_data)

# testing
try:
    response = requests.post(url, json=json_data)
    response.raise_for_status()  # Raise error if request fails
    print("Response from server:", response.json())  # Print server response
except requests.exceptions.RequestException as e:
    print("Error sending data:", e)