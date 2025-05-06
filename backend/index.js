require("./config/db");

const express = require("express");
const cors = require('cors');
const User = require('./models/user');
const userRoutes = require("./routes/userRoutes");
const questionRoutes=require("./routes/questionRoutes");
const quizRoutes=require("./routes/quizRoutes");
const pythonRoute = require('./routes/pythonRoute');
const journalRoutes = require('./routes/journalRoute');
const predictRoutes = require('./routes/predict');
const chatbotRoutes = require('./routes/chatbot');
const interestRoutes = require("./routes/interestRoute");
const app = express();
app.use(cors()); // Autorise les requêtes depuis React Native
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/quiz", quizRoutes);
app.use('/api', pythonRoute);
app.use("/api/journal", journalRoutes);
app.use('/api/prediction', predictRoutes);
app.use('/api', chatbotRoutes);
app.use("/api/interests", interestRoutes);
// Route pour mettre à jour la photo de profil
app.post('/api/updateProfilePicture', async (req, res) => {
    const { _id, profilePicture } = req.body;
  
    if (!_id || !profilePicture) {
      return res.status(400).json({ message: 'Erreur: L\'ID et la photo de profil sont requis.' });
    }
  
    try {
      
      const user = await User.findById( _id);
       if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        
      }
      user.profilePicture=profilePicture;
      return res.status(200).json({ message: 'Profile picture has been updated succesfully!', user });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la photo de profil:', error);
      return res.status(500).json({ message: 'Erreur serveur. Impossible de mettre à jour la photo de profil.' });
    }
  });
app.listen(5000,() => console.log('Serveur démarré'));
