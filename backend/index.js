require("./config/db");

const express = require("express");
const cors = require('cors');
const userRoutes = require("./routes/userRoutes");
const app = express();
app.use(cors()); // Autorise les requêtes depuis React Native
app.use(express.json());
app.use("/api/users", userRoutes);
app.listen(5000,() => console.log('Serveur démarré'));
