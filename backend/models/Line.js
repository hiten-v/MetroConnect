const mongoose = require('mongoose');

const LineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true, uppercase: true },
  color: { type: String, required: true }, // hex color
  stations: [{
    stationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Station' },
    order: { type: Number, required: true },
  }],
}, { timestamps: true });

// Sort stations by order always
LineSchema.pre('save', function(next) {
  this.stations.sort((a, b) => a.order - b.order);
  next();
});

module.exports = mongoose.model('Line', LineSchema);