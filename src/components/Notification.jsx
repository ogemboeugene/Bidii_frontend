import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios for API calls
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import './css/Notification.css';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Base URL from environment variable
  const apiUrl = process.env.REACT_APP_API_URL;
  
  // Fetch notifications from the API
  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`${apiUrl}notifications`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setNotifications(response.data);
      } catch (err) {
        setError('Failed to load notifications');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Calculate unread notifications count
  useEffect(() => {
    const countUnread = notifications.filter(notification => !notification.read).length;
    setUnreadCount(countUnread);
  }, [notifications]);

  const handleBellClick = () => {
    setShowPopup(!showPopup);
  };

  const unreadNotifications = notifications.filter(notification => !notification.read);

  return (
    <div className="notifications">
      <FontAwesomeIcon icon={faBell} className="bell-icon" onClick={handleBellClick} />
      {unreadCount > 0 && (
        <div className="overlap-4">
          <div className="ellipse" />
          <div className="text-wrapper">{unreadCount}</div>
        </div>
      )}
      {showPopup && (
        <div className="notification-popup">
          <div className="popup-header">
            <h3>Unread Notifications</h3>
            <button className="close-btn" onClick={() => setShowPopup(false)}>×</button>
          </div>
          <div className="popup-content">
            {loading && <div className="loading">Loading...</div>}
            {error && <div className="error">{error}</div>}
            {!loading && !error && (
              unreadNotifications.length > 0 ? (
                unreadNotifications.map(notification => (
                  <div key={notification.id} className="popup-item">
                    <div className="popup-message">{notification.message}</div>
                    <div className="popup-date">
                      {new Date(notification.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-notifications">No unread notifications</div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;
