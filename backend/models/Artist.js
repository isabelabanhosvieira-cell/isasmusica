const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/300'
  },
  bio: {
    type: String
  },
  genre: {
    type: String
  },
  followers: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

artistSchema.index({ name: 'text' });

module.exports = mongoose.model('Artist', artistSchema);

