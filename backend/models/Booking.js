const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  bookingRef: { type: String, required: true, unique: true },
  source: { type: String, required: true },
  destination: { type: String, required: true },
  route: {
    segments: [{
      line: String,
      lineColor: String,
      stations: [String],
      duration: Number,
    }],
    totalStops: Number,
    totalTime: Number,
    transfers: Number,
  },
  fare: { type: Number, required: true },
  qrData: { type: String, required: true },
  status: { type: String, enum: ['active', 'used', 'expired'], default: 'active' },
  passengerName: { type: String, default: 'Guest' },
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);