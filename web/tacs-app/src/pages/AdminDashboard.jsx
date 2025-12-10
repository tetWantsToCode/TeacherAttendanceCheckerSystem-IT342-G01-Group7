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
import DataManagement from './DataManagement';
import {
  HomeIcon,
  BuildingIcon,
  DoorIcon,
  BookIcon,
  BookOpenIcon,
  CalendarIcon,
  TeacherIcon,
  StudentIcon,
  ClipboardIcon,
  TrashIcon,
  SettingsIcon,
  LogoutIcon
} from '../components/Icons';

const sections = [
  { key: 'dashboard', label: 'Dashboard', icon: 'home', category: 'main' },
  { key: 'divider1', label: '— INFRASTRUCTURE —', icon: '', category: 'divider' },
  { key: 'departments', label: 'Departments', icon: 'building', category: 'infrastructure' },
  { key: 'classrooms', label: 'Classrooms', icon: 'door', category: 'infrastructure' },
  { key: 'divider2', label: '— ACADEMIC —', icon: '', category: 'divider' },
  { key: 'courses', label: 'Courses', icon: 'book', category: 'academic' },
  { key: 'offered-courses', label: 'Offered Courses', icon: 'book-open', category: 'academic' },
  { key: 'schedules', label: 'Class Schedules', icon: 'calendar', category: 'academic' },
  { key: 'divider3', label: '— USERS —', icon: '', category: 'divider' },
  { key: 'teachers', label: 'Teachers', icon: 'teacher', category: 'users' },
  { key: 'students', label: 'Students', icon: 'student', category: 'users' },
  { key: 'divider4', label: '— OPERATIONS —', icon: '', category: 'divider' },
  { key: 'enrollments', label: 'Enrollments', icon: 'clipboard', category: 'operations' },
  { key: 'divider5', label: '— SYSTEM —', icon: '', category: 'divider' },
  { key: 'data-management', label: 'Data Management', icon: 'trash', category: 'system' },
  { key: 'settings', label: 'Settings', icon: 'settings', category: 'system' },
  { key: 'logout', label: 'Logout', icon: 'logout', category: 'system' },
];

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [teacherRefreshKey, setTeacherRefreshKey] = useState(0);
  const [studentRefreshKey, setStudentRefreshKey] = useState(0);
  const [courseRefreshKey, setCourseRefreshKey] = useState(0);

  function handleLogout() {
    logout();
    window.location.href = '/';
  }

  // Icon mapping function
  const getIcon = (iconName) => {
    const iconMap = {
      'home': <HomeIcon />,
      'building': <BuildingIcon />,
      'door': <DoorIcon />,
      'book': <BookIcon />,
      'book-open': <BookOpenIcon />,
      'calendar': <CalendarIcon />,
      'teacher': <TeacherIcon />,
      'student': <StudentIcon />,
      'clipboard': <ClipboardIcon />,
      'trash': <TrashIcon />,
      'settings': <SettingsIcon />,
      'logout': <LogoutIcon />
    };
    return iconMap[iconName] || null;
  };

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
            <AddTeacherForm onSuccess={() => setTeacherRefreshKey(prev => prev + 1)} />
            <TeacherList refreshKey={teacherRefreshKey} />
          </>
        );
      case 'students':
        return (
          <>
            <AddStudentForm onSuccess={() => setStudentRefreshKey(prev => prev + 1)} />
            <StudentList refreshKey={studentRefreshKey} />
          </>
        );
      case 'courses':
        return (
          <>
            <AddCourseForm onSuccess={() => setCourseRefreshKey(prev => prev + 1)} />
            <CourseList refreshKey={courseRefreshKey} />
          </>
        );
      case 'enrollments':
        return <EnrollStudentForm />;
      case 'data-management':
        return <DataManagement />;
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
                <h3><BuildingIcon size={24} /> Infrastructure</h3>
                <p>Departments & Classrooms</p>
              </div>
              <div className="card" onClick={() => setActiveSection('courses')}>
                <h3><BookIcon size={24} /> Academic</h3>
                <p>Courses & Schedules</p>
              </div>
              <div className="card" onClick={() => setActiveSection('teachers')}>
                <h3><TeacherIcon size={24} /> Users</h3>
                <p>Teachers & Students</p>
              </div>
              <div className="card" onClick={() => setActiveSection('enrollments')}>
                <h3><ClipboardIcon size={24} /> Operations</h3>
                <p>Enrollments & Attendance</p>
              </div>
            </div>
            
            <div style={{ marginTop: '40px', padding: '20px', background: '#f0f8ff', borderRadius: '8px' }}>
              <h3 style={{ marginBottom: '15px' }}><BookIcon size={20} /> Quick Setup Guide</h3>
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
                    <span className="icon">{getIcon(section.icon)}</span>
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