const AWS = require("aws-sdk");
require("dotenv").config();

// Configure AWS S3
const s3 = new AWS.S3({
    region: "us-east-1", // Change to your AWS region
    signatureVersion: "v4"
});

// Function to Generate Pre-Signed URL
async function getSignedUrl(fileName, fileType) {
    const params = {
        Bucket: process.env.AWS_S3_BUCKET, // Your bucket name
        Key: `uploads/${fileName}`, // File path in S3
        Expires: 60 * 5, // Expiry time in seconds (5 minutes)
        ContentType: fileType
    };

    const url = await s3.getSignedUrlPromise("putObject", params);
    return url;
}

module.exports = { getSignedUrl };
