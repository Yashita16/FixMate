import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiBell, FiCheck, FiTrash2 } from 'react-icons/fi';
import Navbar from '../component/layout/Navbar.jsx';
import { EmptyState, Button, Skeleton } from '../component/common/index.jsx';
import { useNotifications } from '../context/NotificationContext.jsx';
import api from '../api/axios.js';

const typeColors = {
  consultation_request: 'bg-blue-500/20 text-blue-400',
  consultation_accepted: 'bg-emerald-500/20 text-emerald-400',
  consultation_rejected: 'bg-red-500/20 text-red-400',
  consultation_completed: 'bg-purple-500/20 text-purple-400',
  new_review: 'bg-yellow-500/20 text-yellow-400',
  expert_approved: 'bg-emerald-500/20 text-emerald-400',
  system: 'bg-slate-500/20 text-slate-400',
};

const typeIcons = {
  consultation_request: '📨',
  consultation_accepted: '✅',
  consultation_rejected: '❌',
  consultation_completed: '🎉',
  new_review: '⭐',
  expert_approved: '🎊',
  system: '🔔',
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setUnreadCount } = useNotifications();

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications?limit=50');
      setNotifications(res.data.notifications || []);
      setUnreadCount(res.data.unreadCount || 0);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetchNotifications(); }, []);

  const markAllRead = async () => {
    await api.patch('/notifications/read-all');
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  const deleteNotification = async (id) => {
    await api.delete(`/notifications/${id}`);
    setNotifications((prev) => prev.filter((n) => n._id !== id));
  };

  const markRead = async (id) => {
    await api.patch(`/notifications/${id}/read`);
    setNotifications((prev) => prev.map((n) => n._id === id ? { ...n, isRead: true } : n));
    setUnreadCount((c) => Math.max(0, c - 1));
  };

  const unread = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 pt-24 pb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <FiBell /> Notifications
              {unread > 0 && (
                <span className="w-6 h-6 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {unread}
                </span>
              )}
            </h1>
            <p className="text-slate-400 text-sm mt-1">{notifications.length} total notifications</p>
          </div>
          {unread > 0 && (
            <Button variant="ghost" onClick={markAllRead} className="text-sm flex items-center gap-1.5">
              <FiCheck size={14} /> Mark all read
            </Button>
          )}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-20 w-full" />)}
          </div>
        ) : notifications.length === 0 ? (
          <EmptyState icon="🔔" title="No notifications" description="You're all caught up! Notifications will appear here." />
        ) : (
          <div className="space-y-2">
            {notifications.map((n, i) => (
              <motion.div
                key={n._id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => !n.isRead && markRead(n._id)}
                className={`card p-4 flex items-start gap-3 cursor-pointer hover:border-slate-600 transition-all ${
                  !n.isRead ? 'border-primary-500/30 bg-primary-500/5' : ''
                }`}
              >
                <span className="text-2xl flex-shrink-0">{typeIcons[n.type] || '🔔'}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-medium text-white">{n.title}</p>
                    {!n.isRead && <span className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0" />}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{n.message}</p>
                  <p className="text-xs text-slate-600 mt-1">
                    {new Date(n.createdAt).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                    })}
                  </p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteNotification(n._id); }}
                  className="text-slate-600 hover:text-red-400 transition-colors flex-shrink-0 p-1"
                >
                  <FiTrash2 size={13} />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;