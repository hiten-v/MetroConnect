const Station = require('../models/Station');
const Line = require('../models/Line');

// POST /api/import/validate — client sends parsed data; server validates
exports.validateImport = async (req, res) => {
  try {
    const { stations = [], lines = [] } = req.body;
    const errors = [];
    const warnings = [];

    // Check for duplicate codes in the import payload
    const codes = stations.map(s => s.code);
    const duplicates = codes.filter((c, i) => codes.indexOf(c) !== i);
    if (duplicates.length) {
      errors.push({ type: 'DUPLICATE_CODE', message: `Duplicate station codes: ${[...new Set(duplicates)].join(', ')}` });
    }

    // Check required fields
    stations.forEach((s, i) => {
      if (!s.name) errors.push({ type: 'MISSING_FIELD', message: `Row ${i + 1}: missing station name`, row: i });
      if (!s.code) errors.push({ type: 'MISSING_FIELD', message: `Row ${i + 1}: missing station code`, row: i });
    });

    // Check for existing stations in DB that would conflict
    const existingCodes = await Station.find({ code: { $in: codes } }).select('code');
    existingCodes.forEach(s => {
      warnings.push({ type: 'EXISTING_STATION', message: `Station ${s.code} already exists and will be updated` });
    });

    res.json({ success: true, data: { errors, warnings, isValid: errors.length === 0 } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/import/commit — actually write to DB
exports.commitImport = async (req, res) => {
  try {
    const { stations = [], lines = [] } = req.body;
    const results = { stationsCreated: 0, stationsUpdated: 0, linesCreated: 0 };

    for (const s of stations) {
      const existing = await Station.findOne({ code: s.code });
      if (existing) {
        await Station.findByIdAndUpdate(existing._id, s);
        results.stationsUpdated++;
      } else {
        await Station.create(s);
        results.stationsCreated++;
      }
    }

    for (const l of lines) {
      const existing = await Line.findOne({ code: l.code });
      if (!existing) {
        await Line.create(l);
        results.linesCreated++;
      }
    }

    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};