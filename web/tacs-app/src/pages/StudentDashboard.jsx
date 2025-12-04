import React, { useState, useEffect } from 'react';
import '../css/StudentDashboard.css';
import StudentClasses from './StudentClasses';
import StudentProfile from './Profile';
import StudentSettings from './StudentSettings';

const sections = [
  { name: 'My Classes', key: 'classes' },
  { name: 'Settings', key: 'settings' }
];

export default function StudentDashboard() {
  const [activeSection, setActiveSection] = useState('classes');
  const [studentName, setStudentName] = useState('Student');
  const [studentInitials, setStudentInitials] = useState('S');

  useEffect(() => {
    // Get the student's name from localStorage
    const authData = JSON.parse(localStorage.getItem('auth'));
    if (authData && authData.fname) {
      const fullName = `${authData.fname} ${authData.lname || ''}`.trim();
      setStudentName(fullName);
      // Get initials
      const names = fullName.split(' ');
      const initials = names.map(n => n.charAt(0).toUpperCase()).join('');
      setStudentInitials(initials.substring(0, 2)); // Max 2 letters
    }
  }, []);

  function handleLogout() {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/';
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'classes':
        return <StudentClasses />;
      case 'profile':
        return <StudentProfile />;
      case 'settings':
        return <StudentSettings />;
      default:
        return null;
    }
  };

  return (
    <div className="student-dashboard">
      <header className="dashboard-header">
        <span className="logo" onClick={() => setActiveSection('classes')} style={{ cursor: 'pointer' }}>Student Dashboard</span>
        <div className="profile-section">
          <div className="profile-info">
            <div className="profile-name">
              {studentName}
            </div>
            <div className="logout-link" onClick={handleLogout}>
              Logout
            </div>
          </div>
          <div 
            className="profile-avatar"
            onClick={() => setActiveSection('profile')}
          >
            {studentInitials}
          </div>
        </div>
      </header>
      <div className="dashboard-body">
        <main className="main-content">
          {renderSection()}
        </main>
      </div>
    </div>
  );
}