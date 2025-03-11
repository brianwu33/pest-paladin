import cv2
from flask import Flask, Response
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allows React to access this server

# Open webcam
cap = cv2.VideoCapture(0, cv2.CAP_AVFOUNDATION)  # For Mac
# cap = cv2.VideoCapture(0)  # For other systems

def generate_frames():
    while True:
        success, frame = cap.read()
        if not success:
            break
        else:
            # Encode frame as JPEG
            _, buffer = cv2.imencode('.jpg', frame)
            frame_bytes = buffer.tobytes()
            
            # Yield frame as an MJPEG stream
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3003, debug=True)
