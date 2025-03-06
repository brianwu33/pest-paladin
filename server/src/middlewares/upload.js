const multer = require("multer");
const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config({ path: "../.env" });

// AWS S3 Setup (v2)
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
});

// Ensure Environment Variables Exist
if (!process.env.AWS_BUCKET_NAME) {
  console.error("AWS_BUCKET_NAME is missing from .env file.");
  process.exit(1);
}

// File Filter to Accept Only Images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

// Multer-S3 Storage Configuration (AWS SDK v2)
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    acl: "private", // Set to "public-read" if needed
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      console.log("Processing file:", file.originalname);
      const uniqueFileName = `${Date.now()}-${uuidv4()}-${file.originalname}`;
      cb(null, uniqueFileName);
    },
  }),
  fileFilter: fileFilter, // Ensure only image files are accepted
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

const generatePresignedUrl = (imageKey) => {
  console.log("Hi I'm here")
  return s3.getSignedUrl("getObject", {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: imageKey,
    Expires: 3600, // URL expires in 1 hour
  });
};

const getImageFromS3 = async (req, res) => {
  const { imageKey } = req.params; // Get the image key from the URL

  try {
    if (!imageKey) {
      return res.status(400).json({ error: "Missing image key" });
    }

    console.log("Fetching image from S3:", imageKey);

    // Create S3 getObject request
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: imageKey,
    };

    // Get the object from S3
    const s3Object = s3.getObject(params);

    // Set response headers before streaming the data
    s3Object.on("httpHeaders", (statusCode, headers) => {
      res.setHeader("Content-Type", headers["content-type"]);
      res.setHeader("Content-Length", headers["content-length"]);
    });

    // Pipe the S3 stream to the response
    s3Object.createReadStream().pipe(res);

  } catch (error) {
    console.error("Error retrieving image from S3:", error);
    res.status(500).json({ error: "Failed to retrieve image" });
  }
};

console.log("Multer-S3 Configured Successfully (AWS SDK v2)!");

module.exports = {
  upload,
  generatePresignedUrl,
  getImageFromS3
};
