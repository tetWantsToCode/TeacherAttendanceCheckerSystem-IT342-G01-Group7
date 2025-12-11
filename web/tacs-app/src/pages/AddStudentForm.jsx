import React, { useState } from 'react';
import { api } from '../utils/api-utils';

export default function AddStudentForm({ onSuccess }) {
  const [fname, setFName] = useState('');
  const [lname, setLName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [studentNumber, setStudentNumber] = useState('');
  const [program, setProgram] = useState('');
  const [yearLevel, setYearLevel] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!fname || !lname || !email || !password || !studentNumber || !program || !yearLevel) {
      setError('Please fill out all required fields.');
      return;
    }

    const result = await api.post('/students', {
      fname,
      lname,
      email,
      password,
      studentNumber,
      program,
      yearLevel: Number(yearLevel),
      enrollmentStatus: 'ACTIVE'
    });

    if (result.success) {
      setSuccess('Student added successfully!');
      setFName('');
      setLName('');
      setEmail('');
      setPassword('');
      setStudentNumber('');
      setProgram('');
      setYearLevel('');
      if (onSuccess) onSuccess();
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', background: '#f7f9fb', padding: '1rem', borderRadius: '8px' }}>
      <h3>Add Student</h3>
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
        <input
          type="text"
          placeholder="Student Number (e.g., 2021-12345)"
          value={studentNumber}
          onChange={e => setStudentNumber(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc', width: '60%' }}
        />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <select
          value={program}
          onChange={e => setProgram(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc', width: '60%' }}
          required
        >
          <option value="">Select Program *</option>
          <option value="BSIT">BS Information Technology</option>
          <option value="BSCS">BS Computer Science</option>
          <option value="BSCE">BS Computer Engineering</option>
          <option value="BSIS">BS Information Systems</option>
          <option value="BSEMC">BS Entertainment and Multimedia Computing</option>
        </select>
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="number"
          placeholder="Year Level"
          value={yearLevel}
          onChange={e => setYearLevel(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc', width: '60%' }}
        />
      </div>
      <button type="submit" style={{ background: '#3F72AF', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.5rem 1.2rem', cursor: 'pointer', transition: 'all 0.2s' }}>
        Add Student
      </button>
    </form>
  );
}