const express = require("express");
const router = express.Router();
const { signUp, getUsers,login} = require("../controllers/userController");

// Route pour l'inscription
router.post("/signup", signUp);
router.post("/login",login);

// Route pour récupérer tous les utilisateurs (test)
router.get("/", getUsers);

module.exports = router;
