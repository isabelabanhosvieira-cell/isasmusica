const express = require('express');
const Artist = require('../models/Artist');

const router = express.Router();

// Obter todos os artistas
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const artists = await Artist.find()
      .skip(skip)
      .limit(limit)
      .sort({ followers: -1 });
    
    const total = await Artist.countDocuments();
    
    res.json({
      artists,
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

// Obter artista por ID
router.get('/:id', async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id);
    
    if (!artist) {
      return res.status(404).json({ message: 'Artista não encontrado' });
    }
    
    res.json(artist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

