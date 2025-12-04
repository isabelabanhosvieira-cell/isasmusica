const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist',
    required: true
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/300'
  },
  year: {
    type: Number
  },
  genre: {
    type: String
  },
  description: {
    type: String
  }
}, {
  timestamps: true
});

albumSchema.index({ name: 'text' });

module.exports = mongoose.model('Album', albumSchema);

