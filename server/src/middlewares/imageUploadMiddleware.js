const multer = require("multer");

// Multer Configuration: Store image as buffer in memory
const uploadImage = multer({
  storage: multer.memoryStorage(), // ✅ Store images in memory for processing
  limits: { fileSize: 5 * 1024 * 1024 }, // ✅ Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true); // ✅ Accept image files only
    } else {
      cb(new Error("❌ Only image files are allowed"), false); // ❌ Reject non-image files
    }
  }
});

module.exports = uploadImage;