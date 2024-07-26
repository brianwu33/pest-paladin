import socket
import time
import imagezmq
import cv2

# Initialize ImageSender to send images to a receiver
sender = imagezmq.ImageSender(connect_to='tcp://localhost:5555')

rpi_name = socket.gethostname()  # send device hostname with each image

# Configure webcam
cap = cv2.VideoCapture(0)
cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1920)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 1080)

time.sleep(2)  # allow camera sensor to warm up

try:
    while True:  # send images as stream until Ctrl-C
        ret, frame = cap.read()
        if not ret:
            continue

        # Send the color image
        sender.send_image(f"{rpi_name}_webcam", frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

finally:
    cap.release()
    cv2.destroyAllWindows()
