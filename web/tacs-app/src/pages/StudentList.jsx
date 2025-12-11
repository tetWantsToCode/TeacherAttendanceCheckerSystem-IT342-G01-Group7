import React, { useState, useEffect } from 'react';
import { api } from '../utils/api-utils';

export default function StudentList({ refreshKey }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingStudent, setEditingStudent] = useState(null);
  const [editForm, setEditForm] = useState({
    yearLevel: '',
    section: '',
    program: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name'); // name, studentNumber, yearLevel, program
  const [filterYearLevel, setFilterYearLevel] = useState('all');

  useEffect(() => {
    fetchStudents();
  }, [refreshKey]);

  async function fetchStudents() {
    setLoading(true);
    const result = await api.get('/students');
    if (result.success) {
      setStudents(result.data);
    }
    setLoading(false);
  }

  function handleEdit(student) {
    setEditingStudent(student);
    setEditForm({
      yearLevel: student.yearLevel,
      section: student.section,
      program: student.program
    });
  }

  async function handleSaveEdit() {
    const result = await api.put(`/students/${editingStudent.studentId}`, editForm);
    if (result.success) {
      alert('Student updated successfully!');
      setEditingStudent(null);
      fetchStudents();
    } else {
      alert('Failed to update student: ' + result.error);
    }
  }

  function handleCancelEdit() {
    setEditingStudent(null);
    setEditForm({ yearLevel: '', section: '', program: '' });
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
      
      {/* Search, Sort, and Filter Controls */}
      <div style={{ marginBottom: '20px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '10px' }}>
        <input
          type="text"
          placeholder="Search by name, email, student number, program..."
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
          <option value="studentNumber">Sort: Student Number</option>
          <option value="yearLevel">Sort: Year Level</option>
          <option value="program">Sort: Program</option>
        </select>
        <select
          value={filterYearLevel}
          onChange={(e) => setFilterYearLevel(e.target.value)}
          style={{
            padding: '10px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            fontSize: '14px'
          }}
        >
          <option value="all">All Year Levels</option>
          <option value="1">Year 1</option>
          <option value="2">Year 2</option>
          <option value="3">Year 3</option>
          <option value="4">Year 4</option>
          <option value="5">Year 5</option>
        </select>
      </div>
      
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {students
          .filter(student => {
            const search = searchTerm.toLowerCase();
            const matchesSearch = student.user?.fname?.toLowerCase().includes(search) ||
                                 student.user?.lname?.toLowerCase().includes(search) ||
                                 student.user?.email?.toLowerCase().includes(search) ||
                                 student.studentNumber?.toLowerCase().includes(search) ||
                                 student.program?.toLowerCase().includes(search);
            const matchesYearLevel = filterYearLevel === 'all' || student.yearLevel?.toString() === filterYearLevel;
            return matchesSearch && matchesYearLevel;
          })
          .sort((a, b) => {
            if (sortBy === 'name') {
              const nameA = `${a.user?.fname} ${a.user?.lname}`.toLowerCase();
              const nameB = `${b.user?.fname} ${b.user?.lname}`.toLowerCase();
              return nameA.localeCompare(nameB);
            } else if (sortBy === 'studentNumber') {
              return (a.studentNumber || '').localeCompare(b.studentNumber || '');
            } else if (sortBy === 'yearLevel') {
              return (a.yearLevel || 0) - (b.yearLevel || 0);
            } else {
              return (a.program || '').localeCompare(b.program || '');
            }
          })
          .map(student => (
          <li key={student.studentId} style={{ marginBottom: '1rem', background: '#f7f9fb', padding: '1rem', borderRadius: '8px' }}>
            {editingStudent?.studentId === student.studentId ? (
              <div>
                <div style={{ marginBottom: '10px' }}>
                  <strong>{student.user?.fname} {student.user?.lname}</strong>
                  <br />
                  <span style={{ color: '#555' }}>{student.user?.email}</span>
                </div>
                <div style={{ display: 'grid', gap: '10px', marginBottom: '10px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '13px' }}>Year Level:</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={editForm.yearLevel}
                      onChange={(e) => setEditForm({ ...editForm, yearLevel: parseInt(e.target.value) })}
                      style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '13px' }}>Section:</label>
                    <input
                      type="text"
                      value={editForm.section}
                      onChange={(e) => setEditForm({ ...editForm, section: e.target.value })}
                      style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '13px' }}>Program:</label>
                    <input
                      type="text"
                      value={editForm.program}
                      onChange={(e) => setEditForm({ ...editForm, program: e.target.value })}
                      style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    onClick={handleSaveEdit}
                    style={{ background: '#4CAF50', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.5rem 1rem', cursor: 'pointer' }}
                  >
                    Save
                  </button>
                  <button 
                    onClick={handleCancelEdit}
                    style={{ background: '#999', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.5rem 1rem', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>
                  <strong>{student.user?.fname} {student.user?.lname}</strong> <br />
                  <span style={{ color: '#555' }}>{student.user?.email}</span><br />
                  <span style={{ color: '#888', fontSize: '0.95em' }}>
                    {student.program} - Year {student.yearLevel} {student.section}
                  </span>
                </span>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    onClick={() => handleEdit(student)}
                    style={{ background: '#3F72AF', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.5rem 1rem', cursor: 'pointer' }}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleRemove(student.studentId)}
                    style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.5rem 1rem', cursor: 'pointer' }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
