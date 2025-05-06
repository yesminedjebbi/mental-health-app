const express = require('express');
const router = express.Router();
const journalController = require('../controllers/JournalController');

router.get('/:userId/:date', journalController.getEntryByDate);
router.post('/', journalController.saveOrUpdateEntry);
router.get('/:userId', journalController.getHistory);

module.exports = router;