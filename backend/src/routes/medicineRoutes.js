const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

router.get('/', inventoryController.getMedicines);
router.get('/availability', inventoryController.getMedicineAvailability);
router.get('/:id', inventoryController.getMedicineById);

module.exports = router;
