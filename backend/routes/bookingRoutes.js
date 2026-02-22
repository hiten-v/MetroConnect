const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/bookingController');

router.get('/', ctrl.getAllBookings);
router.post('/', ctrl.createBooking);
router.get('/:ref', ctrl.getBooking);

module.exports = router;