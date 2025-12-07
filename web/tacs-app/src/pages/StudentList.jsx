import React, { useState, useEffect } from 'react';
import { api } from '../utils/api-utils';

export default function StudentList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  async function fetchStudents() {
    setLoading(true);
    const result = await api.get('/students');
    if (result.success) {
      setStudents(result.data);
    }
    setLoading(false);
  }

  async function handleRemove(studentId) {
    if (window.confirm('Are you sure you want to remove this student?')) {
      const result = await api.delete(`/students/${studentId}`);
      if (result.success) {
        alert('Student removed successfully!');
        fetchStudents();
      } else {
        alert('Failed to remove student: ' + result.error);
      }
    }
  }

  if (loading) return <div>Loading students...</div>;

  return (
    <div>
      <h2>Students</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {students.map(student => (
          <li key={student.studentId} style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f7f9fb', padding: '1rem', borderRadius: '8px' }}>
            <span>
              <strong>{student.user?.fname} {student.user?.lname}</strong> <br />
              <span style={{ color: '#555' }}>{student.user?.email}</span><br />
              <span style={{ color: '#888', fontSize: '0.95em' }}>
                {student.program} - Year {student.yearLevel} {student.section}
              </span>
            </span>
            <button onClick={() => handleRemove(student.studentId)} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.5rem 1rem', cursor: 'pointer', boxShadow: '0 2px 4px rgba(239, 68, 68, 0.3)', transition: 'all 0.2s' }}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
