const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const authMiddleware = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');
const { validateAppointment } = require('../middleware/validateMiddleware');

router.use(authMiddleware);

router.post('/', validateAppointment, appointmentController.createAppointment);
router.get('/', appointmentController.getMyAppointments);
router.get('/all', authorizeRoles('ADMIN', 'DOCTOR'), appointmentController.listAppointments);
router.get('/:id', appointmentController.getAppointmentById);
router.patch('/:id/status', appointmentController.updateAppointmentStatus);

module.exports = router;
