const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp"); // ✅ For image cropping
require("dotenv").config({ path: "../.env" });

// AWS S3 Setup
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
});

// Deprecated Multer Logic (Kept for future reference)
// const multer = require("multer");
// const multerS3 = require("multer-s3");
// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image/")) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only image files are allowed"), false);
//   }
// };

// const upload = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: process.env.AWS_BUCKET_NAME,
//     acl: "private",
//     contentType: multerS3.AUTO_CONTENT_TYPE,
//     key: function (req, file, cb) {
//       const uniqueFileName = `${Date.now()}-${uuidv4()}-${file.originalname}`;
//       cb(null, uniqueFileName);
//     },
//   }),
//   fileFilter: fileFilter,
//   limits: { fileSize: 5 * 1024 * 1024 },
// });

/**
 * Unified Image Upload Function
 * @param {Buffer} imageBuffer - Image buffer data
 * @param {boolean} isOriginal - Determines if this is the original image or cropped
 */
const uploadImageToS3 = async (imageBuffer, isOriginal = true) => {
  const imageType = isOriginal ? "original" : "cropped";
  const imageKey = `${Date.now()}-${uuidv4()}-${imageType}.jpg`;

  await s3
    .upload({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: imageKey,
      Body: imageBuffer,
      ContentType: "image/jpeg",
      ACL: "private",
    })
    .promise();

  return imageKey;
};

// Crop Image Function, TODO: Create New Util File in the Futrue
const cropImage = async (originalImageBuffer, xMin, xMax, yMin, yMax) => {
  return await sharp(originalImageBuffer)
    .extract({
      left: Math.round(xMin),
      top: Math.round(yMin),
      width: Math.round(xMax - xMin),
      height: Math.round(yMax - yMin),
    })
    .toBuffer();
};

const generatePresignedUrl = (imageKey) => {
  return s3.getSignedUrl("getObject", {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: imageKey,
    Expires: 3600, // URL expires in 1 hour
  });
};


// const getImageFromS3 = async (req, res) => {
//   const { imageKey } = req.params;
//   try {
//     if (!imageKey) {
//       return res.status(400).json({ error: "Missing image key" });
//     }

//     const params = {
//       Bucket: process.env.AWS_BUCKET_NAME,
//       Key: imageKey,
//     };

//     const s3Object = s3.getObject(params);

//     s3Object.on("httpHeaders", (statusCode, headers) => {
//       res.setHeader("Content-Type", headers["content-type"]);
//       res.setHeader("Content-Length", headers["content-length"]);
//     });

//     s3Object.createReadStream().pipe(res);
//   } catch (error) {
//     console.error("Error retrieving image from S3:", error);
//     res.status(500).json({ error: "Failed to retrieve image" });
//   }
// };

console.log("AWS Upload Module Configured Successfully!");

module.exports = {
  // upload, // Deprecated
  uploadImageToS3,
  cropImage,
  generatePresignedUrl,
  // getImageFromS3,
};
