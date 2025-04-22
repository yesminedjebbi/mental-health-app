require("./config/db");

const express = require("express");
const cors = require('cors');
const userRoutes = require("./routes/userRoutes");
const questionRoutes=require("./routes/questionRoutes");
const quizRoutes=require("./routes/quizRoutes");
const pythonRoute = require('./routes/pythonRoute');
const app = express();
app.use(cors()); // Autorise les requêtes depuis React Native
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/quiz", quizRoutes);
app.use('/api', pythonRoute);
app.listen(5000,() => console.log('Serveur démarré'));
