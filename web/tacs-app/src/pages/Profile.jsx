import React, { useState, useEffect } from 'react';
import '../css/Profile.css';

export default function StudentProfile() {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [profileImage, setProfileImage] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch user profile data on component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const authData = JSON.parse(localStorage.getItem('auth'));
      const token = authData?.token;
      
      if (!token) {
        setError('Please login to view your profile');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:8080/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile data');
      }

      const data = await response.json();
      setUserData(data);
      setLoading(false);
    } catch (err) {
      setError('Error loading profile: ' + err.message);
      setLoading(false);
    }
  };

  // Generate initial from first name only
  const getInitials = () => {
    if (!userData) return '';
    const firstInitial = userData.fname?.charAt(0).toUpperCase() || '';
    return firstInitial;
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match!');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setError('Password must be at least 8 characters long!');
      return;
    }

    try {
      const authData = JSON.parse(localStorage.getItem('auth'));
      const token = authData?.token;
      
      const response = await fetch('http://localhost:8080/api/users/change-password', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Failed to change password');
        return;
      }

      setSuccessMessage('Password changed successfully!');
      
      // Reset form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Close form after 2 seconds
      setTimeout(() => {
        setShowPasswordForm(false);
        setSuccessMessage('');
      }, 2000);
    } catch (err) {
      setError('Error changing password: ' + err.message);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file!');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB!');
        return;
      }

      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        setSuccessMessage('Profile image updated locally (backend storage not implemented)');
        setTimeout(() => setSuccessMessage(''), 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    document.getElementById('profile-image-input').click();
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="profile-container">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p style={{ color: 'red' }}>{error || 'Failed to load profile'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <h2 className="profile-title">My Profile</h2>
      
      {error && (
        <div style={{ 
          background: '#fee', 
          color: '#c33', 
          padding: '1rem', 
          borderRadius: '6px', 
          marginBottom: '1rem',
          border: '1px solid #fcc'
        }}>
          {error}
        </div>
      )}

      {successMessage && (
        <div style={{ 
          background: '#efe', 
          color: '#3c3', 
          padding: '1rem', 
          borderRadius: '6px', 
          marginBottom: '1rem',
          border: '1px solid #cfc'
        }}>
          {successMessage}
        </div>
      )}
      
      <div className="profile-card">
        <div className="profile-image-container">
          <div className="profile-image-wrapper">
            {profileImage ? (
              <img 
                src={profileImage} 
                alt="Profile" 
                className="profile-image"
              />
            ) : (
              <div className="profile-initials-avatar">
                {getInitials()}
              </div>
            )}
            <button 
              className="profile-image-edit-btn"
              onClick={triggerFileInput}
              title="Change profile picture"
            >
              📷
            </button>
            <input
              id="profile-image-input"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
          </div>
        </div>

        <div className="profile-info-container">
          <div className="profile-info-item">
            <span className="profile-icon">👤</span>
            <div>
              <label className="profile-label">First Name</label>
              <p className="profile-value">{userData.fname}</p>
            </div>
          </div>

          <div className="profile-info-item">
            <span className="profile-icon">👤</span>
            <div>
              <label className="profile-label">Last Name</label>
              <p className="profile-value">{userData.lname}</p>
            </div>
          </div>

          <div className="profile-info-item">
            <span className="profile-icon">📧</span>
            <div>
              <label className="profile-label">Email</label>
              <p className="profile-value">{userData.email}</p>
            </div>
          </div>

          <div className="profile-info-item">
            <span className="profile-icon">🎭</span>
            <div>
              <label className="profile-label">Role</label>
              <p className="profile-value">{userData.role}</p>
            </div>
          </div>
        </div>

        <div className="profile-password-section">
          {!showPasswordForm ? (
            <button 
              className="profile-change-password-btn"
              onClick={() => setShowPasswordForm(true)}
            >
              <span className="profile-btn-icon">🔒</span>
              Change Password
            </button>
          ) : (
            <div className="profile-password-form">
              <h3 className="profile-form-title">Change Password</h3>
              
              <div className="profile-input-group">
                <label className="profile-input-label">Current Password</label>
                <div className="profile-password-input-wrapper">
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="profile-input"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('current')}
                    className="profile-eye-button"
                  >
                    {showPasswords.current ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <div className="profile-input-group">
                <label className="profile-input-label">New Password</label>
                <div className="profile-password-input-wrapper">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="profile-input"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="profile-eye-button"
                  >
                    {showPasswords.new ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <div className="profile-input-group">
                <label className="profile-input-label">Confirm New Password</label>
                <div className="profile-password-input-wrapper">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="profile-input"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="profile-eye-button"
                  >
                    {showPasswords.confirm ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <div className="profile-button-group">
                <button 
                  type="button"
                  className="profile-submit-btn"
                  onClick={handleSubmitPassword}
                >
                  Update Password
                </button>
                <button 
                  type="button" 
                  className="profile-cancel-btn"
                  onClick={() => {
                    setShowPasswordForm(false);
                    setPasswordData({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    });
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}