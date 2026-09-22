const Notification = require('../models/Notification');
const AppError = require('../utils/appError');

const notificationService = {
  getUserNotifications: async (userId) => {
    return Notification.findByUserId(userId);
  },

  markAsRead: async (id, userId) => {
    const updated = await Notification.markAsRead(id, userId);
    if (!updated) {
      throw new AppError('Notification not found or unauthorized.', 404);
    }
    return updated;
  },

  markAllAsRead: async (userId) => {
    return Notification.markAllAsRead(userId);
  },

  getUnreadCount: async (userId) => {
    return Notification.getUnreadCount(userId);
  },

  createNotification: async (data) => {
    return Notification.create(data);
  }
};

module.exports = notificationService;
