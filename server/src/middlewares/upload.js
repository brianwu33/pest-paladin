const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const s3 = new AWS.S3();

const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_BUCKET_NAME,
    key: function (req, file, cb) {
      const uniqueFileName = `${Date.now()}-${uuidv4()}-${file.originalname}`;
      cb(null, uniqueFileName);
    }
  })
});

module.exports = upload;
