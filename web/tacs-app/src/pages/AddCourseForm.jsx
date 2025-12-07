import React, { useState, useEffect } from 'react';

export default function AddCourseForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    courseCode: '',
    courseName: '',
    description: '',
    units: '',
    courseType: 'LECTURE'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const authData = JSON.parse(localStorage.getItem('auth'));
      const token = authData?.token;

      const response = await fetch('http://localhost:8080/api/courses', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          courseCode: formData.courseCode,
          courseName: formData.courseName,
          description: formData.description,
          units: parseInt(formData.units),
          courseType: formData.courseType,
          isActive: true
        })
      });

      if (response.ok) {
        setSuccess('Course created successfully!');
        setFormData({ 
          courseCode: '',
          courseName: '', 
          description: '',
          units: '',
          courseType: 'LECTURE'
        });
        if (onSuccess) onSuccess();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const errorText = await response.text();
        setError(errorText || 'Failed to create course');
      }
    } catch (err) {
      setError('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px' }}>
      <h2>Add New Course</h2>
      <div style={{ background: '#d1ecf1', border: '1px solid #17a2b8', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <strong>📚 Course Catalog:</strong> Define courses as reusable templates.
        <br />
        <strong>Next Step:</strong> Go to <strong>Offered Courses</strong> to assign teacher, semester, and section.
      </div>

      {error && (
        <div style={{ background: '#fee', color: '#c33', padding: '10px', borderRadius: '6px', marginBottom: '15px' }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{ background: '#efe', color: '#3c3', padding: '10px', borderRadius: '6px', marginBottom: '15px' }}>
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Course Code *
          </label>
          <input
            type="text"
            name="courseCode"
            value={formData.courseCode}
            onChange={handleChange}
            required
            placeholder="e.g., IT101, MATH201"
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              fontSize: '14px'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Course Name *
          </label>
          <input
            type="text"
            name="courseName"
            value={formData.courseName}
            onChange={handleChange}
            required
            placeholder="e.g., Introduction to Programming"
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              fontSize: '14px'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Units *
          </label>
          <input
            type="number"
            name="units"
            value={formData.units}
            onChange={handleChange}
            required
            min="1"
            max="6"
            placeholder="e.g., 3"
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              fontSize: '14px'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Course Type *
          </label>
          <select
            name="courseType"
            value={formData.courseType}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              fontSize: '14px'
            }}
          >
            <option value="LECTURE">Lecture</option>
            <option value="LABORATORY">Laboratory</option>
            <option value="LECTURE_LAB">Lecture + Lab</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Brief course description..."
            rows="4"
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              fontSize: '14px',
              resize: 'vertical'
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '12px',
            background: loading ? '#94a3b8' : '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            marginTop: '10px',
            boxShadow: loading ? 'none' : '0 2px 4px rgba(16, 185, 129, 0.3)',
            transition: 'all 0.2s'
          }}
        >
          {loading ? 'Creating...' : 'Create Course'}
        </button>
      </form>
    </div>
  );
}
