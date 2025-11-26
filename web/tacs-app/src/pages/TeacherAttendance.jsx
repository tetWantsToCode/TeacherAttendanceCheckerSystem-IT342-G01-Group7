import React, { useState, useEffect } from 'react';

export default function TeacherAttendance() {
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
    // Get teacher ID from auth
    const authData = JSON.parse(localStorage.getItem('auth'));
    if (authData && authData.email) {
      fetchTeacherId(authData.email);
    }
  }, []);

  const fetchTeacherId = async (email) => {
    try {
      // First get user info to find teacher ID
      const authData = JSON.parse(localStorage.getItem('auth'));
      const token = authData?.token;

      const response = await fetch('http://localhost:8080/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const userData = await response.json();
        // For now, use email as teacher ID (you may need to adjust based on your setup)
        // Or create an endpoint to get teacher by user email
        fetchTeacherCourses(userData.userId);
        setTeacherId(userData.userId);
      }
    } catch (err) {
      setError('Error loading teacher information');
    }
  };

  const fetchTeacherCourses = async (tId) => {
    setLoading(true);
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
        setError('No courses found');
      }
    } catch (err) {
      setError('Error loading courses');
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
        // Fetch existing attendance for selected date
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
    fetchEnrolledStudents(course.courseId);
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
      <h2>Mark Attendance</h2>

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

      {/* Course Selection */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Select Course</h3>
        {loading && !selectedCourse ? (
          <p>Loading courses...</p>
        ) : courses.length === 0 ? (
          <p>No courses assigned. Please contact administrator.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' }}>
            {courses.map(course => (
              <div
                key={course.courseId}
                onClick={() => handleCourseSelect(course)}
                style={{
                  padding: '15px',
                  border: selectedCourse?.courseId === course.courseId ? '2px solid #25364a' : '1px solid #ddd',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  background: selectedCourse?.courseId === course.courseId ? '#e8f4f8' : 'white',
                  transition: 'all 0.2s'
                }}
              >
                <h4 style={{ margin: '0 0 10px 0', color: '#25364a' }}>{course.courseName}</h4>
                <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>{course.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Date Selection and Student List */}
      {selectedCourse && (
        <>
          <div style={{ marginBottom: '20px', background: '#f7f9fb', padding: '15px', borderRadius: '8px' }}>
            <h3>Selected: {selectedCourse.courseName}</h3>
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
            <p>No students enrolled in this course.</p>
          ) : (
            <>
              <div style={{ marginBottom: '15px' }}>
                <h3>Students ({students.length})</h3>
              </div>
              
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                  <thead>
                    <tr style={{ background: '#25364a', color: 'white' }}>
                      <th style={{ padding: '12px', textAlign: 'left' }}>#</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Student Name</th>
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
                          <td style={{ padding: '12px' }}>{student.studentName}</td>
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
                                cursor: 'pointer'
                              }}
                            >
                              <option value="">Select...</option>
                              <option value="PRESENT">Present</option>
                              <option value="LATE">Late</option>
                              <option value="ABSENT">Absent</option>
                              <option value="EXCUSED">Excused</option>
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
                                width: '200px'
                              }}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
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
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
