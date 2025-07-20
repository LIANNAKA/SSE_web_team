import express from 'express';
import upload from '../middleware/upload.js';  

const router = express.Router();

router.post('/upload-image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file uploaded' });
  }
  res.status(200).json({
    message: 'Image uploaded successfully',
    imageUrl: `/uploads/${req.file.filename}`,
  });
});

export default router;
