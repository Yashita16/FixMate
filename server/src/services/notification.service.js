import Notification from '../models/Notification.model.js';

export const createNotification = async ({ recipient, type, title, message, relatedId = null, relatedModel = null }) => {
  return Notification.create({ recipient, type, title, message, relatedId, relatedModel });
};