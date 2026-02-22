const CompatMatrix = require('../models/CompatMatrix');

// GET /api/matrix
exports.getMatrix = async (req, res) => {
  try {
    const matrix = await CompatMatrix.find();
    res.json({ success: true, data: matrix });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/matrix — upsert a single cell
exports.updateCell = async (req, res) => {
  try {
    const { fromVersion, toVersion, status, reason } = req.body;
    const cell = await CompatMatrix.findOneAndUpdate(
      { fromVersion, toVersion },
      { status, reason },
      { upsert: true, new: true }
    );
    res.json({ success: true, data: cell });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// POST /api/matrix/bulk — seed/replace entire matrix
exports.bulkUpdate = async (req, res) => {
  try {
    const { entries } = req.body;
    await CompatMatrix.deleteMany({});
    const result = await CompatMatrix.insertMany(entries);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};