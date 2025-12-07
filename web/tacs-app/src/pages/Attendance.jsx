import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Attendance = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect based on user role
    const authData = JSON.parse(localStorage.getItem('auth'));
    const role = authData?.role;

    if (role === 'TEACHER') {
      navigate('/teacher-attendance-session');
    } else if (role === 'STUDENT') {
      navigate('/student-attendance');
    } else {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Redirecting to attendance page...</h2>
    </div>
  );
};

export default Attendance;
