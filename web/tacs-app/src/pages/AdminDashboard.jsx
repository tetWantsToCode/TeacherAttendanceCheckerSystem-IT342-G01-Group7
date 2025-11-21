import React, { useState, useEffect } from 'react';
import '../css/AdminDashboard.css';
import Teachers from './Teachers';
import Students from './Students';
import Settings from './Settings';

import TeacherList from './TeacherList';
import AddTeacherForm from './AddTeacherForm';
import AddStudentForm from './AddStudentForm';
import StudentList from './StudentList';

import ClassList from './ClassList';
import AddClassForm from './AddClassForm';

const sections = [
  { key: 'dashboard', label: 'Dashboard', icon: '🏠' },
  { key: 'teachers', label: 'Teachers', icon: '👩‍🏫' },
  { key: 'students', label: 'Students', icon: '🧑‍🎓' },
  { key: 'classes', label: 'Classes', icon: '🏫' },
  { key: 'settings', label: 'Settings', icon: '⚙️' },
  { key: 'logout', label: 'Logout', icon: '🚪' },
];

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setTeachers([
        { id: 1, name: 'Alice Smith', email: 'alice@school.edu', subject: 'Mathematics' },
        { id: 2, name: 'Bob Johnson', email: 'bob@school.edu', subject: 'Science' }
      ]);

      setStudents([
        { id: 1, name: 'Charlie Brown', email: 'charlie@school.edu', grade: '10th' },
        { id: 2, name: 'Dana White', email: 'dana@school.edu', grade: '11th' }
      ]);

      setClasses([
        { id: 1, className: 'Math 101', room: 'Room A', teacher: 'Alice Smith' }
      ]);

      setIsLoading(false);
    }, 500);
  }, []);

  // HANDLERS
  const handleAddTeacher = (newTeacher) => {
    setTeachers(prev => [...prev, { id: Date.now(), ...newTeacher }]);
  };

  const handleRemoveTeacher = (id) => {
    if (window.confirm('Remove this teacher?'))
      setTeachers(prev => prev.filter(t => t.id !== id));
  };

  const handleAddStudent = (newStudent) => {
    setStudents(prev => [...prev, { id: Date.now(), ...newStudent }]);
  };

  const handleRemoveStudent = (id) => {
    if (window.confirm('Remove this student?'))
      setStudents(prev => prev.filter(s => s.id !== id));
  };

  const handleAddClass = (newClass) => {
    setClasses(prev => [...prev, { id: Date.now(), ...newClass }]);
  };

  const handleRemoveClass = (id) => {
    if (window.confirm('Remove this class?'))
      setClasses(prev => prev.filter(c => c.id !== id));
  };

  const handleLogout = () => {
    if (window.confirm('Logout?')) window.location.href = '/';
  };

  const handleSectionChange = (key) => {
    if (key === 'logout') return handleLogout();
    setActiveSection(key);
  };

  // RENDER SECTIONS
  const renderSection = () => {
    if (isLoading && activeSection === 'dashboard') {
      return <div className="loading">Loading dashboard...</div>;
    }

    switch (activeSection) {
      case 'teachers':
        return (
          <>
            <AddTeacherForm onAdd={handleAddTeacher} />
            <TeacherList teachers={teachers} onRemove={handleRemoveTeacher} />
          </>
        );

      case 'students':
        return (
          <>
            <AddStudentForm onAdd={handleAddStudent} />
            <StudentList students={students} onRemove={handleRemoveStudent} />
          </>
        );

      case 'classes':
        return (
          <>
            <AddClassForm teachers={teachers} onAdd={handleAddClass} />
            <ClassList classes={classes} onRemove={handleRemoveClass} />
          </>
        );

      case 'settings':
        return <Settings />;

      case 'dashboard':
        return (
          <div className="dashboard-welcome">
            <h1>Welcome, Admin!</h1>
            <p>Use the sidebar to manage teachers, students, and classes.</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <span className="logo">TACS Admin</span>
        <div className="admin-info">
          <span>Admin User</span>
        </div>
      </header>

      <div className="dashboard-body">
        <aside className="sidebar">
          <nav>
            <ul>
              {sections.map((section) => (
                <li
                  key={section.key}
                  className={activeSection === section.key ? 'active' : ''}
                  onClick={() => handleSectionChange(section.key)}
                >
                  <span className="icon">{section.icon}</span>
                  <span className="label">{section.label}</span>
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
