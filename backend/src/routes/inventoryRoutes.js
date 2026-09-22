const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

// Medicine Catalogue & Availability
router.get('/medicines', inventoryController.getMedicines);
router.get('/medicines/availability', inventoryController.getMedicineAvailability);
router.get('/medicines/:id', inventoryController.getMedicineById);

// Diagnostic Catalogue & Availability
router.get('/diagnostics', inventoryController.getDiagnostics);
router.get('/diagnostics/availability', inventoryController.getDiagnosticAvailability);
router.get('/diagnostics/:id', inventoryController.getDiagnosticById);

module.exports = router;
