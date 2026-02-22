const Booking = require('../models/Booking');
const { v4: uuidv4 } = require('uuid');

// POST /api/bookings
exports.createBooking = async (req, res) => {
  try {
    const { source, destination, route, fare, passengerName } = req.body;
    const bookingRef = 'MET-' + uuidv4().substring(0, 8).toUpperCase();
    const qrData = JSON.stringify({ ref: bookingRef, from: source, to: destination, ts: Date.now() });

    const booking = await Booking.create({
  bookingRef,
  source,
  destination,
  route,
  fare,
  qrData,
  passengerName: passengerName || 'Guest',
  userId: req.user?._id || null,   
});

    res.status(201).json({ success: true, data: booking });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// GET /api/bookings/:ref
exports.getBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({ bookingRef: req.params.ref });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/bookings — list all (admin)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};