const User=require('../models/user');

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

        res.status(201).json({ message: "Utilisateur créé avec succès !" });
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

// Exporter les fonctions du controller
module.exports = { signUp, getUsers };