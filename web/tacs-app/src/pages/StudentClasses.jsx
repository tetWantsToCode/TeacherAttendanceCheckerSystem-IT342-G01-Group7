import React, { useState, useEffect } from 'react';
import '../css/StudentClasses.css';

export default function StudentClasses() {
  const [enrollments, setEnrollments] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    fetchMyEnrollments();
  }, []);

  const fetchMyEnrollments = async () => {
    setLoading(true);
    setError('');
    
    try {
      const authData = JSON.parse(localStorage.getItem('auth'));
      const token = authData?.token;
      const studentId = authData?.studentId;

      if (!studentId) {
        setError('Student ID not found. Please log in again.');
        setLoading(false);
        return;
      }

      const response = await fetch(`http://localhost:8080/api/enrollments/student/${studentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setEnrollments(data);
      } else {
        setError('Failed to fetch your enrollments.');
      }
    } catch (err) {
      setError('Error loading classes: ' + err.message);
      console.error('Error fetching student enrollments:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendanceForCourse = async (courseId) => {
    setLoading(true);
    try {
      const authData = JSON.parse(localStorage.getItem('auth'));
      const token = authData?.token;
      const studentId = authData?.studentId;

      const response = await fetch(`http://localhost:8080/api/attendance/student/${studentId}/course/${courseId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAttendanceRecords(data);
      } else {
        setAttendanceRecords([]);
      }
    } catch (err) {
      console.error('Error fetching attendance:', err);
      setAttendanceRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseClick = (enrollment) => {
    setSelectedCourse(enrollment);
    fetchAttendanceForCourse(enrollment.course.courseId);
  };

  const handleBackToClasses = () => {
    setSelectedCourse(null);
    setAttendanceRecords([]);
  };

  const getStatusColor = (status) => {
    switch(status?.toUpperCase()) {
      case 'ACTIVE': return '#4CAF50';
      case 'DROPPED': return '#f44336';
      case 'COMPLETED': return '#2196F3';
      default: return '#999';
    }
  };

  const getAttendanceStatusConfig = (status) => {
    switch(status?.toUpperCase()) {
      case 'PRESENT':
        return { color: '#4CAF50', bg: '#e8f5e9', label: 'Present' };
      case 'LATE':
        return { color: '#FF9800', bg: '#fff3e0', label: 'Late' };
      case 'ABSENT':
        return { color: '#f44336', bg: '#ffebee', label: 'Absent' };
      case 'EXCUSED':
        return { color: '#2196F3', bg: '#e3f2fd', label: 'Excused' };
      default:
        return { color: '#999', bg: '#f5f5f5', label: 'Unknown' };
    }
  };

  // Calendar functions
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const getAttendanceForDate = (date) => {
    return attendanceRecords.find(record => {
      const recordDate = new Date(record.date);
      return recordDate.toDateString() === date.toDateString();
    });
  };

  const changeMonth = (direction) => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);
    const days = [];
    const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="student-calendar-day-empty"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const attendance = getAttendanceForDate(date);
      const isToday = date.toDateString() === new Date().toDateString();
      const config = attendance ? getAttendanceStatusConfig(attendance.status) : null;

      days.push(
        <div
          key={day}
          className={`student-calendar-day ${isToday ? 'student-calendar-day-today' : ''}`}
          style={{ background: config ? config.bg : 'white' }}
        >
          <div className={`student-calendar-day-number ${isToday ? 'today' : ''}`} style={{ color: config ? config.color : '#666' }}>
            <span>{day}</span>
            {isToday && (
              <span className="student-calendar-today-badge">
                TODAY
              </span>
            )}
          </div>
          {attendance && (
            <div className="student-calendar-attendance">
              <div className="student-calendar-status" style={{ color: config.color }}>
                {config.label}
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="student-calendar-wrapper">
        {/* Calendar Header */}
        <div className="student-calendar-header">
          <button
            onClick={() => changeMonth(-1)}
            className="student-calendar-nav-button"
          >
            ← Previous
          </button>
          <h3 className="student-calendar-month">{monthName}</h3>
          <button
            onClick={() => changeMonth(1)}
            className="student-calendar-nav-button"
          >
            Next →
          </button>
        </div>

        {/* Day names */}
        <div className="student-calendar-day-names">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="student-calendar-day-name">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="student-calendar-grid">
          {days}
        </div>

        {/* Legend */}
        <div className="student-calendar-legend">
          <div className="student-legend-item">
            <div className="student-legend-color" style={{ background: '#e8f5e9', border: '2px solid #4CAF50' }}></div>
            <span className="student-legend-label">Present</span>
          </div>
          <div className="student-legend-item">
            <div className="student-legend-color" style={{ background: '#fff3e0', border: '2px solid #FF9800' }}></div>
            <span className="student-legend-label">Late</span>
          </div>
          <div className="student-legend-item">
            <div className="student-legend-color" style={{ background: '#ffebee', border: '2px solid #f44336' }}></div>
            <span className="student-legend-label">Absent</span>
          </div>
          <div className="student-legend-item">
            <div className="student-legend-color" style={{ background: '#e3f2fd', border: '2px solid #2196F3' }}></div>
            <span className="student-legend-label">Excused</span>
          </div>
        </div>
      </div>
    );
  };

  const calculateAttendanceStats = () => {
    const total = attendanceRecords.length;
    const present = attendanceRecords.filter(r => r.status === 'PRESENT').length;
    const late = attendanceRecords.filter(r => r.status === 'LATE').length;
    const absent = attendanceRecords.filter(r => r.status === 'ABSENT').length;
    const excused = attendanceRecords.filter(r => r.status === 'EXCUSED').length;
    const attendanceRate = total > 0 ? ((present + late) / total * 100).toFixed(1) : 0;
    
    return { total, present, late, absent, excused, attendanceRate };
  };

  return (
    <div className="student-classes-container">
      <h2>{selectedCourse ? 'Attendance' : 'My Classes'}</h2>

      {error && (
        <div className="student-classes-error">
          {error}
        </div>
      )}

      {/* Course List View */}
      {!selectedCourse && (
        <>
          {loading ? (
            <p>Loading your classes...</p>
          ) : enrollments.length === 0 ? (
            <div className="student-classes-empty">
              <p>You are not enrolled in any courses yet.</p>
              <p>Please contact your administrator for enrollment.</p>
            </div>
          ) : (
            <>
              <p className="student-classes-info">
                Click on a course to view your attendance records
              </p>
              <div className="student-classes-grid">
                {enrollments.map(enrollment => (
                  <div
                    key={enrollment.enrollmentId}
                    onClick={() => handleCourseClick(enrollment)}
                    className="student-course-card"
                  >
                    <div 
                      className="student-course-status"
                      style={{ background: getStatusColor(enrollment.status) }}
                    >
                      {enrollment.status}
                    </div>
                    
                    <h3>
                      {enrollment.course.courseName}
                    </h3>
                    
                    <p className="student-course-description">
                      {enrollment.course.description}
                    </p>
                    
                    <div className="student-course-info">
                      <p>
                        <strong>Teacher:</strong> {enrollment.course.teacher.user.fname} {enrollment.course.teacher.user.lname}
                      </p>
                      <p>
                        <strong>Course ID:</strong> {enrollment.course.courseId}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* Attendance Records View */}
      {selectedCourse && (
        <div>
          <button
            onClick={handleBackToClasses}
            className="student-back-button"
          >
            ← Back to Classes
          </button>

          <div className="student-course-header">
            <h3>{selectedCourse.course.courseName}</h3>
            <p>
              <strong>Teacher:</strong> {selectedCourse.course.teacher.user.fname} {selectedCourse.course.teacher.user.lname}
            </p>
          </div>

          {loading ? (
            <p>Loading attendance records...</p>
          ) : attendanceRecords.length === 0 ? (
            <div className="student-no-attendance">
              <p>No attendance records yet</p>
              <p>Your teacher hasn't marked attendance for this course.</p>
            </div>
          ) : (
            <>
              {/* Attendance Statistics */}
              <div className="student-stats-container">
                <div className="student-stat-card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                  <div className="student-stat-number">
                    {calculateAttendanceStats().attendanceRate}%
                  </div>
                  <div className="student-stat-label">Attendance Rate</div>
                </div>

                <div className="student-stat-card" style={{ background: '#4CAF50' }}>
                  <div className="student-stat-number">
                    {calculateAttendanceStats().present}
                  </div>
                  <div className="student-stat-label">Present</div>
                </div>

                <div className="student-stat-card" style={{ background: '#FF9800' }}>
                  <div className="student-stat-number">
                    {calculateAttendanceStats().late}
                  </div>
                  <div className="student-stat-label">Late</div>
                </div>

                <div className="student-stat-card" style={{ background: '#f44336' }}>
                  <div className="student-stat-number">
                    {calculateAttendanceStats().absent}
                  </div>
                  <div className="student-stat-label">Absent</div>
                </div>

                <div className="student-stat-card" style={{ background: '#2196F3' }}>
                  <div className="student-stat-number">
                    {calculateAttendanceStats().excused}
                  </div>
                  <div className="student-stat-label">Excused</div>
                </div>
              </div>

              {/* Attendance Calendar */}
              <h3 className="student-calendar-title">Attendance Calendar</h3>
              {renderCalendar()}
            </>
          )}
        </div>
      )}
    </div>
  );
}
