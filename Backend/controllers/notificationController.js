const Notification = require('../models/notificationModel');

const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({ status: 'success', count: notifications.length, data: notifications });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) return res.status(404).json({ status: 'fail', message: 'Notification not found' });

        if (notification.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ status: 'fail', message: 'Not authorized' });
        }

        notification.isRead = true;
        await notification.save();
        res.status(200).json({ status: 'success', data: notification });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

const deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) return res.status(404).json({ status: 'fail', message: 'Notification not found' });

        if (notification.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ status: 'fail', message: 'Not authorized' });
        }

        await notification.deleteOne();
        res.status(204).json({ status: 'success', data: null });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

module.exports = { getNotifications, markAsRead, deleteNotification };
