const multer = require("multer");
// const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed."), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter, // filter the type of image uploaded.
  fileSize: {
    limits: 1024 * 1024 * 10, // allows only image with less than or 10MB to be uploaded.
  },
});

module.exports = upload;
