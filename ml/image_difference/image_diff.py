import cv2
import numpy as np
import sys

def compare_images(img1, img2, threshold_value=50, min_contour_area=500):
    """
    Compare two images and return:
        - is_same (bool): True if no differences found; False otherwise
        - bounding_boxes (list): List of (x, y, w, h) bounding boxes of differences
        - diff_thresh (numpy array): Thresholded difference image (for visualization)
    """

    # 1. Convert images to grayscale (if not already)
    gray1 = cv2.cvtColor(img1, cv2.COLOR_BGR2GRAY)
    gray2 = cv2.cvtColor(img2, cv2.COLOR_BGR2GRAY)

    # 2. Compute absolute difference
    diff = cv2.absdiff(gray1, gray2)

    # 3. Threshold the difference
    _, diff_thresh = cv2.threshold(diff, threshold_value, 255, cv2.THRESH_BINARY)

    # 4. (Optional) Morphological operations to reduce noise
    kernel = np.ones((5, 5), np.uint8)
    diff_thresh = cv2.morphologyEx(diff_thresh, cv2.MORPH_OPEN, kernel)
    diff_thresh = cv2.morphologyEx(diff_thresh, cv2.MORPH_DILATE, kernel)

    # 5. Find contours of differences
    contours, _ = cv2.findContours(diff_thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # 6. Collect bounding boxes for significant contours
    bounding_boxes = []
    for contour in contours:
        area = cv2.contourArea(contour)
        if area >= min_contour_area:
            x, y, w, h = cv2.boundingRect(contour)
            bounding_boxes.append((x, y, w, h))

    # If no bounding boxes were found, images are considered the same
    is_same = len(bounding_boxes) == 0

    return is_same, bounding_boxes, diff_thresh

def main():
    # Check if user provided the paths to two images
    if len(sys.argv) < 3:
        print("Usage: python image_diff_demo.py <path_to_image1> <path_to_image2>")
        sys.exit(1)

    image1_path = sys.argv[1]
    image2_path = sys.argv[2]

    # Read the two images
    img1 = cv2.imread(image1_path)
    img2 = cv2.imread(image2_path)

    # Validate
    if img1 is None:
        print(f"Could not read image from {image1_path}")
        sys.exit(1)
    if img2 is None:
        print(f"Could not read image from {image2_path}")
        sys.exit(1)

    # Optionally, check if images have the same shape
    # (You can decide if you want to handle mismatched dimensions differently)
    if img1.shape != img2.shape:
        print("Warning: Images have different dimensions. Results may not be accurate.")

    # Compare the images
    is_same, bounding_boxes, thresh = compare_images(img1, img2,
                                                     threshold_value=50,
                                                     min_contour_area=500)

    # Print the result
    if is_same:
        print("The images are the same (no differences found).")
    else:
        print("The images are different.")
        print("Bounding boxes for differences:")
        for box in bounding_boxes:
            print(f" - {box}")

        # (Optionally) draw bounding boxes on the first image
        for (x, y, w, h) in bounding_boxes:
            cv2.rectangle(img1, (x, y), (x + w, y + h), (0, 0, 255), 2)

    # Show results (Optional)
    cv2.imshow("Image 1 with Differences Bounded", img1)
    cv2.imshow("Difference (Thresholded)", thresh)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
