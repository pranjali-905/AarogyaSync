const notificationService = require('../services/notificationService');
const { success } = require('../utils/apiResponse');

const getMyNotifications = async (req, res, next) => {
  try {
    const notifications = await notificationService.getUserNotifications(req.user.id);
    return success(res, notifications, 'Notifications retrieved successfully');
  } catch (err) {
    next(err);
  }
};

const markAsRead = async (req, res, next) => {
  try {
    const updated = await notificationService.markAsRead(req.params.id, req.user.id);
    return success(res, updated, 'Notification marked as read');
  } catch (err) {
    next(err);
  }
};

const markAllAsRead = async (req, res, next) => {
  try {
    await notificationService.markAllAsRead(req.user.id);
    return success(res, null, 'All notifications marked as read');
  } catch (err) {
    next(err);
  }
};

const getUnreadCount = async (req, res, next) => {
  try {
    const count = await notificationService.getUnreadCount(req.user.id);
    return success(res, { unreadCount: count }, 'Unread notifications count retrieved');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount
};
