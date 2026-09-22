const db = require('../config/db');

const memoryNotifications = new Map([
  ['notif-01', {
    id: 'notif-01',
    user_id: 'usr-pat-female-01',
    title: 'Upcoming ANC Clinic Tomorrow',
    message: 'Your ANC 3 appointment is scheduled for tomorrow at 10:30 AM at Bhimashankar PHC.',
    category: 'APPOINTMENT',
    priority: 'HIGH',
    is_read: false,
    action_route: '/patient/appointments',
    created_at: new Date('2026-09-16T14:00:00Z').toISOString()
  }],
  ['notif-02', {
    id: 'notif-02',
    user_id: 'usr-pat-female-01',
    title: 'ASHA Home Visit Reminder',
    message: 'Sunita Tai will visit your home tomorrow for nutrition and IFA compliance check.',
    category: 'FOLLOW_UP',
    priority: 'MEDIUM',
    is_read: false,
    action_route: '/patient/followup',
    created_at: new Date('2026-09-16T15:30:00Z').toISOString()
  }],
  ['notif-03', {
    id: 'notif-03',
    user_id: 'usr-doc-01',
    title: 'New Teleconsultation Booked',
    message: 'Radhika Shinde is confirmed for ANC checkup tomorrow.',
    category: 'APPOINTMENT',
    priority: 'MEDIUM',
    is_read: false,
    action_route: '/doctor/queue',
    created_at: new Date('2026-09-16T12:00:00Z').toISOString()
  }]
]);

const Notification = {
  create: async (data) => {
    const id = data.id || `notif-${Date.now().toString(36)}`;
    if (db.getIsConnected()) {
      const query = `
        INSERT INTO notifications (
          id, user_id, title, message, category, priority, is_read, action_route
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;
      `;
      const res = await db.query(query, [
        id, data.userId, data.title, data.message,
        data.category || 'SYSTEM', data.priority || 'MEDIUM',
        Boolean(data.isRead), data.actionRoute || null
      ]);
      return res.rows[0];
    }

    const notif = {
      id,
      user_id: data.userId,
      title: data.title,
      message: data.message,
      category: data.category || 'SYSTEM',
      priority: data.priority || 'MEDIUM',
      is_read: Boolean(data.isRead),
      action_route: data.actionRoute || null,
      created_at: new Date().toISOString()
    };
    memoryNotifications.set(id, notif);
    return notif;
  },

  findByUserId: async (userId) => {
    if (db.getIsConnected()) {
      const res = await db.query(
        'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50;',
        [userId]
      );
      return res.rows;
    }
    return Array.from(memoryNotifications.values())
      .filter(n => n.user_id === userId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  markAsRead: async (id, userId) => {
    if (db.getIsConnected()) {
      const res = await db.query(
        'UPDATE notifications SET is_read = true WHERE id = $1 AND user_id = $2 RETURNING *;',
        [id, userId]
      );
      return res.rows[0];
    }
    const n = memoryNotifications.get(id);
    if (n && n.user_id === userId) {
      n.is_read = true;
      return n;
    }
    return null;
  },

  markAllAsRead: async (userId) => {
    if (db.getIsConnected()) {
      await db.query('UPDATE notifications SET is_read = true WHERE user_id = $1;', [userId]);
      return true;
    }
    for (const n of memoryNotifications.values()) {
      if (n.user_id === userId) n.is_read = true;
    }
    return true;
  },

  getUnreadCount: async (userId) => {
    if (db.getIsConnected()) {
      const res = await db.query(
        'SELECT COUNT(*) as count FROM notifications WHERE user_id = $1 AND is_read = false;',
        [userId]
      );
      return parseInt(res.rows[0].count, 10);
    }
    return Array.from(memoryNotifications.values()).filter(n => n.user_id === userId && !n.is_read).length;
  }
};

module.exports = Notification;
