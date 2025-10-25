// const multer = require("multer");
// const path = require("path");

// // store files temporarily
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, "uploads/"),
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

// const upload = multer({ storage });

// module.exports = upload;


// middlewares/upload.js
const multer = require("multer");
const path = require("path");

// storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // check type by mimetype or extension
    if (file.mimetype === "application/pdf") {
      cb(null, "uploads/documents/"); // pdf files
    } else {
      cb(null, "uploads/"); // excel files
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// filter for pdf and excel only
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "application/vnd.ms-excel", // .xls
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF and Excel files are allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
