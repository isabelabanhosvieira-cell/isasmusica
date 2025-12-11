const express = require('express');
const Song = require('../models/Song');
const auth = require('../middleware/auth');

const router = express.Router();

// Obter todas as músicas (com paginação)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const songs = await Song.find()
      .populate('artist', 'name image')
      .populate('album', 'name image')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    const total = await Song.countDocuments();
    
    res.json({
      songs,
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

// Obter música por ID
router.get('/:id', async (req, res) => {
  try {
    const song = await Song.findById(req.params.id)
      .populate('artist', 'name image')
      .populate('album', 'name image');
    
    if (!song) {
      return res.status(404).json({ message: 'Música não encontrada' });
    }
    
    res.json(song);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Buscar músicas
router.get('/search', async (req, res) => {
  try {
    const query = req.query.q;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const songs = await Song.find({ $text: { $search: query } })
      .populate('artist', 'name image')
      .populate('album', 'name image')
      .skip(skip)
      .limit(limit);
    
    res.json({ songs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Criar nova música (requer autenticação)
router.post('/', auth, async (req, res) => {
  try {
    const song = new Song(req.body);
    await song.save();
    res.status(201).json(song);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

