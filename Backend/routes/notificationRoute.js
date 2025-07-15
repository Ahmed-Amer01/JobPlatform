const express = require('express');
const verifyToken = require('../middlewares/verifyToken');
const notificationController = require('../controllers/notificationController');

const router = express.Router();

router.use(verifyToken);

router.get('/', notificationController.getNotifications);
router.patch('/:id/read', notificationController.markAsRead);
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;
