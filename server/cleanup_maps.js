require('dotenv').config();
const mongoose = require('mongoose');
const Location = require('./models/Location');
const he = require('he');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/exploresrilanka';

const sanitizeMapCode = (code) => {
  if (!code) return '';
  let decoded = he.decode(code);
  if (decoded.includes('<iframe')) {
    const match = decoded.match(/src="([^"]+)"/);
    decoded = match ? match[1] : decoded;
  }
  return decoded.trim().replace(/^["']|["']$/g, '');
};

const cleanup = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for cleanup...');

    const locations = await Location.find();
    for (const loc of locations) {
      const clean = sanitizeMapCode(loc.mapCode);
      if (clean !== loc.mapCode) {
        loc.mapCode = clean;
        await loc.save();
        console.log(`Cleaned mapCode for: ${loc.name}`);
      }
    }
    
    console.log('Cleanup finished!');
    process.exit(0);
  } catch (error) {
    console.error('Cleanup failed:', error);
    process.exit(1);
  }
};

cleanup();
