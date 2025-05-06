const express = require("express");
const router = express.Router();
const { signUp, getUserbyId,login,getMentalHistory} = require("../controllers/userController");

// Route pour l'inscription
router.post("/signup", signUp);
router.post("/login",login);

// Route pour récupérer tous les utilisateurs (test)
router.get("/:userId", getUserbyId);
router.get('/:userId/history',getMentalHistory);

module.exports = router;
