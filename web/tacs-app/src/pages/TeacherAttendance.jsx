import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertIcon } from '../components/Icons';

/**
 * DEPRECATED: This component has been replaced by TeacherAttendanceSession
 * This page now redirects to the session-based attendance system
 */
export default function TeacherAttendance() {
  const navigate = useNavigate();

  useEffect(() => {
    // Automatically redirect to the new session-based attendance
    navigate('/teacher-attendance-session');
  }, [navigate]);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
        <AlertIcon size={28} /> This page has been upgraded
      </h2>
      <p>Redirecting to the new session-based attendance system...</p>
      <p style={{ marginTop: '20px' }}>
        <a href="/teacher-attendance-session" style={{ color: '#25364a', fontWeight: 'bold' }}>
          Click here if not redirected automatically
        </a>
      </p>
    </div>
  );
}
