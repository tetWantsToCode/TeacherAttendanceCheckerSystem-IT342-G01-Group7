import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import './App.css';

export default function App() {
  // Optionally, you can use state for navigation between login/register and dashboards
  // For now, use routing for all main pages
  return (
    <Router>
      <nav style={{ padding: '1rem', background: '#eee' }}>
        <Link to="/">Home</Link> |{' '}
        <Link to="/admin">Admin Dashboard</Link> |{' '}
        <Link to="/teacher">Teacher Dashboard</Link> |{' '}
        <Link to="/student">Student Dashboard</Link> |{' '}
        <Link to="/login">Login</Link> |{' '}
        <Link to="/register">Register</Link>
      </nav>
      <Routes>
        <Route path="/" element={
          <div style={{ padding: '2rem' }}>
            <h1>Welcome to Teacher Attendance Checker System</h1>
            <p>This is the home page. Please log in or go to the admin dashboard.</p>
          </div>
        } />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}
