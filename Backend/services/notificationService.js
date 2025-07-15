// services/notificationService.js
const Notification = require('../models/notificationModel');

async function createNotification({ userId, senderId = null, type, message, jobId = null, applicationId = null }) {
    const notification = new Notification({
        userId,
        senderId,
        type,
        message,
        jobId,
        applicationId
    });
    await notification.save();

    // Future: emit via Socket.IO for real-time
    return notification;
}

module.exports = { 
    createNotification
};
