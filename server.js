const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const User = require('./models/User');
const authRoutes = require('./routes/auth');
const chatbotRoutes = require('./routes/chatbot');
const predictRoutes = require('./routes/predict');

// Charger les variables d'environnement
dotenv.config();

// Créer l'application Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());  // Utiliser express.json() pour parser le JSON

// Connexion MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Route pour mettre à jour la photo de profil
app.post('/api/updateProfilePicture', async (req, res) => {
  const { _id, profilePicture } = req.body;

  if (!_id || !profilePicture) {
    return res.status(400).json({ message: 'Erreur: L\'ID et la photo de profil sont requis.' });
  }

  try {
    // Mettre à jour l'utilisateur dans MongoDB avec le nom du fichier de l'image
    const user = await User.findByIdAndUpdate(
      _id,
      { profilePicture }, // On garde juste le nom du fichier dans MongoDB
      { new: true } // Retourner l'utilisateur mis à jour
    );

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    return res.status(200).json({ message: 'Profile picture has been updated succesfully!', user });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la photo de profil:', error);
    return res.status(500).json({ message: 'Erreur serveur. Impossible de mettre à jour la photo de profil.' });
  }
});

// Routes existantes
app.use('/api/predict', predictRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', chatbotRoutes);

// Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
