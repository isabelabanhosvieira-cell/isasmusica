const express = require('express');
const Podcast = require('../models/Podcast');

const router = express.Router();

// Obter todos os podcasts
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const podcasts = await Podcast.find()
      .skip(skip)
      .limit(limit)
      .sort({ followers: -1 });
    
    const total = await Podcast.countDocuments();
    
    res.json({
      podcasts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obter podcast por ID
router.get('/:id', async (req, res) => {
  try {
    const podcast = await Podcast.findById(req.params.id);
    
    if (!podcast) {
      return res.status(404).json({ message: 'Podcast não encontrado' });
    }
    
    res.json(podcast);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Seguir podcast
router.post('/:id/follow', async (req, res) => {
  try {
    const podcast = await Podcast.findById(req.params.id);
    
    if (!podcast) {
      return res.status(404).json({ message: 'Podcast não encontrado' });
    }
    
    podcast.followers += 1;
    await podcast.save();
    
    res.json(podcast);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

