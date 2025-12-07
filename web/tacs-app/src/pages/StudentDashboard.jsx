import React, { useState, useEffect } from 'react';
import '../css/StudentDashboard.css';
import StudentClasses from './StudentClasses';
import StudentProfile from './Profile';
import StudentSettings from './StudentSettings';

const sections = [
  { name: 'My Classes', key: 'classes' },
  { name: 'Settings', key: 'settings' },
  { name: 'Logout', key: 'logout' }
];

export default function StudentDashboard() {
  const [activeSection, setActiveSection] = useState('classes');
  const [studentName, setStudentName] = useState('Student');

  useEffect(() => {
    // Get the student's name from localStorage
    const authData = JSON.parse(localStorage.getItem('auth'));
    if (authData && authData.fname) {
      const fullName = `${authData.fname} ${authData.lname || ''}`.trim();
      setStudentName(fullName);
    }
  }, []);

  function handleLogout() {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/';
  }

  function handleSectionClick(sectionKey) {
    if (sectionKey === 'logout') {
      handleLogout();
    } else {
      setActiveSection(sectionKey);
    }
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
          <div className="profile-name">
            {studentName}
          </div>
        </div>
      </header>
      <div className="dashboard-body">
        <aside className="sidebar">
          <nav>
            <ul>
              {sections.map(section => (
                <li
                  key={section.key}
                  className={activeSection === section.key ? 'active' : ''}
                  onClick={() => handleSectionClick(section.key)}
                >
                  {section.name}
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <main className="main-content">
          {renderSection()}
        </main>
      </div>
    </div>
  );
}
