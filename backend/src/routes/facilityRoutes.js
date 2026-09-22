const express = require('express');
const router = express.Router();
const facilityController = require('../controllers/facilityController');

router.get('/', facilityController.getFacilities);
router.get('/medicines', facilityController.getMedicineAvailability);
router.get('/:id', facilityController.getFacilityById);
router.get('/:id/inventory', facilityController.getFacilityInventory);

module.exports = router;
