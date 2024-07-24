import pyrealsense2 as rs
import numpy as np
import cv2
import websocket
import json
import threading
import time

# Initialize RealSense pipeline
pipeline = rs.pipeline()
config = rs.config()
config.enable_stream(rs.stream.color, 640, 480, rs.format.bgr8, 30)
pipeline.start(config)

# WebSocket client setup
ws = websocket.WebSocket()

def on_message(ws, message):
    print("Received message from server:", message)

def on_error(ws, error):
    print("Error:", error)

def on_close(ws, close_status_code, close_msg):
    print("WebSocket closed:", close_status_code, close_msg)

def on_open(ws):
    print("WebSocket connection established")
    # Send initial signal to server (if needed)

def send_video_stream():
    while True:
        frames = pipeline.wait_for_frames()
        color_frame = frames.get_color_frame()
        if not color_frame:
            continue
        
        # Convert image to numpy array
        color_image = np.asanyarray(color_frame.get_data())
        
        # Compress the image to JPEG format
        _, buffer = cv2.imencode('.jpg', color_image)
        jpg_as_text = buffer.tobytes()
        
        # Send the frame over the WebSocket
        ws.send(jpg_as_text, opcode=websocket.ABNF.OPCODE_BINARY)
        
        # Sleep briefly to limit frame rate
        time.sleep(1/30) # 30 FPS

# Start WebSocket connection
ws_url = "ws://localhost:4000"  # Replace with your WebSocket server URL
ws.on_open = on_open
ws.on_message = on_message
ws.on_error = on_error
ws.on_close = on_close

ws.connect(ws_url)

# Start a thread to send the video stream
video_thread = threading.Thread(target=send_video_stream)
video_thread.start()
