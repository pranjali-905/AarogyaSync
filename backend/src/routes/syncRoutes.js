const express = require('express');
const router = express.Router();
const syncController = require('../controllers/syncController');
const { validateSyncBatch } = require('../middleware/validateMiddleware');

router.post('/batch', validateSyncBatch, syncController.processBatchSync);
router.get('/status', syncController.getSyncStatus);

module.exports = router;
