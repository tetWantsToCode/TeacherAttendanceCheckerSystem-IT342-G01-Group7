import React, { useState } from 'react';

const initialStudents = [
  { id: 1, name: 'Charlie Brown', email: 'charlie@school.edu', password: 'student123' },
  { id: 2, name: 'Dana White', email: 'dana@school.edu', password: 'student123' }
];

export default function StudentList({ onRemove }) {
  const [students, setStudents] = useState(initialStudents);

  function handleRemove(id) {
    setStudents(students.filter(s => s.id !== id));
    if (onRemove) onRemove(id);
  }

  return (
    <div>
      <h2>Students</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {students.map(student => (
          <li key={student.id} style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f7f9fb', padding: '1rem', borderRadius: '8px' }}>
            <span>
              <strong>{student.name}</strong> <br />
              <span style={{ color: '#555' }}>{student.email}</span><br />
              <span style={{ color: '#888', fontSize: '0.95em' }}>Base Password: {student.password || 'N/A'}</span>
            </span>
            <button onClick={() => handleRemove(student.id)} style={{ background: '#e74c3c', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.5rem 1rem', cursor: 'pointer' }}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
