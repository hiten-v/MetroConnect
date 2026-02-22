const Station = require('../models/Station');
const Line = require('../models/Line');

// GET /api/stations
exports.getAllStations = async (req, res) => {
  try {
    const stations = await Station.find().populate('lineIds', 'name color code');
    res.json({ success: true, data: stations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/stations/:id
exports.getStation = async (req, res) => {
  try {
    const station = await Station.findById(req.params.id).populate('lineIds', 'name color code');
    if (!station) return res.status(404).json({ success: false, message: 'Station not found' });
    res.json({ success: true, data: station });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/stations
exports.createStation = async (req, res) => {
  try {
    const station = await Station.create(req.body);
    res.status(201).json({ success: true, data: station });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PUT /api/stations/:id
exports.updateStation = async (req, res) => {
  try {
    const station = await Station.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!station) return res.status(404).json({ success: false, message: 'Station not found' });
    res.json({ success: true, data: station });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE /api/stations/:id
exports.deleteStation = async (req, res) => {
  try {
    await Station.findByIdAndDelete(req.params.id);
    // Remove from all lines
    await Line.updateMany({}, { $pull: { stations: { stationId: req.params.id } } });
    res.json({ success: true, message: 'Station deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};