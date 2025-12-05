import React, { useState, useEffect } from 'react';

export default function AddTeacherForm({ onAdd }) {
  const [fname, setFName] = useState('');
  const [lname, setLName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchDepartments();
  }, []);

  async function fetchDepartments() {
    try {
      const authData = JSON.parse(localStorage.getItem('auth'));
      const token = authData?.token;
      const response = await fetch('http://localhost:8080/api/departments', {
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      if (response.ok) {
        const data = await response.json();
        setDepartments(data);
      }
    } catch (err) {
      console.error('Error fetching departments:', err);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!fname || !lname || !email || !password) {
      setError('Please fill out all fields.');
      return;
    }

    try {
      const authData = JSON.parse(localStorage.getItem('auth'));
      const token = authData?.token;
      const response = await fetch('http://localhost:8080/api/teachers', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ 
          fname, 
          lname, 
          email, 
          password, 
          departmentId: departmentId ? parseInt(departmentId) : null
        })
      });
      if (!response.ok) {
        const err = await response.json();
        setError(err.message || 'Error adding teacher');
        return;
      }
      const data = await response.json();
      if (onAdd) onAdd(data);
      setSuccess('Teacher added successfully!');
      setFName('');
      setLName('');
      setEmail('');
      setPassword('');
      setDepartmentId('');
    } catch (err) {
      setError('Server error. Please try again.');
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', background: '#f7f9fb', padding: '1rem', borderRadius: '8px' }}>
      <h3>Add Teacher</h3>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {success && <div style={{ color: 'green' }}>{success}</div>}
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="First Name"
          value={fname}
          onChange={e => setFName(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc', width: '60%' }}
        />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Last Name"
          value={lname}
          onChange={e => setLName(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc', width: '60%' }}
        />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="email"
          placeholder="Email (set by admin)"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc', width: '60%' }}
        />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Base Password (set by admin)"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc', width: '60%' }}
        />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <select
          value={departmentId}
          onChange={e => setDepartmentId(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc', width: '60%' }}
        >
          <option value="">Select Department (Optional)</option>
          {departments.map(dept => (
            <option key={dept.departmentId} value={dept.departmentId}>
              {dept.departmentName} ({dept.departmentCode})
            </option>
          ))}
        </select>
      </div>
      <button type="submit" style={{ background: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.5rem 1.2rem', cursor: 'pointer', boxShadow: '0 2px 4px rgba(16, 185, 129, 0.3)', transition: 'all 0.2s' }}>Add Teacher</button>
    </form>
  );
}