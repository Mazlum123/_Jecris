import React from 'react';
import { useNotificationStore } from '../../store/useNotificationStore';

export const ToastContainer = () => {
  const notifications = useNotificationStore((state) => state.notifications);
  const removeNotification = useNotificationStore((state) => state.removeNotification);

  return (
    <div className="toast-container">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`toast toast--${notification.type}`}
          onClick={() => removeNotification(notification.id)}
        >
          <p>{notification.message}</p>
          <button 
            className="toast__close"
            onClick={(e) => {
              e.stopPropagation();
              removeNotification(notification.id);
            }}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};