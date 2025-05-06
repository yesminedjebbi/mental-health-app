const JournalEntry = require('../models/journal');

const getEntryByDate = async (req, res) => {
  const { userId, date } = req.params;

  try {
    const entry = await JournalEntry.findOne({ userId, date });
    if (entry) {
      res.json(entry);
    } else {
      res.status(404).json({ message: "Aucune entrée trouvée pour cette date." });
    }
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

const saveOrUpdateEntry = async (req, res) => {
  const { userId, date, content } = req.body;

  try {
    const entry = await JournalEntry.findOneAndUpdate(
      { userId, date },
      { content },
      { new: true, upsert: true }
    );
    res.json({ message: "Journal sauvegardé", entry });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la sauvegarde", error });
  }
};

const getHistory = async (req, res) => {
  const { userId } = req.params;

  try {
    const entries = await JournalEntry.find({ userId }).sort({ date: -1 });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors du chargement de l’historique", error });
  }
  
};
module.exports={getEntryByDate,getHistory,saveOrUpdateEntry};
