import React, { useState } from 'react';
import { logout } from '../utils/auth-utils';
import '../css/AdminDashboard.css';
import Teachers from './Teachers';
import Students from './Students';
import Settings from './Settings';
import TeacherList from './TeacherList';
import AddTeacherForm from './AddTeacherForm';
import AddStudentForm from './AddStudentForm';
import StudentList from './StudentList';
import AddCourseForm from './AddCourseForm';
import CourseList from './CourseList';
import EnrollStudentForm from './EnrollStudentForm';
import DepartmentManagement from './DepartmentManagement';
import ClassroomManagement from './ClassroomManagement';
import OfferedCourseManagement from './OfferedCourseManagement';
import ScheduleManagement from './ScheduleManagement';

const sections = [
  { key: 'dashboard', label: 'Dashboard', icon: '🏠', category: 'main' },
  { key: 'divider1', label: '— INFRASTRUCTURE —', icon: '', category: 'divider' },
  { key: 'departments', label: 'Departments', icon: '🏢', category: 'infrastructure' },
  { key: 'classrooms', label: 'Classrooms', icon: '🚪', category: 'infrastructure' },
  { key: 'divider2', label: '— ACADEMIC —', icon: '', category: 'divider' },
  { key: 'courses', label: 'Courses', icon: '📚', category: 'academic' },
  { key: 'offered-courses', label: 'Offered Courses', icon: '📖', category: 'academic' },
  { key: 'schedules', label: 'Class Schedules', icon: '🗓️', category: 'academic' },
  { key: 'divider3', label: '— USERS —', icon: '', category: 'divider' },
  { key: 'teachers', label: 'Teachers', icon: '👩‍🏫', category: 'users' },
  { key: 'students', label: 'Students', icon: '🧑‍🎓', category: 'users' },
  { key: 'divider4', label: '— OPERATIONS —', icon: '', category: 'divider' },
  { key: 'enrollments', label: 'Enrollments', icon: '📋', category: 'operations' },
  { key: 'divider5', label: '— SYSTEM —', icon: '', category: 'divider' },
  { key: 'settings', label: 'Settings', icon: '⚙️', category: 'system' },
  { key: 'logout', label: 'Logout', icon: '🚪', category: 'system' },
];

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');

  function handleLogout() {
    logout();
    window.location.href = '/';
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'departments':
        return <DepartmentManagement />;
      case 'classrooms':
        return <ClassroomManagement />;
      case 'offered-courses':
        return <OfferedCourseManagement />;
      case 'schedules':
        return <ScheduleManagement />;
      case 'teachers':
        return (
          <>
            <AddTeacherForm />
            <TeacherList />
          </>
        );
      case 'students':
        return (
          <>
            <AddStudentForm />
            <StudentList />
          </>
        );
      case 'courses':
        return (
          <>
            <AddCourseForm />
            <CourseList />
          </>
        );
      case 'enrollments':
        return <EnrollStudentForm />;
      case 'settings':
        return <Settings />;
      case 'dashboard':
        return (
          <div className="dashboard-welcome">
            <h1>Welcome, Admin!</h1>
            <p style={{ color: '#666', marginBottom: '30px' }}>
              Manage your school's complete attendance and academic system
            </p>
            
            <div className="dashboard-cards">
              <div className="card" onClick={() => setActiveSection('departments')}>
                <h3>🏢 Infrastructure</h3>
                <p>Departments & Classrooms</p>
              </div>
              <div className="card" onClick={() => setActiveSection('courses')}>
                <h3>📚 Academic</h3>
                <p>Courses & Schedules</p>
              </div>
              <div className="card" onClick={() => setActiveSection('teachers')}>
                <h3>👥 Users</h3>
                <p>Teachers & Students</p>
              </div>
              <div className="card" onClick={() => setActiveSection('enrollments')}>
                <h3>📋 Operations</h3>
                <p>Enrollments & Attendance</p>
              </div>
            </div>
            
            <div style={{ marginTop: '40px', padding: '20px', background: '#f0f8ff', borderRadius: '8px' }}>
              <h3 style={{ marginBottom: '15px' }}>📝 Quick Setup Guide</h3>
              <ol style={{ lineHeight: '2', color: '#555' }}>
                <li><strong>Infrastructure:</strong> Create Departments → Add Classrooms</li>
                <li><strong>Users:</strong> Add Teachers → Assign to Departments → Add Students</li>
                <li><strong>Academic:</strong> Create Courses → Link as Offered Courses</li>
                <li><strong>Schedule:</strong> Set up Class Schedules (time/day/room)</li>
                <li><strong>Operations:</strong> Enroll Students → Track Attendance</li>
              </ol>
            </div>
          </div>
        );
      case 'statistics':
        return <Statistics />;
      case 'settings':
        return <Settings />;
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
              {sections.map((section) => {
                if (section.category === 'divider') {
                  return (
                    <li key={section.key} className="divider" style={{ 
                      pointerEvents: 'none',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      color: '#888',
                      padding: '10px 15px',
                      marginTop: '10px',
                      borderBottom: '1px solid #ddd'
                    }}>
                      {section.label}
                    </li>
                  );
                }
                return (
                  <li
                    key={section.key}
                    className={activeSection === section.key ? 'active' : ''}
                    onClick={
                      section.key === 'logout'
                        ? handleLogout
                        : () => setActiveSection(section.key)
                    }
                  >
                    <span className="icon">{section.icon}</span>
                    {section.label}
                  </li>
                );
              })}
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