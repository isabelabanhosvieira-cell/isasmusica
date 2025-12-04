const express = require('express');
const Song = require('../models/Song');
const Album = require('../models/Album');
const auth = require('../middleware/auth');

const router = express.Router();

// Obter recomendações
router.get('/', async (req, res) => {
  try {
    // Músicas populares
    const popularSongs = await Song.find()
      .populate('artist', 'name image')
      .populate('album', 'name image')
      .sort({ plays: -1, likes: -1 })
      .limit(10);
    
    // Álbuns recentes
    const recentAlbums = await Album.find()
      .populate('artist', 'name image')
      .sort({ createdAt: -1 })
      .limit(10);
    
    res.json({
      featured: popularSongs,
      recentAlbums
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

