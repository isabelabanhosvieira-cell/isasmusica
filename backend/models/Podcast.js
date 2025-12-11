const mongoose = require('mongoose');

const episodeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  url: {
    type: String,
    required: true
  },
  duration: {
    type: Number
  },
  publishedAt: {
    type: Date,
    default: Date.now
  }
});

const podcastSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  creator: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/300'
  },
  description: {
    type: String
  },
  category: {
    type: String,
    enum: ['technology', 'entertainment', 'history', 'music', 'business', 'other']
  },
  episodes: [episodeSchema],
  followers: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

podcastSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Podcast', podcastSchema);

