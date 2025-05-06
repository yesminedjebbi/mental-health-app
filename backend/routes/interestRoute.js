const express = require("express");
const router = express.Router();
const User = require("../models/user");

// Save or update user interests
router.post("/save", async (req, res) => {
  const { userId, interests } = req.body;

  if (!userId || !interests || !Array.isArray(interests)) {
    return res.status(400).json({ message: "Invalid input data" });
  }

  try {
    const user = await User.findById(userId);
    user.interests=interests;
    await user.save();
    res.status(200).json({ message: "Interests saved successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get user interests
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findOne({ userId });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ interests: user.interests });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;