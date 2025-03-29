require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json()); // Parse JSON requests
app.use(cors()); // Enable CORS for frontend communication

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Import routes
const interestRoutes = require("./routes/interestRoutes");
app.use("/api/interests", interestRoutes);

const PORT = process.env.PORT || 5000;
/* app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); */
app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));

