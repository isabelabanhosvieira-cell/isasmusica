const express = require('express');
const Playlist = require('../models/Playlist');
const auth = require('../middleware/auth');

const router = express.Router();

// Obter playlists do usuário
router.get('/', auth, async (req, res) => {
  try {
    const playlists = await Playlist.find({ owner: req.user._id })
      .populate('songs')
      .sort({ createdAt: -1 });
    
    res.json(playlists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obter playlist por ID
router.get('/:id', auth, async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id)
      .populate('songs')
      .populate('owner', 'name');
    
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist não encontrada' });
    }
    
    // Verificar se é pública ou do usuário
    if (!playlist.isPublic && playlist.owner._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Acesso negado' });
    }
    
    res.json(playlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Criar nova playlist
router.post('/', auth, async (req, res) => {
  try {
    const playlist = new Playlist({
      ...req.body,
      owner: req.user._id
    });
    await playlist.save();
    res.status(201).json(playlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Adicionar música à playlist
router.post('/:id/songs', auth, async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist não encontrada' });
    }
    
    if (playlist.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Acesso negado' });
    }
    
    const { songId } = req.body;
    if (!playlist.songs.includes(songId)) {
      playlist.songs.push(songId);
      await playlist.save();
    }
    
    res.json(playlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remover música da playlist
router.delete('/:id/songs/:songId', auth, async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist não encontrada' });
    }
    
    if (playlist.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Acesso negado' });
    }
    
    playlist.songs = playlist.songs.filter(
      song => song.toString() !== req.params.songId
    );
    await playlist.save();
    
    res.json(playlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

