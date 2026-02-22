const mongoose = require('mongoose');

const StationSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  code: { type: String, required: true, unique: true, uppercase: true },
  lineIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Line' }],
  isInterchange: { type: Boolean, default: false },
  coordinates: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
  },
  facilities: {
    accessible: { type: Boolean, default: false },
    parking: { type: Boolean, default: false },
    exits: { type: Number, default: 2 },
  },
}, { timestamps: true });

module.exports = mongoose.model('Station', StationSchema);