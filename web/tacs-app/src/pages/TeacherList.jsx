import React, { useState, useEffect } from 'react';
import { api } from '../utils/api-utils';

export default function TeacherList({ refreshKey }) {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name'); // name, department, email

  useEffect(() => {
    fetchTeachers();
  }, [refreshKey]);

  async function fetchTeachers() {
    setLoading(true);
    const result = await api.get('/teachers');
    if (result.success) {
      setTeachers(result.data);
    }
    setLoading(false);
  }

  async function handleRemove(teacherId) {
    if (window.confirm('Are you sure you want to remove this teacher?')) {
      const result = await api.delete(`/teachers/${teacherId}`);
      if (result.success) {
        alert('Teacher removed successfully!');
        fetchTeachers();
      } else {
        alert('Failed to remove teacher: ' + result.error);
      }
    }
  }

  if (loading) return <div>Loading teachers...</div>;

  return (
    <div>
      <h2>Teachers</h2>
      
      {/* Search and Sort Controls */}
      <div style={{ marginBottom: '20px', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
        <input
          type="text"
          placeholder="Search by name, email, or department..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '10px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            fontSize: '14px'
          }}
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            padding: '10px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            fontSize: '14px'
          }}
        >
          <option value="name">Sort: Name (A-Z)</option>
          <option value="department">Sort: Department</option>
          <option value="email">Sort: Email</option>
        </select>
      </div>
      
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {teachers
          .filter(teacher => {
            const search = searchTerm.toLowerCase();
            return teacher.user?.fname?.toLowerCase().includes(search) ||
                   teacher.user?.lname?.toLowerCase().includes(search) ||
                   teacher.user?.email?.toLowerCase().includes(search) ||
                   teacher.department?.departmentName?.toLowerCase().includes(search);
          })
          .sort((a, b) => {
            if (sortBy === 'name') {
              const nameA = `${a.user?.fname} ${a.user?.lname}`.toLowerCase();
              const nameB = `${b.user?.fname} ${b.user?.lname}`.toLowerCase();
              return nameA.localeCompare(nameB);
            } else if (sortBy === 'department') {
              return (a.department?.departmentName || '').localeCompare(b.department?.departmentName || '');
            } else {
              return (a.user?.email || '').localeCompare(b.user?.email || '');
            }
          })
          .map(teacher => (
          <li key={teacher.teacherId} style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f7f9fb', padding: '1rem', borderRadius: '8px' }}>
            <span>
              <strong>{teacher.user?.fname} {teacher.user?.lname}</strong> <br />
              <span style={{ color: '#555' }}>{teacher.user?.email}</span><br />
              {teacher.department && (
                <span style={{ color: '#888', fontSize: '0.95em' }}>Dept: {teacher.department.departmentName}</span>
              )}
            </span>
            <button onClick={() => handleRemove(teacher.teacherId)} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.5rem 1rem', cursor: 'pointer', boxShadow: '0 2px 4px rgba(239, 68, 68, 0.3)', transition: 'all 0.2s' }}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
