import React, { useState, useEffect } from 'react';

export default function AddCourseForm() {
  const [formData, setFormData] = useState({
    teacherId: '',
    courseCode: '',
    courseName: '',
    description: '',
    units: '',
    courseType: 'LECTURE',
    semester: 'FIRST_SEM',
    schoolYear: '2024-2025'
  });
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const authData = JSON.parse(localStorage.getItem('auth'));
      const token = authData?.token;

      const response = await fetch('http://localhost:8080/api/teachers', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Fetched teachers:', data);
        setTeachers(data);
      } else {
        console.error('Failed to fetch teachers, status:', response.status);
        setError('Failed to load teachers. Please ensure teachers exist in the system.');
      }
    } catch (err) {
      console.error('Error fetching teachers:', err);
      setError('Error loading teachers: ' + err.message);
    }
  };

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
          teacherId: formData.teacherId,
          courseCode: formData.courseCode,
          courseName: formData.courseName,
          description: formData.description,
          units: parseInt(formData.units),
          courseType: formData.courseType,
          semester: formData.semester,
          schoolYear: formData.schoolYear,
          isActive: true
        })
      });

      if (response.ok) {
        setSuccess('Course created successfully!');
        setFormData({ 
          teacherId: '', 
          courseCode: '',
          courseName: '', 
          description: '',
          units: '',
          courseType: 'LECTURE',
          semester: 'FIRST_SEM',
          schoolYear: '2024-2025'
        });
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
            Assign Teacher *
          </label>
          <select
            name="teacherId"
            value={formData.teacherId}
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
            <option value="">Select a teacher...</option>
            {teachers.map(teacher => (
              <option key={teacher.teacherId} value={teacher.teacherId}>
                {teacher.user.fname} {teacher.user.lname} ({teacher.user.email})
              </option>
            ))}
          </select>
        </div>

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
            Semester *
          </label>
          <select
            name="semester"
            value={formData.semester}
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
            <option value="FIRST_SEM">First Semester</option>
            <option value="SECOND_SEM">Second Semester</option>
            <option value="SUMMER">Summer</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            School Year *
          </label>
          <input
            type="text"
            name="schoolYear"
            value={formData.schoolYear}
            onChange={handleChange}
            required
            placeholder="e.g., 2024-2025"
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
