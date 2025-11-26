import React, { useState, useEffect } from 'react';

export default function MyClasses() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [teacherId, setTeacherId] = useState(null);

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
        fetchExistingAttendance(courseId, attendanceDate);
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
            remarks: record.remarks || ''
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
    setAttendanceRecords({});
    setSuccess('');
    fetchEnrolledStudents(course.courseId);
  };

  const handleBackToCourses = () => {
    setSelectedCourse(null);
    setStudents([]);
    setAttendanceRecords({});
    setSuccess('');
  };

  const handleStatusChange = (studentId, status) => {
    setAttendanceRecords(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status: status
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
              remarks: record.remarks || ''
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

  return (
    <div style={{ padding: '20px' }}>
      <h2>My Classes & Attendance</h2>

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

      {/* Course Selection View */}
      {!selectedCourse && (
        <div>
          {loading ? (
            <p>Loading courses...</p>
          ) : courses.length === 0 ? (
            <div style={{ 
              background: '#f5f5f5', 
              padding: '20px', 
              borderRadius: '8px', 
              textAlign: 'center',
              color: '#666'
            }}>
              <p>No courses assigned to you yet.</p>
              <p style={{ fontSize: '14px' }}>Please contact your administrator to assign courses to you.</p>
            </div>
          ) : (
            <>
              <p style={{ color: '#666', marginBottom: '15px' }}>
                Click on a course to view enrolled students and mark attendance
              </p>
              <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                {courses.map(course => (
                  <div
                    key={course.courseId}
                    onClick={() => handleCourseSelect(course)}
                    style={{
                      background: 'white',
                      padding: '20px',
                      borderRadius: '8px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      border: '1px solid #e0e0e0',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <h3 style={{ 
                      margin: '0 0 10px 0', 
                      color: '#25364a',
                      fontSize: '18px'
                    }}>
                      {course.courseName}
                    </h3>
                    <p style={{ 
                      color: '#666', 
                      fontSize: '14px',
                      margin: '0 0 15px 0',
                      lineHeight: '1.5'
                    }}>
                      {course.description}
                    </p>
                    <div style={{ 
                      paddingTop: '15px', 
                      borderTop: '1px solid #eee',
                      fontSize: '13px',
                      color: '#888'
                    }}>
                      <p style={{ margin: '0' }}>
                        <strong>Course ID:</strong> {course.courseId}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Student List & Attendance View */}
      {selectedCourse && (
        <div>
          <div style={{ marginBottom: '20px' }}>
            <button
              onClick={handleBackToCourses}
              style={{
                padding: '8px 16px',
                background: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                marginBottom: '15px'
              }}
            >
              ← Back to Courses
            </button>
          </div>

          <div style={{ marginBottom: '20px', background: '#f7f9fb', padding: '15px', borderRadius: '8px' }}>
            <h3 style={{ margin: '0 0 10px 0' }}>{selectedCourse.courseName}</h3>
            <p style={{ color: '#666', fontSize: '14px', margin: '0 0 15px 0' }}>{selectedCourse.description}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <label style={{ fontWeight: 'bold' }}>Date:</label>
              <input
                type="date"
                value={attendanceDate}
                onChange={(e) => handleDateChange(e.target.value)}
                style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
              />
            </div>
          </div>

          {loading ? (
            <p>Loading students...</p>
          ) : students.length === 0 ? (
            <div style={{ 
              background: '#fff3cd', 
              color: '#856404',
              padding: '15px', 
              borderRadius: '6px',
              border: '1px solid #ffeaa7'
            }}>
              <strong>No students enrolled</strong>
              <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>
                Please enroll students in this course from the Admin Dashboard.
              </p>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: '15px' }}>
                <h3>Enrolled Students ({students.length})</h3>
              </div>
              
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                  <thead>
                    <tr style={{ background: '#25364a', color: 'white' }}>
                      <th style={{ padding: '12px', textAlign: 'left' }}>#</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Student Name</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Year & Section</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student, index) => {
                      const record = attendanceRecords[student.studentId] || {};
                      return (
                        <tr key={student.studentId} style={{ borderBottom: '1px solid #eee' }}>
                          <td style={{ padding: '12px' }}>{index + 1}</td>
                          <td style={{ padding: '12px', fontWeight: '500' }}>{student.studentName}</td>
                          <td style={{ padding: '12px', fontSize: '13px', color: '#666' }}>{student.email}</td>
                          <td style={{ padding: '12px' }}>
                            Year {student.yearLevel} - {student.section}
                          </td>
                          <td style={{ padding: '12px' }}>
                            <select
                              value={record.status || ''}
                              onChange={(e) => handleStatusChange(student.studentId, e.target.value)}
                              style={{
                                padding: '6px 10px',
                                borderRadius: '4px',
                                border: '1px solid #ccc',
                                background: 'white',
                                cursor: 'pointer',
                                fontSize: '14px'
                              }}
                            >
                              <option value="">Select...</option>
                              <option value="PRESENT">✓ Present</option>
                              <option value="LATE">⏰ Late</option>
                              <option value="ABSENT">✗ Absent</option>
                              <option value="EXCUSED">📝 Excused</option>
                            </select>
                          </td>
                          <td style={{ padding: '12px' }}>
                            <input
                              type="text"
                              value={record.remarks || ''}
                              onChange={(e) => handleRemarksChange(student.studentId, e.target.value)}
                              placeholder="Optional notes..."
                              style={{
                                padding: '6px 10px',
                                borderRadius: '4px',
                                border: '1px solid #ccc',
                                width: '200px',
                                fontSize: '14px'
                              }}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div style={{ marginTop: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button
                  onClick={handleSubmitAttendance}
                  disabled={loading || Object.keys(attendanceRecords).length === 0}
                  style={{
                    padding: '12px 30px',
                    background: loading ? '#ccc' : '#25364a',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold',
                    fontSize: '16px'
                  }}
                >
                  {loading ? 'Saving...' : 'Save Attendance'}
                </button>
                {Object.keys(attendanceRecords).length > 0 && (
                  <span style={{ color: '#666', fontSize: '14px' }}>
                    {Object.keys(attendanceRecords).length} student(s) marked
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
