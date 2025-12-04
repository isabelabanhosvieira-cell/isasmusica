const express = require('express');
const History = require('../models/History');
const auth = require('../middleware/auth');

const router = express.Router();

// Obter histórico do usuário
router.get('/', auth, async (req, res) => {
  try {
    const history = await History.find({ user: req.user._id })
      .populate('song')
      .sort({ playedAt: -1 })
      .limit(50);
    
    res.json(history.map(h => h.song));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Adicionar ao histórico
router.post('/', auth, async (req, res) => {
  try {
    const { songId } = req.body;
    
    const history = new History({
      user: req.user._id,
      song: songId
    });
    await history.save();
    
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

