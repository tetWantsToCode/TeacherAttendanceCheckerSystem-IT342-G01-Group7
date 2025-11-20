import React, { useState } from 'react';

const initialTeachers = [
  { id: 1, name: 'Alice Smith', email: 'alice@school.edu', password: 'password123' },
  { id: 2, name: 'Bob Johnson', email: 'bob@school.edu', password: 'password456' }
];

export default function TeacherList({ teachers, onRemove }) {
  return (
    <div>
      <h2>Teachers</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {teachers.map(teacher => (
          <li key={teacher.id} style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f7f9fb', padding: '1rem', borderRadius: '8px' }}>
            <span>
              <strong>{teacher.name}</strong> <br />
              <span style={{ color: '#555' }}>{teacher.email}</span><br />
              <span style={{ color: '#888', fontSize: '0.95em' }}>Base Password: {teacher.password || 'N/A'}</span>
            </span>
            <button onClick={() => onRemove(teacher.id)} style={{ background: '#e74c3c', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.5rem 1rem', cursor: 'pointer' }}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
