import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios'; // Ensure axios is installed
import './css/ProfileDropdown.css'; // Import CSS for styling

const ProfileDropdown = ({
  profileImageSrc = 'https://via.placeholder.com/50',
  onLogout = () => alert('Logging out...')
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userInfo, setUserInfo] = useState({
    username: '',
    email: '',
    role: '',
    active: false
  });

  useEffect(() => {
    // Fetch user info when the component mounts
    axios.get('http://localhost:5000/user_info', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}` // Ensure the token is correctly set in localStorage
      }
    })
    .then(response => {
      setUserInfo({
        username: response.data.username,
        email: response.data.email,
        role: response.data.role,
        active: response.data.active
      });
    })
    .catch(error => {
      // console.error('Error fetching user info:', error);
    });
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="profile-dropdown-container">
      <div className="profile-avatar" onClick={toggleDropdown}>
        {profileImageSrc ? (
          <img className="profile-avatar-image" alt="Profile avatar" src={profileImageSrc} />
        ) : (
          <FontAwesomeIcon icon={faUser} className="profile-avatar-placeholder" />
        )}
      </div>
      {isOpen && (
        <div className="profile-dropdown-menu">
          <div className="profile-dropdown-header">
            <img src={profileImageSrc || '/path/to/default-profile.jpg'} alt="Profile" className="profile-picture" />
            <div className="profile-info">
              <h4 className="profile-username">{userInfo.username}</h4>
              <p className="profile-email">{userInfo.email}</p>
              <p className="profile-role">{userInfo.role}</p>
            </div>
          </div>
          <div className="profile-dropdown-options">
            <button className="profile-option">
              <FontAwesomeIcon icon={faCog} className="profile-option-icon" />
              Settings
            </button>
            <button className="profile-option" onClick={onLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} className="profile-option-icon" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
