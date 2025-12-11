const express = require('express');
const Library = require('../models/Library');
const auth = require('../middleware/auth');

const router = express.Router();

// Obter biblioteca do usuário
router.get('/', auth, async (req, res) => {
  try {
    let library = await Library.findOne({ user: req.user._id })
      .populate('songs')
      .populate('albums')
      .populate('playlists')
      .populate('podcasts');
    
    if (!library) {
      library = new Library({ user: req.user._id });
      await library.save();
    }
    
    res.json(library);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Adicionar à biblioteca
router.post('/', auth, async (req, res) => {
  try {
    const { type, id } = req.body;
    
    let library = await Library.findOne({ user: req.user._id });
    if (!library) {
      library = new Library({ user: req.user._id });
    }
    
    if (type === 'song' && !library.songs.includes(id)) {
      library.songs.push(id);
    } else if (type === 'album' && !library.albums.includes(id)) {
      library.albums.push(id);
    } else if (type === 'podcast' && !library.podcasts.includes(id)) {
      library.podcasts.push(id);
    }
    
    await library.save();
    res.json(library);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remover da biblioteca
router.delete('/:type/:id', auth, async (req, res) => {
  try {
    const { type, id } = req.params;
    
    const library = await Library.findOne({ user: req.user._id });
    if (!library) {
      return res.status(404).json({ message: 'Biblioteca não encontrada' });
    }
    
    if (type === 'song') {
      library.songs = library.songs.filter(s => s.toString() !== id);
    } else if (type === 'album') {
      library.albums = library.albums.filter(a => a.toString() !== id);
    } else if (type === 'podcast') {
      library.podcasts = library.podcasts.filter(p => p.toString() !== id);
    }
    
    await library.save();
    res.json(library);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

