// models/Resource.js
const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  tags: [String],
  notes: String,
  status: { type: String, enum: ['watching','reading', 'done'], default: 'reading' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Resource', resourceSchema);
