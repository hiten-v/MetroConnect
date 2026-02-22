const express = require('express');

// Import routes
const importRouter = express.Router();
const importCtrl = require('../controllers/importController');
importRouter.post('/validate', importCtrl.validateImport);
importRouter.post('/commit', importCtrl.commitImport);

// Matrix routes
const matrixRouter = express.Router();
const matrixCtrl = require('../controllers/matrixController');
matrixRouter.get('/', matrixCtrl.getMatrix);
matrixRouter.put('/', matrixCtrl.updateCell);
matrixRouter.post('/bulk', matrixCtrl.bulkUpdate);

module.exports = { importRouter, matrixRouter };