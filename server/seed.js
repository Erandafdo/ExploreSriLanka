require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Location = require('./models/Location');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/exploresrilanka';
const DATA_FILE = path.join(__dirname, 'data', 'locations.json');

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    
    // Clear existing data
    await Location.deleteMany({});
    
    // Insert new data
    await Location.insertMany(data.locations);
    
    console.log('Successfully seeded database with', data.locations.length, 'locations.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
