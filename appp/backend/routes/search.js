const express = require('express');
const Song = require('../models/Song');
const Album = require('../models/Album');
const Artist = require('../models/Artist');
const Playlist = require('../models/Playlist');
const Podcast = require('../models/Podcast');

const router = express.Router();

// Busca geral
router.get('/', async (req, res) => {
  try {
    const query = req.query.q || '';
    const filter = req.query.filter || 'all';
    
    if (!query) {
      return res.json({
        songs: [],
        albums: [],
        artists: [],
        playlists: [],
        podcasts: []
      });
    }
    
    const results = {};
    
    if (filter === 'all' || filter === 'songs') {
      results.songs = await Song.find({ $text: { $search: query } })
        .populate('artist', 'name')
        .limit(10);
    }
    
    if (filter === 'all' || filter === 'albums') {
      results.albums = await Album.find({ $text: { $search: query } })
        .populate('artist', 'name')
        .limit(10);
    }
    
    if (filter === 'all' || filter === 'artists') {
      results.artists = await Artist.find({ $text: { $search: query } })
        .limit(10);
    }
    
    if (filter === 'all' || filter === 'playlists') {
      results.playlists = await Playlist.find({ $text: { $search: query } })
        .limit(10);
    }
    
    if (filter === 'all' || filter === 'podcasts') {
      results.podcasts = await Podcast.find({ $text: { $search: query } })
        .limit(10);
    }
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

