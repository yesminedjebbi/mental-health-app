const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');

// Load environment variables
dotenv.config();

// Create an Express app
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Use authRoutes for authentication endpoints
app.use('/api/auth', authRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log('MongoDB Connection Error:', err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
