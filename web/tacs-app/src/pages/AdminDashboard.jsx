
import React, { useState } from 'react';
import '../css/AdminDashboard.css';
import Teachers from './Teachers';
import Students from './Students';
import Attendance from './Attendance';
import Statistics from './Statistics';
import Settings from './Settings';

const sections = [
  { key: 'dashboard', label: 'Dashboard', icon: '🏠' },
  { key: 'teachers', label: 'Teachers', icon: '👩‍🏫' },
  { key: 'students', label: 'Students', icon: '🧑‍🎓' },
  { key: 'attendance', label: 'Attendance', icon: '📝' },
  { key: 'statistics', label: 'Statistics', icon: '📊' },
  { key: 'settings', label: 'Settings', icon: '⚙️' },
  { key: 'logout', label: 'Logout', icon: '🚪' },
];

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderSection = () => {
    switch (activeSection) {
      case 'teachers':
        return <Teachers />;
      case 'students':
        return <Students />;
      case 'attendance':
        return <Attendance />;
      case 'statistics':
        return <Statistics />;
      case 'settings':
        return <Settings />;
      case 'dashboard':
        return (
          <div className="dashboard-welcome">
            <h1>Welcome, Admin!</h1>
            <div className="dashboard-cards">
              <div className="card">Teachers Overview</div>
              <div className="card">Students Overview</div>
              <div className="card">Attendance Summary</div>
              <div className="card">Statistics</div>
            </div>
            <p>Select an option from the sidebar to get started.</p>
          </div>
        );
      case 'logout':
        window.location.href = '/';
        return null;
      default:
        return null;
    }
  };

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <span className="logo">TACS Admin</span>
        <span className="admin-info">Admin User</span>
      </header>
      <div className="dashboard-body">
        <aside className="sidebar">
          <nav>
            <ul>
              {sections.map((section) => (
                <li
                  key={section.key}
                  className={activeSection === section.key ? 'active' : ''}
                  onClick={() => setActiveSection(section.key)}
                >
                  <span className="icon">{section.icon}</span>
                  {section.label}
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
};

export default AdminDashboard;
