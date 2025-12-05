import React, { useState } from 'react';

export default function AddStudentForm({ onAdd }) {
  const [fname, setFName] = useState('');
  const [lname, setLName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [studentNumber, setStudentNumber] = useState('');
  const [program, setProgram] = useState('');
  const [yearLevel, setYearLevel] = useState('');
  const [section, setSection] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [guardianContact, setGuardianContact] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!fname || !lname || !email || !password || !studentNumber || !program || !yearLevel || !section) {
      setError('Please fill out all required fields.');
      return;
    }

    try {
      const authData = JSON.parse(localStorage.getItem('auth'));
      const token = authData?.token;
      const response = await fetch('http://localhost:8080/api/students', {
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
          studentNumber,
          program,
          yearLevel: Number(yearLevel),
          section,
          contactNumber,
          guardianName,
          guardianContact,
          enrollmentStatus: 'ACTIVE'
        }),
      });
      if (!response.ok) {
        const err = await response.json();
        setError(err.message || 'Error adding student');
        return;
      }
      const data = await response.json();
      if (onAdd) onAdd(data);
      setSuccess('Student added successfully!');
      setFName('');
      setLName('');
      setEmail('');
      setPassword('');
      setStudentNumber('');
      setProgram('');
      setYearLevel('');
      setSection('');
      setContactNumber('');
      setGuardianName('');
      setGuardianContact('');
    } catch (err) {
      setError('Server error. Please try again.');
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
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Section"
          value={section}
          onChange={e => setSection(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc', width: '60%' }}
        />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Contact Number"
          value={contactNumber}
          onChange={e => setContactNumber(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc', width: '60%' }}
        />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Guardian Name"
          value={guardianName}
          onChange={e => setGuardianName(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc', width: '60%' }}
        />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Guardian Contact"
          value={guardianContact}
          onChange={e => setGuardianContact(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc', width: '60%' }}
        />
      </div>
      <button type="submit" style={{ background: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.5rem 1.2rem', cursor: 'pointer', boxShadow: '0 2px 4px rgba(16, 185, 129, 0.3)', transition: 'all 0.2s' }}>
        Add Student
      </button>
    </form>
  );
}