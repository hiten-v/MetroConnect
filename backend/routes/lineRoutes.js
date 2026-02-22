const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/lineController');

router.get('/', ctrl.getAllLines);
router.get('/:id', ctrl.getLine);
router.post('/', ctrl.createLine);
router.put('/:id/stations', ctrl.updateLineStations);
router.delete('/:id', ctrl.deleteLine);

module.exports = router;