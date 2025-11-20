import React, { useState } from 'react';
import '../css/TeacherDashboard.css';
import MyClasses from './MyClasses';
import TeacherAttendance from './TeacherAttendance';
import TeacherProfile from './Profile';
import TeacherSettings from './TeacherSettings';

const sections = [
  { name: 'My Classes', key: 'classes' },
  { name: 'Attendance', key: 'attendance' },
  { name: 'Profile', key: 'profile' },
  { name: 'Settings', key: 'settings' }
];

export default function TeacherDashboard() {
  const [activeSection, setActiveSection] = useState('classes');

  return (
    <div className="teacher-dashboard">
      <header className="dashboard-header">
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
                  onClick={() => setActiveSection(section.key)}
                >
                  {section.name}
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <main className="main-content">
          {activeSection === 'classes' && <MyClasses />}
          {activeSection === 'attendance' && <TeacherAttendance />}
          {activeSection === 'profile' && <TeacherProfile />}
          {activeSection === 'settings' && <TeacherSettings />}
        </main>
      </div>
    </div>
  );
}
