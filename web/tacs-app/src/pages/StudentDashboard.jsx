import React, { useState, useEffect } from 'react';
import '../css/StudentDashboard.css';
import StudentClasses from './StudentClasses';
import StudentProfile from './Profile';
import StudentSettings from './StudentSettings';

const sections = [
  { name: 'My Classes', key: 'classes' },
  { name: 'Profile', key: 'profile' },
  { name: 'Settings', key: 'settings' },
  { name: 'Logout', key: 'logout' }
];

export default function StudentDashboard() {
  const [activeSection, setActiveSection] = useState('classes');
  const [studentName, setStudentName] = useState('Student');

  useEffect(() => {
    // Get the student's first name from localStorage
    const authData = JSON.parse(localStorage.getItem('auth'));
    if (authData && authData.fname) {
      setStudentName(authData.fname);
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
        <span className="logo">Student Dashboard</span>
        <span>Welcome, {studentName}!</span>
      </header>
      <div className="dashboard-body">
        <aside className="sidebar">
          <nav>
            <ul>
              {sections.map(section => (
                <li
                  key={section.key}
                  className={activeSection === section.key ? 'active' : ''}
                  onClick={
                    section.key === 'logout'
                      ? handleLogout
                      : () => setActiveSection(section.key)
                  }
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