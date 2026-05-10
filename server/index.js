require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const mongoose = require('mongoose');
const Location = require('./models/Location');

const app = express();
const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/exploresrilanka';

// MongoDB Connection
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root Route
app.get('/', (req, res) => {
  res.json({ message: 'Explore Sri Lanka API (MongoDB) is running' });
});

// Multer Setup for Image Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// API Routes
app.get('/api/locations', async (req, res) => {
  try {
    const locations = await Location.find().sort({ createdAt: -1 });
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching locations' });
  }
});

app.get('/api/locations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const decodedId = decodeURIComponent(id);
    
    // Find and Increment Views
    const location = await Location.findOneAndUpdate(
      {
        $or: [
          { id: id },
          { id: decodedId },
          { name: id },
          { name: decodedId }
        ]
      },
      { $inc: { views: 1 } },
      { new: true }
    );
    
    if (location) {
      res.json(location);
    } else {
      res.status(404).json({ message: 'Location not found' });
    }
  } catch (error) {
    console.error('Error fetching location:', error);
    res.status(500).json({ message: 'Error fetching location' });
  }
});

// Add Review Endpoint
app.post('/api/locations/:id/reviews', async (req, res) => {
  try {
    const { id } = req.params;
    const { user, rating, comment } = req.body;
    
    const location = await Location.findOneAndUpdate(
      { id: id },
      { 
        $push: { 
          reviews: { 
            user: user || 'Anonymous', 
            rating: rating || 5, 
            comment,
            date: new Date()
          } 
        } 
      },
      { new: true }
    );
    
    if (location) {
      res.json(location);
    } else {
      res.status(404).json({ message: 'Location not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error adding review' });
  }
});
// Delete Review Endpoint
app.delete('/api/locations/:id/reviews/:reviewId', async (req, res) => {
  try {
    const { id, reviewId } = req.params;
    console.log(`Attempting to delete review ${reviewId} from location ${id}`);
    
    const location = await Location.findOneAndUpdate(
      { id: id },
      { $pull: { reviews: { _id: new mongoose.Types.ObjectId(reviewId) } } },
      { new: true }
    );
    
    if (location) {
      console.log('Review deleted successfully');
      res.json(location);
    } else {
      console.log('Location not found');
      res.status(404).json({ message: 'Location not found' });
    }
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Error deleting review', error: error.message });
  }
});


// Upload Endpoint
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (req.file) {
    // Dynamically resolve base URL
    const baseUrl = process.env.BACKEND_URL || `${req.protocol}://${req.get('host')}`;
    res.json({ url: `${baseUrl}/uploads/${req.file.filename}` });
  } else {
    res.status(400).json({ message: 'No file uploaded' });
  }
});

const he = require('he');

// Helper to sanitize map code
const sanitizeMapCode = (code) => {
  if (!code) return '';
  let decoded = he.decode(code);
  if (decoded.includes('<iframe')) {
    const match = decoded.match(/src="([^"]+)"/);
    decoded = match ? match[1] : decoded;
  }
  return decoded.trim().replace(/^["']|["']$/g, '');
};

// Admin Routes (Update)
app.put('/api/locations/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: 'Database not connected. Please check MONGODB_URI.' });
    }
    
    const updateData = { ...req.body };
    if (updateData.mapCode) {
      updateData.mapCode = sanitizeMapCode(updateData.mapCode);
    }

    const updatedLocation = await Location.findOneAndUpdate(
      { id: req.params.id },
      updateData,
      { new: true }
    );
    
    if (updatedLocation) {
      res.json(updatedLocation);
    } else {
      res.status(404).json({ message: 'Location not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating data', error: error.message });
  }
});

// Admin Routes (Add)
app.post('/api/locations', async (req, res) => {
  try {
    // Check if DB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: 'Database not connected. Check your MongoDB Atlas whitelist/URI.' });
    }

    const newLocData = {
      id: req.body.name.toLowerCase().replace(/\s+/g, '-'),
      ...req.body
    };
    
    if (newLocData.mapCode) {
      newLocData.mapCode = sanitizeMapCode(newLocData.mapCode);
    }

    const newLocation = new Location(newLocData);
    await newLocation.save();
    res.status(201).json(newLocation);
  } catch (error) {
    console.error('Error adding location:', error);
    res.status(500).json({ message: 'Error adding data', error: error.message });
  }
});


// Admin Routes (Delete)
app.delete('/api/locations/:id', async (req, res) => {
  try {
    const deletedLocation = await Location.findOneAndDelete({ id: req.params.id });
    if (deletedLocation) {
      res.json(deletedLocation);
    } else {
      res.status(404).json({ message: 'Location not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
