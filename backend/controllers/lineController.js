const Line = require('../models/Line');
const Station = require('../models/Station');

// GET /api/lines — full network with populated stations
exports.getAllLines = async (req, res) => {
  try {
    const lines = await Line.find().populate('stations.stationId', 'name code coordinates isInterchange facilities');
    res.json({ success: true, data: lines });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/lines/:id
exports.getLine = async (req, res) => {
  try {
    const line = await Line.findById(req.params.id).populate('stations.stationId');
    if (!line) return res.status(404).json({ success: false, message: 'Line not found' });
    res.json({ success: true, data: line });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/lines
exports.createLine = async (req, res) => {
  try {
    const line = await Line.create(req.body);
    res.status(201).json({ success: true, data: line });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PUT /api/lines/:id/stations — reorder or update stations in a line
exports.updateLineStations = async (req, res) => {
  try {
    const { stations } = req.body; // [{ stationId, order }]
    const line = await Line.findByIdAndUpdate(
      req.params.id,
      { stations },
      { new: true, runValidators: true }
    ).populate('stations.stationId');

    if (!line) return res.status(404).json({ success: false, message: 'Line not found' });

    // Auto-detect interchanges: stations appearing in 2+ lines
    const allLines = await Line.find();
    const stationLineCount = {};
    allLines.forEach(l => {
      l.stations.forEach(s => {
        const id = s.stationId.toString();
        stationLineCount[id] = (stationLineCount[id] || 0) + 1;
      });
    });

    // Update isInterchange flag
    for (const [stationId, count] of Object.entries(stationLineCount)) {
      await Station.findByIdAndUpdate(stationId, { isInterchange: count > 1 });
    }

    res.json({ success: true, data: line });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE /api/lines/:id
exports.deleteLine = async (req, res) => {
  try {
    await Line.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Line deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};