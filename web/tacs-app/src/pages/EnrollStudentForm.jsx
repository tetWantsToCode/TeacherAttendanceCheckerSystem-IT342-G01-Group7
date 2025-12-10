import React, { useState, useEffect } from 'react';

export default function EnrollStudentForm() {
  const [formData, setFormData] = useState({
    studentId: '',
    courseId: ''
  });
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchStudents();
    fetchCourses();
    fetchEnrollments();
  }, []);

  const fetchStudents = async () => {
    try {
      const authData = JSON.parse(localStorage.getItem('auth'));
      const token = authData?.token;

      const response = await fetch('http://localhost:8080/api/students', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      }
    } catch (err) {
      console.error('Error fetching students:', err);
    }
  };

  const fetchCourses = async () => {
    try {
      const authData = JSON.parse(localStorage.getItem('auth'));
      const token = authData?.token;

      const response = await fetch('http://localhost:8080/api/courses', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
    }
  };

  const fetchEnrollments = async () => {
    try {
      const authData = JSON.parse(localStorage.getItem('auth'));
      const token = authData?.token;

      const response = await fetch('http://localhost:8080/api/enrollments', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setEnrollments(data);
      }
    } catch (err) {
      console.error('Error fetching enrollments:', err);
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

      const response = await fetch('http://localhost:8080/api/enrollments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          studentId: parseInt(formData.studentId),
          courseId: parseInt(formData.courseId)
        })
      });

      if (response.ok) {
        setSuccess('Student enrolled successfully!');
        setFormData({ studentId: '', courseId: '' });
        fetchEnrollments();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const errorText = await response.text();
        setError(errorText || 'Failed to enroll student');
      }
    } catch (err) {
      setError('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEnrollment = async (enrollmentId) => {
    if (!confirm('Are you sure you want to delete this enrollment?')) return;

    try {
      const authData = JSON.parse(localStorage.getItem('auth'));
      const token = authData?.token;

      const response = await fetch(`http://localhost:8080/api/enrollments/${enrollmentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        fetchEnrollments();
      } else {
        alert('Failed to delete enrollment');
      }
    } catch (err) {
      alert('Error deleting enrollment');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Enroll Student in Course</h2>

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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
        {/* Enrollment Form */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>New Enrollment</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Select Student *
              </label>
              <select
                name="studentId"
                value={formData.studentId}
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
                <option value="">Choose student...</option>
                {students.map(student => (
                  <option key={student.studentId} value={student.studentId}>
                    {student.user.fname} {student.user.lname} - Year {student.yearLevel}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Select Course *
              </label>
              <select
                name="courseId"
                value={formData.courseId}
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
                <option value="">Choose course...</option>
                {courses.map(course => (
                  <option key={course.courseId} value={course.courseId}>
                    {course.courseName}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '12px',
                background: loading ? '#ccc' : '#25364a',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                marginTop: '10px'
              }}
            >
              {loading ? 'Enrolling...' : 'Enroll Student'}
            </button>
          </form>
        </div>

        {/* Enrollments List */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>Current Enrollments ({enrollments.length})</h3>
          {enrollments.length === 0 ? (
            <p style={{ color: '#666' }}>No enrollments yet.</p>
          ) : (
            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ position: 'sticky', top: 0, background: '#25364a', color: 'white' }}>
                  <tr>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Student</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Course</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {enrollments.map(enrollment => (
                    <tr key={enrollment.enrollmentId} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '10px' }}>
                        {enrollment.student.user.fname} {enrollment.student.user.lname}
                      </td>
                      <td style={{ padding: '10px' }}>
                        {enrollment.course.courseName}
                      </td>
                      <td style={{ padding: '10px' }}>
                        <button
                          onClick={() => handleDeleteEnrollment(enrollment.enrollmentId)}
                          style={{
                            padding: '5px 10px',
                            background: '#f44336',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '13px'
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
