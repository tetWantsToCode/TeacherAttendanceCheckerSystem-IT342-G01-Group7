import React, { useState } from 'react';

export default function AddTeacherForm({ onAdd }) {
  const [fname, setFName] = useState('');
  const [lname, setLName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!fname || !lname || !email || !password || !specialization) {
      setError('Please fill out all fields.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/teachers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fname, lname, email, password, specialization }),
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
      setSpecialization('');
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
        <input
          type="text"
          placeholder="Specialization"
          value={specialization}
          onChange={e => setSpecialization(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc', width: '60%' }}
        />
      </div>
      <button type="submit" style={{ background: '#25364a', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.5rem 1.2rem', cursor: 'pointer' }}>Add Teacher</button>
    </form>
  );
}