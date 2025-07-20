import express from 'express';
import Banner from '../models/HomePageBanner.js';
import upload from '../middleware/upload.js';

const router = express.Router();


// ---------------- Multiple Banners Upload ----------------
router.post('/multi', upload.array('images', 100), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No images uploaded' });
    }

    const { titles } = req.body;  // JSON stringified array

    const titlesArray = JSON.parse(titles);

    const savedBanners = [];

    req.files.forEach((file, index) => {
      const image = `/uploads/${file.filename}`;
      const title = titlesArray[index] || `Banner ${index + 1}`;
      const banner = new Banner({ title, image });
      savedBanners.push(banner);
    });

    await Banner.insertMany(savedBanners);

    res.status(201).json({ message: 'Banners uploaded successfully', savedBanners });
  } catch (err) {
    console.error('Multi Upload Error:', err);
    res.status(500).json({ error: 'Failed to upload banners' });
  }
});

// ---------------- Get All Banners ----------------
router.get('/', async (req, res) => {
  try {
    const banners = await Banner.find().sort({ _id: -1 });
    if (!banners.length) return res.status(404).json({ message: 'No banners found' });
    res.json(banners);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch banners' });
      }
    });

// Replace a Single Banner’s Image/Title by ID
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ error: 'Banner not found' });

    if (req.body.title) banner.title = req.body.title;

    if (req.file) {
      const fs = await import('fs');
      const path = await import('path');
      const oldImagePath = path.join('uploads', path.basename(banner.image));
      if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);

      banner.image = `/uploads/${req.file.filename}`;
    }

    await banner.save();

    res.json({ message: 'Banner updated successfully', banner });
  } catch (err) {
    console.error('Update Banner Error:', err);
    res.status(500).json({ error: 'Failed to update banner' });
  }
});

// Delete a Single Banner by ID (No Replacement)
router.delete('/:id', async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ error: 'Banner not found' });

    const fs = await import('fs');
    const path = await import('path');
    const imagePath = path.join('uploads', path.basename(banner.image));
    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);

    await banner.deleteOne();

    res.json({ message: 'Banner deleted successfully' });
  } catch (err) {
    console.error('Delete Banner Error:', err);
    res.status(500).json({ error: 'Failed to delete banner' });
  }
});


export default router;

router.get('/test', (req, res) => {
  res.send('Banner Route Working');
});
