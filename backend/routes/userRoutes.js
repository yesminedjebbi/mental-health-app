const express = require("express");
const router = express.Router();
const { signUp, getUsers } = require("../controllers/userController");

// Route pour l'inscription
router.post("/signup", signUp);

// Route pour récupérer tous les utilisateurs (test)
router.get("/", getUsers);

module.exports = router;
