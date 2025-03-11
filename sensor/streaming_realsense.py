import cv2
import numpy as np
import pyrealsense2 as rs
from flask import Flask, Response
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allows React to access this server

# Initialize RealSense pipeline
pipeline = rs.pipeline()
config = rs.config()
config.enable_stream(rs.stream.color, 640, 480, rs.format.bgr8, 30)  # RGB Stream
config.enable_stream(rs.stream.depth, 640, 480, rs.format.z16, 30)   # Depth Stream

# Start the pipeline
pipeline.start(config)

def generate_color_frames():
    """Capture and stream color frames from RealSense camera."""
    while True:
        frames = pipeline.wait_for_frames()
        color_frame = frames.get_color_frame()

        if not color_frame:
            continue

        # Convert RealSense frame to numpy array (BGR format)
        color_image = np.asanyarray(color_frame.get_data())

        # Encode frame as JPEG
        _, buffer = cv2.imencode('.jpg', color_image)
        frame_bytes = buffer.tobytes()

        # Yield frame as an MJPEG stream
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

def generate_depth_frames():
    """Capture and stream depth frames from RealSense camera."""
    colormap = cv2.COLORMAP_JET  # Colorized depth map
    while True:
        frames = pipeline.wait_for_frames()
        depth_frame = frames.get_depth_frame()

        if not depth_frame:
            continue

        # Convert depth frame to numpy array (16-bit)
        depth_image = np.asanyarray(depth_frame.get_data())

        # Normalize depth values to 0-255 for display
        depth_colored = cv2.applyColorMap(cv2.convertScaleAbs(depth_image, alpha=0.03), colormap)

        # Encode frame as JPEG
        _, buffer = cv2.imencode('.jpg', depth_colored)
        frame_bytes = buffer.tobytes()

        # Yield frame as an MJPEG stream
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

@app.route('/color_feed')
def color_feed():
    """Endpoint for streaming RealSense color frames."""
    return Response(generate_color_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/depth_feed')
def depth_feed():
    """Endpoint for streaming RealSense depth frames (colorized)."""
    return Response(generate_depth_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == "__main__":
    print("RealSense Flask Streaming Server running on:")
    print("📷 Color Stream: http://localhost:3003/color_feed")
    print("🌊 Depth Stream: http://localhost:3003/depth_feed")
    app.run(host="0.0.0.0", port=3003, debug=True)
