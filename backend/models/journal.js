const mongoose = require('mongoose');
const JournalSchema=new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,  
        ref: 'User',  
        required: true
      },
      date: {
        type: String, // Format: YYYY-MM-DD
        required: true,
      },
      content: {
        type: String,
        default: '',
      },
    
})
module.exports = mongoose.model('Journal', JournalSchema);