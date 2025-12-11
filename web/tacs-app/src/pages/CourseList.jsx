import React, { useState, useEffect } from 'react';

export default function CourseList({ refreshKey }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingCourse, setEditingCourse] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name'); // name, code, units, type
  const [filterStatus, setFilterStatus] = useState('all'); // all, active, inactive

  useEffect(() => {
    fetchCourses();
    fetchTeachers();
  }, [refreshKey]);

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
        <>
          {/* Search, Sort, and Filter Controls */}
          <div style={{ marginBottom: '20px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '10px' }}>
            <input
              type="text"
              placeholder="Search by course name, code..."
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
              <option value="name">Sort: Course Name</option>
              <option value="code">Sort: Course Code</option>
              <option value="units">Sort: Units</option>
              <option value="type">Sort: Type</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #ccc',
                fontSize: '14px'
              }}
            >
              <option value="all">All Courses</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
          
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#ffffff', boxShadow: '0 2px 6px rgba(0,0,0,0.08)', borderRadius: '8px', overflow: 'hidden' }}>
            <thead>
              <tr style={{ background: '#3F72AF', color: 'white' }}>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: '600', width: '10%' }}>Code</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: '600', width: '30%' }}>Name</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: '600', width: '10%' }}>Units</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: '600', width: '15%' }}>Type</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: '600', width: '10%' }}>Status</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: '600', width: '25%' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses
                .filter(course => {
                  const search = searchTerm.toLowerCase();
                  const matchesSearch = course.courseName?.toLowerCase().includes(search) ||
                                       course.courseCode?.toLowerCase().includes(search);
                  const matchesStatus = filterStatus === 'all' ||
                                       (filterStatus === 'active' && course.isActive) ||
                                       (filterStatus === 'inactive' && !course.isActive);
                  return matchesSearch && matchesStatus;
                })
                .sort((a, b) => {
                  if (sortBy === 'name') {
                    return (a.courseName || '').localeCompare(b.courseName || '');
                  } else if (sortBy === 'code') {
                    return (a.courseCode || '').localeCompare(b.courseCode || '');
                  } else if (sortBy === 'units') {
                    return (a.units || 0) - (b.units || 0);
                  } else {
                    return (a.courseType || '').localeCompare(b.courseType || '');
                  }
                })
                .map(course => (
                <tr key={course.courseId} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '14px 16px', verticalAlign: 'middle', width: '10%' }}>{course.courseCode || 'N/A'}</td>
                  <td style={{ padding: '14px 16px', verticalAlign: 'middle', width: '30%' }}>{course.courseName}</td>
                  <td style={{ padding: '14px 16px', verticalAlign: 'middle', width: '10%' }}>{course.units || 'N/A'}</td>
                  <td style={{ padding: '14px 16px', verticalAlign: 'middle', width: '15%' }}>{course.courseType || 'N/A'}</td>
                  <td style={{ padding: '14px 16px', verticalAlign: 'middle', width: '10%' }}>{course.isActive ? 'Active' : 'Inactive'}</td>
                  <td style={{ padding: '14px 16px', verticalAlign: 'middle', width: '25%' }}>
                    <button
                      onClick={() => handleEdit(course)}
                      style={{
                        padding: '8px 16px',
                        background: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        marginRight: '8px',
                        fontWeight: '500',
                        fontSize: '14px'
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(course.courseId)}
                      style={{
                        padding: '8px 16px',
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: '500',
                        fontSize: '14px'
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
        </>
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
