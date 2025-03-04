import cv2
import os
import time

# Create the dataset folder if it doesn't exist
output_dir = "dataset2"
os.makedirs(output_dir, exist_ok=True)

# Initialize the webcam
cap = cv2.VideoCapture(0)  # 0 is the default camera

if not cap.isOpened():
    print("Error: Could not open webcam.")
    exit()

image_count = 0

try:
    while True:
        ret, frame = cap.read()
        if not ret:
            print("Failed to capture image")
            break

        # Generate filename with timestamp
        filename = os.path.join(output_dir, f"image_{image_count:04d}.jpg")

        # Save the image
        cv2.imwrite(filename, frame)
        print(f"Saved: {filename}")

        image_count += 1
        time.sleep(2)  # Wait for 2 seconds

except KeyboardInterrupt:
    print("\nStopping the capture process.")

finally:
    cap.release()
    cv2.destroyAllWindows()

