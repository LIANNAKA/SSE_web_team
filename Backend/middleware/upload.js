import multer from 'multer';
import path from 'path';

// Storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');  // Make sure 'uploads' folder exists in root
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));  // example: 1720000000.jpg
  }
});

// File filter (optional) — accept only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mime = allowedTypes.test(file.mimetype);
  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, JPEG, PNG images are allowed'));
  }
};


const upload = multer({
  storage,
  fileFilter,
});

export default upload;
