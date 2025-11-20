import React, { useState } from 'react';
import '../css/StudentDashboard.css';
import StudentAttendance from './StudentAttendance';
import StudentClasses from './StudentClasses';
import StudentProfile from './Profile';
import StudentSettings from './StudentSettings';

const sections = [
  { name: 'My Attendance', key: 'attendance' },
  { name: 'My Classes', key: 'classes' },
  { name: 'Profile', key: 'profile' },
  { name: 'Settings', key: 'settings' }
];

export default function StudentDashboard() {
  const [activeSection, setActiveSection] = useState('attendance');

  return (
    <div className="student-dashboard">
      <header className="dashboard-header">
        <span className="logo">Student Dashboard</span>
        <span>Welcome, Student!</span>
      </header>
      <div className="dashboard-body">
        <aside className="sidebar">
          <nav>
            <ul>
              {sections.map(section => (
                <li
                  key={section.key}
                  className={activeSection === section.key ? 'active' : ''}
                  onClick={() => setActiveSection(section.key)}
                >
                  {section.name}
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <main className="main-content">
          {activeSection === 'attendance' && <StudentAttendance />}
          {activeSection === 'classes' && <StudentClasses />}
          {activeSection === 'profile' && <StudentProfile />}
          {activeSection === 'settings' && <StudentSettings />}
        </main>
      </div>
    </div>
  );
}
