const User=require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// fonction de signUp
const signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email déjà utilisé" });
        }

        // Créer un nouvel utilisateur
        const newUser = new User({ name, email, password });
        await newUser.save();

        res.status(201).json({ newUser});
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};
const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
  
      if (user.password !== password) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
  
      // Pas de token ici, on renvoie juste l'utilisateur
      res.json({ message: "Login successful", user });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };

// Exporter les fonctions du controller
module.exports = { signUp, getUsers ,login};