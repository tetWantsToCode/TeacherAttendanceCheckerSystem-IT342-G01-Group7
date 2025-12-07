import React, { useState, useEffect } from 'react';
import '../css/MyClasses.css';
import { api } from '../utils/api-utils';

export default function MyClasses() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [teacherId, setTeacherId] = useState(null);
  const [showManageStudents, setShowManageStudents] = useState(false);
  const [allStudents, setAllStudents] = useState([]);
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    const authData = JSON.parse(localStorage.getItem('auth'));
    if (authData && authData.teacherId) {
      setTeacherId(authData.teacherId);
      fetchTeacherCourses(authData.teacherId);
    } else {
      setError('Teacher ID not found. Please log in again.');
    }
  }, []);

  const fetchTeacherCourses = async (tId) => {
    setLoading(true);
    setError('');
    
    try {
      const authData = JSON.parse(localStorage.getItem('auth'));
      const token = authData?.token;

      const response = await fetch(`http://localhost:8080/api/attendance/teacher/${tId}/courses`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      } else {
        setError('Failed to fetch your courses.');
      }
    } catch (err) {
      setError('Error loading courses: ' + err.message);
      console.error('Error fetching teacher courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrolledStudents = async (courseId) => {
    setLoading(true);
    setError('');
    try {
      const authData = JSON.parse(localStorage.getItem('auth'));
      const token = authData?.token;

      const response = await fetch(`http://localhost:8080/api/attendance/course/${courseId}/students`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      } else {
        setError('No students enrolled in this course');
        setStudents([]);
      }
    } catch (err) {
      setError('Error loading students');
    } finally {
      setLoading(false);
    }
  };

  const fetchExistingAttendance = async (courseId, date) => {
    try {
      const authData = JSON.parse(localStorage.getItem('auth'));
      const token = authData?.token;

      const response = await fetch(`http://localhost:8080/api/attendance/course/${courseId}/date/${date}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const records = {};
        data.forEach(record => {
          records[record.studentId] = {
            status: record.status,
            remarks: record.remarks || '',
            timeIn: record.timeIn || ''
          };
        });
        setAttendanceRecords(records);
      }
    } catch (err) {
      console.error('Error loading existing attendance:', err);
    }
  };

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    setSuccess('');
    fetchEnrolledStudents(course.courseId);
  };

  const handleBackToCourses = () => {
    setSelectedCourse(null);
    setStudents([]);
    setSuccess('');
    setError('');
  };

  const handleStatusChange = (studentId, status) => {
    setAttendanceRecords(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status: status,
        timeIn: status === 'PRESENT' || status === 'LATE' ? new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }) : ''
      }
    }));
  };

  const handleRemarksChange = (studentId, remarks) => {
    setAttendanceRecords(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks: remarks
      }
    }));
  };

  const handleTimeInChange = (studentId, timeIn) => {
    setAttendanceRecords(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        timeIn: timeIn
      }
    }));
  };

  const handleDateChange = (newDate) => {
    setAttendanceDate(newDate);
    if (selectedCourse) {
      fetchExistingAttendance(selectedCourse.courseId, newDate);
    }
  };

  const handleSubmitAttendance = async () => {
    if (!selectedCourse) {
      setError('Please select a course first');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const authData = JSON.parse(localStorage.getItem('auth'));
      const token = authData?.token;

      const promises = students.map(student => {
        const record = attendanceRecords[student.studentId];
        if (record && record.status) {
          return fetch('http://localhost:8080/api/attendance/mark', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              studentId: student.studentId,
              courseId: selectedCourse.courseId,
              date: attendanceDate,
              status: record.status,
              remarks: record.remarks || '',
              timeIn: record.timeIn || null
            })
          });
        }
        return null;
      }).filter(p => p !== null);

      await Promise.all(promises);
      setSuccess('Attendance saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Error saving attendance: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllStudents = async () => {
    const result = await api.get('/students');
    if (result.success) {
      setAllStudents(result.data);
    }
  };

  const fetchEnrollments = async (courseId) => {
    const result = await api.get(`/enrollments/course/${courseId}`);
    if (result.success) {
      setEnrollments(result.data);
    }
  };

  const handleManageStudents = async () => {
    setShowManageStudents(true);
    await fetchAllStudents();
    await fetchEnrollments(selectedCourse.courseId);
  };

  const handleAddStudent = async (studentId) => {
    setError('');
    setSuccess('');
    
    const result = await api.post('/enrollments', {
      studentId: studentId,
      courseId: selectedCourse.courseId,
      enrollmentDate: new Date().toISOString().split('T')[0],
      status: 'ACTIVE'
    });

    if (result.success) {
      setSuccess('Student added successfully!');
      await fetchEnrollments(selectedCourse.courseId);
      await fetchEnrolledStudents(selectedCourse.courseId);
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError(result.error || 'Failed to add student');
    }
  };

  const handleRemoveStudent = async (enrollmentId) => {
    setError('');
    setSuccess('');
    
    if (!confirm('Are you sure you want to remove this student from the course?')) {
      return;
    }

    const result = await api.delete(`/enrollments/${enrollmentId}`);

    if (result.success) {
      setSuccess('Student removed successfully!');
      await fetchEnrollments(selectedCourse.courseId);
      await fetchEnrolledStudents(selectedCourse.courseId);
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError(result.error || 'Failed to remove student');
    }
  };

  return (
    <div className="my-classes-container">
      <div className="my-classes-header">
        <h1 className="my-classes-title">📚 My Classes</h1>
        <p className="my-classes-subtitle">View and manage your course rosters</p>
      </div>

      {error && (
        <div className="my-classes-alert my-classes-alert-error">
          <span>⚠️</span>
          {error}
        </div>
      )}

      {success && (
        <div className="my-classes-alert my-classes-alert-success">
          <span>✓</span>
          {success}
        </div>
      )}

      {/* Course Selection View */}
      {!selectedCourse && (
        <div>
          {loading ? (
            <div className="loading-message">
              <div className="loading-spinner"></div>
              <p>Loading courses...</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="empty-state">
              <h3 className="empty-state-title">No Courses Assigned</h3>
              <p className="empty-state-text">
                No courses have been assigned to you yet.<br />
                Please contact your administrator to assign courses.
              </p>
            </div>
          ) : (
            <>
              <div className="section-header">
                <h2 className="section-title">Your Courses</h2>
                <p className="section-subtitle">
                  Click on a course to view enrolled students and manage class roster
                </p>
              </div>
              <div className="course-grid">
                {courses.map(course => (
                  <div
                    key={course.courseId}
                    onClick={() => handleCourseSelect(course)}
                    className="course-card"
                  >
                    <h3 className="course-card-title">{course.courseName}</h3>
                    <p className="course-card-description">{course.description}</p>
                    <div className="course-card-id">
                      <strong>Course ID:</strong> {course.courseId}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Student List View */}
      {selectedCourse && (
        <div>
          <button
            onClick={handleBackToCourses}
            className="back-button"
          >
            <span>←</span> Back to Courses
          </button>

          <div className="course-info-bar">
            <div className="course-info-details">
              <h2 className="course-info-name">{selectedCourse.courseName}</h2>
              <p className="course-info-description">{selectedCourse.description}</p>
            </div>
          </div>

          {loading ? (
            <div className="loading-message">
              <div className="loading-spinner"></div>
              <p>Loading students...</p>
            </div>
          ) : students.length === 0 ? (
            <div className="warning-state">
              <h3 className="warning-state-title">No Students Enrolled</h3>
              <p className="warning-state-text">
                There are no students enrolled in this course yet.
              </p>
              <button
                onClick={handleManageStudents}
                style={{
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '500',
                  marginTop: '1rem'
                }}
              >
                ➕ Add Students to Course
              </button>
            </div>
          ) : (
            <>
              <div className="students-header">
                <h2 className="students-title">Enrolled Students</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span className="students-count">{students.length} Students</span>
                  <button
                    onClick={handleManageStudents}
                    style={{
                      background: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: '500'
                    }}
                  >
                    ➕ Manage Students
                  </button>
                </div>
              </div>
              
              <div className="attendance-table-wrapper">
                <table className="attendance-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Student Name</th>
                      <th>Email</th>
                      <th>Program</th>
                      <th>Year Level</th>
                      <th>Student ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student, index) => (
                      <tr key={student.studentId}>
                        <td className="student-number">{index + 1}</td>
                        <td className="student-name">{student.studentName}</td>
                        <td className="student-email">{student.email}</td>
                        <td style={{ padding: '12px', color: '#6366f1', fontWeight: '500' }}>
                          {student.program || 'N/A'}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          Year {student.yearLevel}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          {student.studentNumber || 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}

      {/* Manage Students Modal */}
      {showManageStudents && (
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
            borderRadius: '12px',
            padding: '2rem',
            maxWidth: '800px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0, color: '#1f2937' }}>Manage Students - {selectedCourse?.courseName}</h2>
              <button
                onClick={() => setShowManageStudents(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                ✕
              </button>
            </div>

            {/* Enrolled Students Section */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#059669', marginBottom: '1rem' }}>✓ Currently Enrolled ({enrollments.length})</h3>
              {enrollments.length === 0 ? (
                <p style={{ color: '#6b7280', fontStyle: 'italic' }}>No students enrolled yet</p>
              ) : (
                <div style={{ maxHeight: '200px', overflow: 'auto', border: '1px solid #e5e7eb', borderRadius: '6px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: '#f9fafb', position: 'sticky', top: 0 }}>
                      <tr>
                        <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Name</th>
                        <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Year & Section</th>
                        <th style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {enrollments.map(enrollment => (
                        <tr key={enrollment.enrollmentId} style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td style={{ padding: '0.75rem' }}>
                            {enrollment.student?.user?.fname} {enrollment.student?.user?.lname}
                          </td>
                          <td style={{ padding: '0.75rem', color: '#6b7280' }}>
                            Year {enrollment.student?.yearLevel} - {enrollment.student?.section || 'N/A'}
                          </td>
                          <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                            <button
                              onClick={() => handleRemoveStudent(enrollment.enrollmentId)}
                              style={{
                                background: '#ef4444',
                                color: 'white',
                                border: 'none',
                                padding: '0.4rem 0.8rem',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '0.85rem'
                              }}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Available Students Section */}
            <div>
              <h3 style={{ color: '#3b82f6', marginBottom: '1rem' }}>➕ Available Students</h3>
              {allStudents.filter(student => 
                !enrollments.some(e => e.student?.studentId === student.studentId)
              ).length === 0 ? (
                <p style={{ color: '#6b7280', fontStyle: 'italic' }}>All students are already enrolled</p>
              ) : (
                <div style={{ maxHeight: '200px', overflow: 'auto', border: '1px solid #e5e7eb', borderRadius: '6px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: '#f9fafb', position: 'sticky', top: 0 }}>
                      <tr>
                        <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Name</th>
                        <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Year & Section</th>
                        <th style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allStudents
                        .filter(student => !enrollments.some(e => e.student?.studentId === student.studentId))
                        .map(student => (
                          <tr key={student.studentId} style={{ borderBottom: '1px solid #f3f4f6' }}>
                            <td style={{ padding: '0.75rem' }}>
                              {student.user?.fname} {student.user?.lname}
                            </td>
                            <td style={{ padding: '0.75rem', color: '#6b7280' }}>
                              Year {student.yearLevel} - {student.section || 'N/A'}
                            </td>
                            <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                              <button
                                onClick={() => handleAddStudent(student.studentId)}
                                style={{
                                  background: '#10b981',
                                  color: 'white',
                                  border: 'none',
                                  padding: '0.4rem 0.8rem',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  fontSize: '0.85rem'
                                }}
                              >
                                Add
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
      )}
    </div>
  );
}