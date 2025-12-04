import React, { useState, useEffect } from 'react';
import '../css/MyClasses.css';

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
    setAttendanceRecords({});
    setSuccess('');
    fetchEnrolledStudents(course.courseId);
  };

  const handleBackToCourses = () => {
    setSelectedCourse(null);
    setStudents([]);
    setAttendanceRecords({});
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

  return (
    <div className="my-classes-container">
      <div className="my-classes-header">
        <h1 className="my-classes-title">📚 My Classes & Attendance</h1>
        <p className="my-classes-subtitle">Manage your courses and track student attendance</p>
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
                  Click on a course to view enrolled students and mark attendance
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

      {/* Student List & Attendance View */}
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
            <div className="date-selector-inline">
              <label className="date-label">📅 Date:</label>
              <input
                type="date"
                value={attendanceDate}
                onChange={(e) => handleDateChange(e.target.value)}
                className="date-input"
              />
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
                There are no students enrolled in this course yet. Please enroll students from the Admin Dashboard.
              </p>
            </div>
          ) : (
            <>
              <div className="students-header">
                <h2 className="students-title">Enrolled Students</h2>
                <span className="students-count">{students.length} Students</span>
              </div>
              
              <div className="attendance-table-wrapper">
                <table className="attendance-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Student Name</th>
                      <th>Email</th>
                      <th>Year & Section</th>
                      <th>Status</th>
                      <th>Time In</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student, index) => {
                      const record = attendanceRecords[student.studentId] || {};
                      return (
                        <tr key={student.studentId}>
                          <td className="student-number">{index + 1}</td>
                          <td className="student-name">{student.studentName}</td>
                          <td className="student-email">{student.email}</td>
                          <td className="year-section">
                            Year {student.yearLevel} - {student.section}
                          </td>
                          <td>
                            <select
                              value={record.status || ''}
                              onChange={(e) => handleStatusChange(student.studentId, e.target.value)}
                              className="status-select"
                            >
                              <option value="">Select Status...</option>
                              <option value="PRESENT">✓ Present</option>
                              <option value="LATE">⏰ Late</option>
                              <option value="ABSENT">✗ Absent</option>
                              <option value="EXCUSED">📝 Excused</option>
                            </select>
                          </td>
                          <td>
                            <input
                              type="time"
                              value={record.timeIn || ''}
                              onChange={(e) => handleTimeInChange(student.studentId, e.target.value)}
                              disabled={!record.status || record.status === 'ABSENT'}
                              className="time-input"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={record.remarks || ''}
                              onChange={(e) => handleRemarksChange(student.studentId, e.target.value)}
                              placeholder="Optional notes..."
                              className="remarks-input"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="attendance-actions">
                <button
                  onClick={handleSubmitAttendance}
                  disabled={loading || Object.keys(attendanceRecords).length === 0}
                  className="submit-button"
                >
                  {loading ? '⏳ Saving...' : '💾 Save Attendance'}
                </button>
                {Object.keys(attendanceRecords).length > 0 && (
                  <span className="marked-count">
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