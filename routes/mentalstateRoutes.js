// routes/mentalStateRoutes.js
const express = require("express");
const router = express.Router();
const MentalState = require("../models/mentalstate");

// CREATE or UPDATE mental state
router.post("/", async (req, res) => {
  try {
    const { userId, happiness, depression, anxiety, loneliness, anger } = req.body;
    
    const updatedState = await MentalState.findOneAndUpdate(
      { userId },
      { happiness, depression, anxiety, loneliness, anger, lastUpdated: Date.now() },
      { new: true, upsert: true }
    );
    
    res.json(updatedState);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET current mental state
router.get("/:userId", async (req, res) => {
  try {
    const state = await MentalState.findOne({ userId: req.params.userId });
    if (!state) return res.status(404).json({ message: "State not found" });
    res.json(state);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;