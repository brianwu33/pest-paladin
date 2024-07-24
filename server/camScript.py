import pyrealsense2 as rs
import numpy as np
import socket
import pickle
import struct

def open_pipeline():
    pipeline = rs.pipeline()
    config = rs.config()
    config.enable_stream(rs.stream.depth, 640, 480, rs.format.z16, 30)
    pipeline.start(config)
    return pipeline

def get_depth_frame(pipeline):
    frames = pipeline.wait_for_frames()
    depth_frame = frames.get_depth_frame()
    if not depth_frame:
        return None
    depth_image = np.asanyarray(depth_frame.get_data())
    return depth_image

def send_depth_data(ip, port):
    pipeline = open_pipeline()
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    client_socket.connect((ip, port))
    payload_size = struct.calcsize("L")

    while True:
        depth_image = get_depth_frame(pipeline)
        if depth_image is not None:
            data = pickle.dumps(depth_image)
            client_socket.sendall(struct.pack("L", len(data)) + data)

if __name__ == "__main__":
    send_depth_data('localhost', 8080)
