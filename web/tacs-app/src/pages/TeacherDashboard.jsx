import React, { useState } from 'react';
import '../css/TeacherDashboard.css';
import MyClasses from './MyClasses';
import TeacherAttendance from './TeacherAttendance';
import TeacherProfile from './TeacherProfile';
import TeacherSettings from './TeacherSettings';

const sections = [
  { key: 'classes', name: 'My Classes' },
  { key: 'attendance', name: 'Attendance' },
  { key: 'profile', name: 'Profile' },
  { key: 'settings', name: 'Settings' },
  { key: 'logout', name: 'Logout' }
];

export default function TeacherDashboard() {
  const [activeSection, setActiveSection] = useState('classes');

  function handleLogout() {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/';
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'classes':
        return <MyClasses />;
      case 'attendance':
        return <TeacherAttendance />;
      case 'profile':
        return <TeacherProfile />;
      case 'settings':
        return <TeacherSettings />;
      default:
        return null;
    }
  };

  return (
    <div className="teacher-dashboard">
      <header className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="logo">Teacher Dashboard</span>
        <span>Welcome, Teacher!</span>
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