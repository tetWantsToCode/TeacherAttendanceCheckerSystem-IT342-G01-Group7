import React, { useState, useEffect } from 'react';

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
      days.push(<div key={`empty-${i}`} style={{ padding: '10px' }}></div>);
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
          style={{
            padding: '10px',
            border: isToday ? '2px solid #25364a' : '1px solid #e0e0e0',
            borderRadius: '8px',
            minHeight: '80px',
            background: config ? config.bg : 'white',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <div style={{
            fontWeight: isToday ? 'bold' : 'normal',
            fontSize: '14px',
            color: isToday ? '#25364a' : (config ? config.color : '#666'),
            marginBottom: '5px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span>{day}</span>
            {isToday && (
              <span style={{
                fontSize: '10px',
                background: '#25364a',
                color: 'white',
                padding: '2px 6px',
                borderRadius: '4px',
                fontWeight: 'bold'
              }}>
                TODAY
              </span>
            )}
          </div>
          {attendance && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1
            }}>
              <div style={{
                fontSize: '11px',
                fontWeight: 'bold',
                color: config.color,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                textAlign: 'center'
              }}>
                {config.label}
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <div style={{ marginTop: '20px' }}>
        {/* Calendar Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          background: '#f7f9fb',
          padding: '15px',
          borderRadius: '8px'
        }}>
          <button
            onClick={() => changeMonth(-1)}
            style={{
              padding: '8px 16px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            ← Previous
          </button>
          <h3 style={{ margin: 0, color: '#25364a' }}>{monthName}</h3>
          <button
            onClick={() => changeMonth(1)}
            style={{
              padding: '8px 16px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            Next →
          </button>
        </div>

        {/* Day names */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '10px',
          marginBottom: '10px'
        }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} style={{
              textAlign: 'center',
              fontWeight: 'bold',
              color: '#25364a',
              padding: '10px',
              fontSize: '14px'
            }}>
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '10px'
        }}>
          {days}
        </div>

        {/* Legend */}
        <div style={{
          marginTop: '20px',
          padding: '15px',
          background: '#f7f9fb',
          borderRadius: '8px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '15px',
          justifyContent: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{
              width: '20px',
              height: '20px',
              background: '#e8f5e9',
              border: '2px solid #4CAF50',
              borderRadius: '4px'
            }}></div>
            <span style={{ fontSize: '13px' }}>Present</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{
              width: '20px',
              height: '20px',
              background: '#fff3e0',
              border: '2px solid #FF9800',
              borderRadius: '4px'
            }}></div>
            <span style={{ fontSize: '13px' }}>Late</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{
              width: '20px',
              height: '20px',
              background: '#ffebee',
              border: '2px solid #f44336',
              borderRadius: '4px'
            }}></div>
            <span style={{ fontSize: '13px' }}>Absent</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{
              width: '20px',
              height: '20px',
              background: '#e3f2fd',
              border: '2px solid #2196F3',
              borderRadius: '4px'
            }}></div>
            <span style={{ fontSize: '13px' }}>Excused</span>
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
    <div style={{ padding: '20px' }}>
      <h2>My Classes & Attendance</h2>

      {error && (
        <div style={{ 
          background: '#fee', 
          color: '#c33', 
          padding: '10px', 
          borderRadius: '6px', 
          marginBottom: '15px' 
        }}>
          {error}
        </div>
      )}

      {/* Course List View */}
      {!selectedCourse && (
        <>
          {loading ? (
            <p>Loading your classes...</p>
          ) : enrollments.length === 0 ? (
            <div style={{ 
              background: '#f5f5f5', 
              padding: '20px', 
              borderRadius: '8px', 
              textAlign: 'center',
              color: '#666'
            }}>
              <p>You are not enrolled in any courses yet.</p>
              <p style={{ fontSize: '14px' }}>Please contact your administrator for enrollment.</p>
            </div>
          ) : (
            <>
              <p style={{ color: '#666', marginBottom: '15px' }}>
                Click on a course to view your attendance records
              </p>
              <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                {enrollments.map(enrollment => (
                  <div
                    key={enrollment.enrollmentId}
                    onClick={() => handleCourseClick(enrollment)}
                    style={{
                      background: 'white',
                      padding: '20px',
                      borderRadius: '8px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      border: '1px solid #e0e0e0',
                      position: 'relative',
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
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      color: 'white',
                      background: getStatusColor(enrollment.status)
                    }}>
                      {enrollment.status}
                    </div>
                    
                    <h3 style={{ 
                      margin: '0 0 10px 0', 
                      color: '#25364a',
                      fontSize: '18px',
                      paddingRight: '80px'
                    }}>
                      {enrollment.course.courseName}
                    </h3>
                    
                    <p style={{ 
                      color: '#666', 
                      fontSize: '14px',
                      margin: '0 0 15px 0',
                      lineHeight: '1.5'
                    }}>
                      {enrollment.course.description}
                    </p>
                    
                    <div style={{ 
                      paddingTop: '15px', 
                      borderTop: '1px solid #eee',
                      fontSize: '13px',
                      color: '#888'
                    }}>
                      <p style={{ margin: '0 0 5px 0' }}>
                        <strong>Teacher:</strong> {enrollment.course.teacher.user.fname} {enrollment.course.teacher.user.lname}
                      </p>
                      <p style={{ margin: '0 0 5px 0' }}>
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
            style={{
              padding: '8px 16px',
              background: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              marginBottom: '20px'
            }}
          >
            ← Back to Classes
          </button>

          <div style={{ background: '#f7f9fb', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
            <h3 style={{ margin: '0 0 10px 0' }}>{selectedCourse.course.courseName}</h3>
            <p style={{ color: '#666', fontSize: '14px', margin: '0' }}>
              <strong>Teacher:</strong> {selectedCourse.course.teacher.user.fname} {selectedCourse.course.teacher.user.lname}
            </p>
          </div>

          {loading ? (
            <p>Loading attendance records...</p>
          ) : attendanceRecords.length === 0 ? (
            <div style={{
              background: '#fff3e0',
              padding: '20px',
              borderRadius: '8px',
              textAlign: 'center',
              color: '#e65100'
            }}>
              <p style={{ margin: 0, fontSize: '16px' }}>No attendance records yet</p>
              <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>Your teacher hasn't marked attendance for this course.</p>
            </div>
          ) : (
            <>
              {/* Attendance Statistics */}
              <div style={{
                display: 'flex',
                gap: '10px',
                marginBottom: '20px',
                flexWrap: 'wrap'
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  padding: '10px 15px',
                  borderRadius: '8px',
                  textAlign: 'center',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  flex: '1',
                  minWidth: '110px'
                }}>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '2px' }}>
                    {calculateAttendanceStats().attendanceRate}%
                  </div>
                  <div style={{ fontSize: '11px', opacity: 0.9 }}>Rate</div>
                </div>

                <div style={{
                  background: '#4CAF50',
                  color: 'white',
                  padding: '10px 15px',
                  borderRadius: '8px',
                  textAlign: 'center',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  flex: '1',
                  minWidth: '110px'
                }}>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '2px' }}>
                    {calculateAttendanceStats().present}
                  </div>
                  <div style={{ fontSize: '11px', opacity: 0.9 }}>Present</div>
                </div>

                <div style={{
                  background: '#FF9800',
                  color: 'white',
                  padding: '10px 15px',
                  borderRadius: '8px',
                  textAlign: 'center',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  flex: '1',
                  minWidth: '110px'
                }}>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '2px' }}>
                    {calculateAttendanceStats().late}
                  </div>
                  <div style={{ fontSize: '11px', opacity: 0.9 }}>Late</div>
                </div>

                <div style={{
                  background: '#f44336',
                  color: 'white',
                  padding: '10px 15px',
                  borderRadius: '8px',
                  textAlign: 'center',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  flex: '1',
                  minWidth: '110px'
                }}>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '2px' }}>
                    {calculateAttendanceStats().absent}
                  </div>
                  <div style={{ fontSize: '11px', opacity: 0.9 }}>Absent</div>
                </div>

                <div style={{
                  background: '#2196F3',
                  color: 'white',
                  padding: '10px 15px',
                  borderRadius: '8px',
                  textAlign: 'center',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  flex: '1',
                  minWidth: '110px'
                }}>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '2px' }}>
                    {calculateAttendanceStats().excused}
                  </div>
                  <div style={{ fontSize: '11px', opacity: 0.9 }}>Excused</div>
                </div>
              </div>

              {/* Attendance Calendar */}
              <h3 style={{ marginBottom: '15px' }}>Attendance Calendar</h3>
              {renderCalendar()}
            </>
          )}
        </div>
      )}
    </div>
  );
}
