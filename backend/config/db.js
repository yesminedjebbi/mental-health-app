const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/PCD")
  .then(() => console.log("MongoDB connecté"))
  .catch((err) => console.log(err));