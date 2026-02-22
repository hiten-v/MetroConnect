// stationRoutes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/stationController');

router.get('/', ctrl.getAllStations);
router.get('/:id', ctrl.getStation);
router.post('/', ctrl.createStation);
router.put('/:id', ctrl.updateStation);
router.delete('/:id', ctrl.deleteStation);

module.exports = router;