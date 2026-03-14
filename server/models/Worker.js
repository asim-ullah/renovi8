const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    specialization: { type: String, required: true, trim: true },
    isAvailable: { type: Boolean, default: true },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Worker', workerSchema);
