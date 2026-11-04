import React from 'react';

const NotificationStack = ({ notifications = [] }) => {
  return (
    <div>
      {notifications.map((n, index) => (
        <div key={index} data-testid={`alert-${n.type}`}>
          {n.message}
        </div>
      ))}
    </div>
  );
};

export default NotificationStack; 