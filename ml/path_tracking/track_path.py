import cv2
import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D

def calculate_distance(x, y, z):
    return np.sqrt(x**2 + y**2 + z**2)

# Read the image using OpenCV
# image_path = 'garden.jpg'  # Change this to the path of your image
# image_path = 'apple.jpg'
# image_path = 'rat_in_garden.jpg'
image_path = 'rat.jpg'

image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)

# Get the dimensions of the image
height, width = image.shape

# Create coordinate arrays for the height and width
X, Y = np.meshgrid(range(width), range(height))

# Create a 3D figure
fig = plt.figure()
ax = fig.add_subplot(111, projection='3d')

# Plot the surface
ax.plot_surface(X, Y, image, cmap='gray')

# Add labels
ax.set_xlabel('X axis')
ax.set_ylabel('Y axis')
ax.set_zlabel('Intensity')

# Show the plot
plt.show()


