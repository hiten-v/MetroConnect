const mongoose = require('mongoose');

const CompatMatrixSchema = new mongoose.Schema({
  fromVersion: { type: String, required: true },
  toVersion: { type: String, required: true },
  status: { type: String, enum: ['direct', 'intermediate', 'blocked'], required: true },
  reason: { type: String, default: '' },
}, { timestamps: true });

CompatMatrixSchema.index({ fromVersion: 1, toVersion: 1 }, { unique: true });

module.exports = mongoose.model('CompatMatrix', CompatMatrixSchema);