import socket
import time
import imagezmq
import pyrealsense2 as rs
import numpy as np
import cv2

# Initialize ImageSender to send images to a receiver
sender = imagezmq.ImageSender(connect_to='tcp://10.34.59.143:5555')

rpi_name = socket.gethostname()  # send device hostname with each image

# Configure Intel RealSense camera
pipeline = rs.pipeline()
config = rs.config()
config.enable_stream(rs.stream.color, 640, 480, rs.format.bgr8, 30)
config.enable_stream(rs.stream.depth, 640, 480, rs.format.z16, 30)
pipeline.start(config)

time.sleep(2)  # allow camera sensor to warm up

try:
    while True:  # send images as stream until Ctrl-C
        start_time = time.time()

        frames = pipeline.wait_for_frames()
        color_frame = frames.get_color_frame()
        depth_frame = frames.get_depth_frame()
        if not color_frame or not depth_frame:
            continue

        color_image = np.asanyarray(color_frame.get_data())
        depth_image = np.asanyarray(depth_frame.get_data())

        # Convert depth image to 8-bit for visualization
        depth_image_8bit = cv2.convertScaleAbs(depth_image, alpha=0.03)

        # Send the color image
        sender.send_image(f"{rpi_name}_color", color_image)
        
        # Send the depth image
        sender.send_image(f"{rpi_name}_depth", depth_image_8bit)

        # Calculate elapsed time and adjust sleep interval to send images 10 times per second
        elapsed_time = time.time() - start_time
        sleep_time = max(0, (1.0 / 10) - elapsed_time)
        time.sleep(sleep_time)

finally:
    pipeline.stop()
