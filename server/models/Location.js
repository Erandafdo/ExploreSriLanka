const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  district: { type: String, required: true },
  category: { type: String, required: true },
  rating: { type: String, default: '5.0' },
  description: { type: String, required: true },
  image: { type: String, default: '/landscape.png' },
  thumbnail: { type: String, default: '/landscape.png' },
  bestTime: String,
  duration: String,
  highlights: [String],
  mapCode: String,
  views: { type: Number, default: 0 },
  reviews: [{
    user: String,
    rating: Number,
    comment: String,
    date: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Location', LocationSchema);
