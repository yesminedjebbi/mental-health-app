const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const cors = require('cors');
const { spawn } = require('child_process');
const User = require('./models/User');
const authRoutes = require('./routes/auth');
const chatbotRoutes = require('./routes/chatbot');
const predictRoutes = require('./routes/predict'); // Assurez-vous d'importer les routes de prédiction

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Routes
console.log('Route /api/predict enregistrée'); // Message de débogage
app.use('/api/predict', predictRoutes); // Utilisation de la route de prédiction
app.use('/api/auth', authRoutes);
app.use('/api', chatbotRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
