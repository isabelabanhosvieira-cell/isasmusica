const express = require('express');
const Album = require('../models/Album');
const Song = require('../models/Song');

const router = express.Router();

// Obter todos os álbuns
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const albums = await Album.find()
      .populate('artist', 'name image')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    const total = await Album.countDocuments();
    
    res.json({
      albums,
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

// Obter álbum por ID
router.get('/:id', async (req, res) => {
  try {
    const album = await Album.findById(req.params.id)
      .populate('artist', 'name image');
    
    if (!album) {
      return res.status(404).json({ message: 'Álbum não encontrado' });
    }
    
    res.json(album);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obter músicas do álbum
router.get('/:id/songs', async (req, res) => {
  try {
    const songs = await Song.find({ album: req.params.id })
      .populate('artist', 'name image')
      .sort({ trackNumber: 1 });
    
    res.json(songs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

