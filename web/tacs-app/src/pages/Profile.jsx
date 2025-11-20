import React, { useState } from 'react';
import '../css/Profile.css';

export default function Profile() {
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

  // Mock student data - replace with actual data from your backend
  const studentData = {
    image: 'https://via.placeholder.com/150',
    firstName: 'Juan',
    lastName: 'Dela Cruz',
    email: 'juan.delacruz@student.edu'
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitPassword = (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      alert('Password must be at least 8 characters long!');
      return;
    }

    // Add your password change logic here
    console.log('Changing password...');
    alert('Password changed successfully!');
    
    // Reset form
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setShowPasswordForm(false);
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmitPassword(e);
  };

  return (
    <div className="profile-container">
      <h2 className="profile-title">My Profile</h2>
      
      <div className="profile-card">
        <div className="profile-image-container">
          <img 
            src={studentData.image} 
            alt="Profile" 
            className="profile-image"
          />
        </div>

        <div className="profile-info-container">
          <div className="profile-info-item">
            <span className="profile-icon">👤</span>
            <div>
              <label className="profile-label">First Name</label>
              <p className="profile-value">{studentData.firstName}</p>
            </div>
          </div>

          <div className="profile-info-item">
            <span className="profile-icon">👤</span>
            <div>
              <label className="profile-label">Last Name</label>
              <p className="profile-value">{studentData.lastName}</p>
            </div>
          </div>

          <div className="profile-info-item">
            <span className="profile-icon">📧</span>
            <div>
              <label className="profile-label">Email</label>
              <p className="profile-value">{studentData.email}</p>
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