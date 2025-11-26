import React, { useState, useEffect } from 'react';

export default function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingCourse, setEditingCourse] = useState(null);
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    fetchCourses();
    fetchTeachers();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
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
      } else {
        setError('Failed to fetch courses');
      }
    } catch (err) {
      setError('Error loading courses');
    } finally {
      setLoading(false);
    }
  };

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
        setTeachers(data);
      }
    } catch (err) {
      console.error('Error fetching teachers:', err);
    }
  };

  const handleDelete = async (courseId) => {
    if (!confirm('Are you sure you want to delete this course?')) return;

    try {
      const authData = JSON.parse(localStorage.getItem('auth'));
      const token = authData?.token;

      const response = await fetch(`http://localhost:8080/api/courses/${courseId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        fetchCourses();
      } else {
        alert('Failed to delete course');
      }
    } catch (err) {
      alert('Error deleting course');
    }
  };

  const handleEdit = (course) => {
    setEditingCourse({
      courseId: course.courseId,
      teacherId: course.teacherId,
      courseName: course.courseName,
      description: course.description
    });
  };

  const handleUpdate = async () => {
    try {
      const authData = JSON.parse(localStorage.getItem('auth'));
      const token = authData?.token;

      const response = await fetch(`http://localhost:8080/api/courses/${editingCourse.courseId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          teacherId: editingCourse.teacherId,
          courseName: editingCourse.courseName,
          description: editingCourse.description
        })
      });

      if (response.ok) {
        setEditingCourse(null);
        fetchCourses();
      } else {
        alert('Failed to update course');
      }
    } catch (err) {
      alert('Error updating course');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Course Management</h2>

      {error && (
        <div style={{ background: '#fee', color: '#c33', padding: '10px', borderRadius: '6px', marginBottom: '15px' }}>
          {error}
        </div>
      )}

      {loading ? (
        <p>Loading courses...</p>
      ) : courses.length === 0 ? (
        <p>No courses available. Create your first course!</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <thead>
              <tr style={{ background: '#25364a', color: 'white' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Course Name</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Description</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Teacher</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map(course => (
                <tr key={course.courseId} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px' }}>{course.courseName}</td>
                  <td style={{ padding: '12px' }}>{course.description}</td>
                  <td style={{ padding: '12px' }}>{course.teacherName}</td>
                  <td style={{ padding: '12px' }}>
                    <button
                      onClick={() => handleEdit(course)}
                      style={{
                        padding: '6px 12px',
                        background: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginRight: '8px'
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(course.courseId)}
                      style={{
                        padding: '6px 12px',
                        background: '#f44336',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
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

      {/* Edit Modal */}
      {editingCourse && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '8px',
            maxWidth: '500px',
            width: '90%'
          }}>
            <h3>Edit Course</h3>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Assign Teacher
              </label>
              <select
                value={editingCourse.teacherId}
                onChange={(e) => setEditingCourse({...editingCourse, teacherId: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid #ccc'
                }}
              >
                {teachers.map(teacher => (
                  <option key={teacher.teacherId} value={teacher.teacherId}>
                    {teacher.user.fname} {teacher.user.lname}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Course Name
              </label>
              <input
                type="text"
                value={editingCourse.courseName}
                onChange={(e) => setEditingCourse({...editingCourse, courseName: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid #ccc'
                }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Description
              </label>
              <textarea
                value={editingCourse.description}
                onChange={(e) => setEditingCourse({...editingCourse, description: e.target.value})}
                rows="4"
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid #ccc'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setEditingCourse(null)}
                style={{
                  padding: '10px 20px',
                  background: '#ccc',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                style={{
                  padding: '10px 20px',
                  background: '#25364a',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
