import React, { useState } from 'react';
import '../css/AdminDashboard.css';
import Teachers from './Teachers';
import Students from './Students';
import Attendance from './Attendance';
import Statistics from './Statistics';
import Settings from './Settings';
import TeacherList from './TeacherList';
import AddTeacherForm from './AddTeacherForm';
import AddStudentForm from './AddStudentForm';
import StudentList from './StudentList';
import AddCourseForm from './AddCourseForm';
import CourseList from './CourseList';
import EnrollStudentForm from './EnrollStudentForm';

const sections = [
  { key: 'dashboard', label: 'Dashboard', icon: '🏠' },
  { key: 'teachers', label: 'Teachers', icon: '👩‍🏫' },
  { key: 'students', label: 'Students', icon: '🧑‍🎓' },
  { key: 'courses', label: 'Courses', icon: '📚' },
  { key: 'enrollments', label: 'Enrollments', icon: '📋' },
  { key: 'attendance', label: 'Attendance', icon: '📝' },
  { key: 'statistics', label: 'Statistics', icon: '📊' },
  { key: 'settings', label: 'Settings', icon: '⚙️' },
  { key: 'logout', label: 'Logout', icon: '🚪' },
];

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [teachers, setTeachers] = useState([
    { id: 1, name: 'Alice Smith', email: 'alice@school.edu' },
    { id: 2, name: 'Bob Johnson', email: 'bob@school.edu' }
  ]);
  const [students, setStudents] = useState([
    { id: 1, name: 'Charlie Brown', email: 'charlie@school.edu', password: 'student123' },
    { id: 2, name: 'Dana White', email: 'dana@school.edu', password: 'student123' }
  ]);
  
  function handleAddTeacher(newTeacher) {
    setTeachers([
      ...teachers,
      { id: Date.now(), ...newTeacher }
    ]);
  }
  function handleRemoveTeacher(id) {
    setTeachers(teachers.filter(t => t.id !== id));
  }
  function handleAddStudent(newStudent) {
    setStudents([
      ...students,
      { id: Date.now(), ...newStudent }
    ]);
  }
  function handleRemoveStudent(id) {
    setStudents(students.filter(s => s.id !== id));
  }

  function handleLogout() {
    // Clear local/session storage as needed
    localStorage.clear();
    sessionStorage.clear();
    // Redirect to login/home page
    window.location.href = '/';
  }

  const renderSection = () => {
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
      case 'courses':
        return (
          <>
            <AddCourseForm />
            <CourseList />
          </>
        );
      case 'enrollments':
        return <EnrollStudentForm />;
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
              <div className="card">Courses Management</div>
              <div className="card">Enrollment Management</div>
            </div>
            <p>Select an option from the sidebar to get started.</p>
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
                  onClick={
                    section.key === 'logout'
                      ? handleLogout
                      : () => setActiveSection(section.key)
                  }
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