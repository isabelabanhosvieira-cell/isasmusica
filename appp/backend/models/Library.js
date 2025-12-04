const mongoose = require('mongoose');

const librarySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  songs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Song'
  }],
  albums: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album'
  }],
  playlists: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Playlist'
  }],
  podcasts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Podcast'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Library', librarySchema);

