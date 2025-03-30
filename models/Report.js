const mongoose = require('mongoose');

/**
 * Mongoose schema for storing generated equity research reports.
 */
const reportSchema = new mongoose.Schema({
  userName: String,
  companyTicker: String,

  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  content: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Export the model to interact with the 'reports' collection in MongoDB
module.exports = mongoose.model('Report', reportSchema);