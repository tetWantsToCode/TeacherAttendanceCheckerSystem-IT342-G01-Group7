import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/AdminDashboard.css';

export default function TeacherAttendanceSession() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [classSchedules, setClassSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [students, setStudents] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [teacherId, setTeacherId] = useState(null);
  const [showSessionForm, setShowSessionForm] = useState(false);
  const [sessionForm, setSessionForm] = useState({
    date: new Date().toISOString().split('T')[0],
    startTime: '08:00',
    endTime: '10:00',
    sessionType: 'LECTURE',
    remarks: '',
    scheduleId: null
  });

  const API_BASE_URL = 'http://localhost:8080/api';

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
    try {
      const authData = JSON.parse(localStorage.getItem('auth'));
      const token = authData?.token;

      const response = await axios.get(`${API_BASE_URL}/attendance/teacher/${tId}/courses`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setCourses(response.data);
    } catch (err) {
      setError('Error loading courses');
    } finally {
      setLoading(false);
    }
  };

  const fetchClassSchedules = async (courseId) => {
    try {
      const authData = JSON.parse(localStorage.getItem('auth'));
      const token = authData?.token;

      const response = await axios.get(`${API_BASE_URL}/schedules/course/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setClassSchedules(response.data);
    } catch (err) {
      console.error('Error loading class schedules:', err);
      setClassSchedules([]);
    }
  };

  const fetchCourseSessions = async (courseId, scheduleId = null) => {
    try {
      const authData = JSON.parse(localStorage.getItem('auth'));
      const token = authData?.token;

      const url = scheduleId 
        ? `${API_BASE_URL}/attendance-sessions/course/${courseId}/schedule/${scheduleId}`
        : `${API_BASE_URL}/attendance-sessions/course/${courseId}`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSessions(response.data.sort((a, b) => new Date(b.date) - new Date(a.date)));
    } catch (err) {
      console.error('Error loading sessions:', err);
      setSessions([]);
    }
  };

  const fetchEnrolledStudents = async (courseId) => {
    try {
      const authData = JSON.parse(localStorage.getItem('auth'));
      const token = authData?.token;

      const response = await axios.get(`${API_BASE_URL}/attendance/course/${courseId}/students`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setStudents(response.data);
    } catch (err) {
      setError('Error loading students');
      setStudents([]);
    }
  };

  const fetchSessionAttendance = async (sessionId) => {
    try {
      const authData = JSON.parse(localStorage.getItem('auth'));
      const token = authData?.token;

      // Use the new session-specific endpoint
      const response = await axios.get(
        `${API_BASE_URL}/attendance/session/${sessionId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const records = {};
      response.data.forEach(record => {
        records[record.studentId] = {
          status: record.status,
          remarks: record.remarks || '',
          timeIn: record.timeIn || ''
        };
      });
      setAttendanceRecords(records);
    } catch (err) {
      console.error('Error loading attendance:', err);
    }
  };

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    setSelectedSchedule(null);
    setSelectedSession(null);
    setAttendanceRecords({});
    setStudents([]);
    setSessions([]);
    fetchClassSchedules(course.courseId);
    fetchEnrolledStudents(course.courseId);
  };

  const handleScheduleSelect = (schedule) => {
    setSelectedSchedule(schedule);
    setSelectedSession(null);
    setAttendanceRecords({});
    fetchCourseSessions(selectedCourse.courseId, schedule.scheduleId);
    // Pre-fill session form with schedule times
    setSessionForm(prev => ({
      ...prev,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      scheduleId: schedule.scheduleId,
      sessionType: schedule.dayOfWeek.includes('LAB') || schedule.classroom?.roomCode?.includes('LAB') ? 'LABORATORY' : 'LECTURE'
    }));
  };

  const handleSessionSelect = (session) => {
    setSelectedSession(session);
    fetchSessionAttendance(session.sessionId);
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const authData = JSON.parse(localStorage.getItem('auth'));
      const token = authData?.token;

      const payload = {
        course: { courseId: selectedCourse.courseId },
        teacher: { teacherId: teacherId },
        classSchedule: sessionForm.scheduleId ? { scheduleId: sessionForm.scheduleId } : null,
        date: sessionForm.date,
        startTime: sessionForm.startTime,
        endTime: sessionForm.endTime,
        sessionType: sessionForm.sessionType,
        isFinalized: false,
        remarks: sessionForm.remarks
      };

      const response = await axios.post(`${API_BASE_URL}/attendance-sessions`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess('Session created successfully!');
      setShowSessionForm(false);
      fetchCourseSessions(selectedCourse.courseId, selectedSchedule?.scheduleId);
      handleSessionSelect(response.data);
      
      // Reset form (keep schedule pre-fill if schedule selected)
      if (selectedSchedule) {
        setSessionForm({
          date: new Date().toISOString().split('T')[0],
          startTime: selectedSchedule.startTime,
          endTime: selectedSchedule.endTime,
          sessionType: sessionForm.sessionType,
          remarks: '',
          scheduleId: selectedSchedule.scheduleId
        });
      } else {
        setSessionForm({
          date: new Date().toISOString().split('T')[0],
          startTime: '08:00',
          endTime: '10:00',
          sessionType: 'LECTURE',
          remarks: '',
          scheduleId: null
        });
      }

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Error creating session: ' + (err.response?.data || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (studentId, status) => {
    setAttendanceRecords(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status: status,
        timeIn: status === 'PRESENT' || status === 'LATE' ? new Date().toTimeString().slice(0, 5) : ''
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

  const handleSubmitAttendance = async () => {
    if (!selectedSession) {
      setError('Please select or create a session first');
      return;
    }

    if (selectedSession.isFinalized) {
      setError('This session is already finalized. Cannot modify attendance.');
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
          return axios.post(`${API_BASE_URL}/attendance/mark`, {
            studentId: student.studentId,
            courseId: selectedCourse.courseId,
            sessionId: selectedSession.sessionId,
            date: selectedSession.date,
            status: record.status,
            remarks: record.remarks || '',
            timeIn: record.timeIn || null
          }, {
            headers: { Authorization: `Bearer ${token}` }
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

  const handleFinalizeSession = async () => {
    if (!selectedSession) return;

    if (!confirm('Are you sure you want to finalize this session? You cannot modify attendance after finalizing.')) {
      return;
    }

    try {
      const authData = JSON.parse(localStorage.getItem('auth'));
      const token = authData?.token;

      await axios.put(`${API_BASE_URL}/attendance-sessions/${selectedSession.sessionId}`, {
        ...selectedSession,
        isFinalized: true
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess('Session finalized successfully!');
      setSelectedSession({ ...selectedSession, isFinalized: true });
      fetchCourseSessions(selectedCourse.courseId);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Error finalizing session: ' + err.message);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (time) => {
    if (!time) return 'N/A';
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="admin-container">
      <h2>📋 Attendance Management (Session-Based)</h2>

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

      {/* Step 1: Course Selection */}
      <div style={{ marginBottom: '30px' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px', 
          marginBottom: '20px',
          padding: '20px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '12px',
          color: 'white',
          boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
        }}>
          <span style={{ fontSize: '32px' }}>📚</span>
          <div>
            <h3 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>Step 1: Select Your Course</h3>
            <p style={{ margin: '5px 0 0 0', fontSize: '14px', opacity: 0.9 }}>
              Choose the course you want to manage attendance for
            </p>
          </div>
        </div>

        {loading && !selectedCourse ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>⏳</div>
            <p style={{ color: '#666' }}>Loading your courses...</p>
          </div>
        ) : courses.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px',
            background: '#fff3cd',
            borderRadius: '12px',
            border: '2px dashed #ffc107'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '15px' }}>📭</div>
            <h4 style={{ margin: '0 0 10px 0', color: '#856404' }}>No Courses Assigned</h4>
            <p style={{ margin: 0, color: '#856404' }}>Please contact your administrator to assign courses to your account.</p>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
            gap: '20px' 
          }}>
            {courses.map(course => (
              <div
                key={course.courseId}
                onClick={() => handleCourseSelect(course)}
                style={{
                  padding: '24px',
                  border: selectedCourse?.courseId === course.courseId 
                    ? '3px solid #667eea' 
                    : '2px solid #e0e0e0',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  background: selectedCourse?.courseId === course.courseId 
                    ? 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)' 
                    : 'white',
                  transition: 'all 0.3s ease',
                  boxShadow: selectedCourse?.courseId === course.courseId
                    ? '0 8px 24px rgba(102, 126, 234, 0.25)'
                    : '0 2px 8px rgba(0,0,0,0.08)',
                  transform: selectedCourse?.courseId === course.courseId ? 'translateY(-4px)' : 'none',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  if (selectedCourse?.courseId !== course.courseId) {
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedCourse?.courseId !== course.courseId) {
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                {selectedCourse?.courseId === course.courseId && (
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: '#667eea',
                    color: 'white',
                    borderRadius: '20px',
                    padding: '4px 12px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    ✓ Selected
                  </div>
                )}
                
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px', 
                  marginBottom: '12px' 
                }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '12px',
                    background: selectedCourse?.courseId === course.courseId
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  }}>
                    📖
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '12px',
                      color: '#667eea',
                      fontWeight: '600',
                      marginBottom: '4px',
                      letterSpacing: '0.5px'
                    }}>
                      {course.courseCode || 'COURSE'}
                    </div>
                    <h4 style={{ 
                      margin: 0, 
                      color: '#2d3748',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      lineHeight: '1.3'
                    }}>
                      {course.courseName}
                    </h4>
                  </div>
                </div>
                
                <p style={{ 
                  margin: 0, 
                  fontSize: '13px', 
                  color: '#718096',
                  lineHeight: '1.5',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {course.description || 'Click to select this course'}
                </p>

                {course.semester && course.schoolYear && (
                  <div style={{ 
                    marginTop: '16px', 
                    paddingTop: '12px', 
                    borderTop: '1px solid #e2e8f0',
                    display: 'flex',
                    gap: '8px',
                    fontSize: '12px',
                    color: '#718096'
                  }}>
                    <span style={{ 
                      background: '#edf2f7', 
                      padding: '4px 10px', 
                      borderRadius: '12px',
                      fontWeight: '500'
                    }}>
                      📅 {course.semester?.replace('_', ' ')}
                    </span>
                    <span style={{ 
                      background: '#edf2f7', 
                      padding: '4px 10px', 
                      borderRadius: '12px',
                      fontWeight: '500'
                    }}>
                      🎓 {course.schoolYear}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Step 2: Session Selection/Creation */}
      {selectedCourse && (
        <div style={{ marginBottom: '30px' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '20px',
            padding: '20px',
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            borderRadius: '12px',
            color: 'white',
            boxShadow: '0 4px 15px rgba(240, 147, 251, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '32px' }}>📅</span>
              <div>
                <h3 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>Step 2: Manage Sessions</h3>
                <p style={{ margin: '5px 0 0 0', fontSize: '14px', opacity: 0.9 }}>
                  Create a new session or select an existing one
                </p>
              </div>
            </div>
            <button 
              onClick={() => setShowSessionForm(!showSessionForm)}
              style={{
                padding: '12px 24px',
                background: 'white',
                color: '#f5576c',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
              }}
            >
              <span style={{ fontSize: '18px' }}>{showSessionForm ? '✕' : '+'}</span>
              {showSessionForm ? 'Cancel' : 'Create New Session'}
            </button>
          </div>

          {showSessionForm && (
            <div style={{ 
              marginBottom: '30px',
              background: 'white',
              borderRadius: '16px',
              padding: '30px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              border: '2px solid #f093fb'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <span style={{ fontSize: '24px' }}>✨</span>
                <h4 style={{ margin: 0, fontSize: '20px', color: '#2d3748' }}>Create New Attendance Session</h4>
              </div>
              <form onSubmit={handleCreateSession}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div className="form-group">
                    <label>Date: *</label>
                    <input
                      type="date"
                      value={sessionForm.date}
                      onChange={(e) => setSessionForm({...sessionForm, date: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Class Schedule: *</label>
                    <select
                      value={sessionForm.scheduleId || ''}
                      onChange={(e) => {
                        const schedId = e.target.value ? parseInt(e.target.value) : null;
                        const sched = classSchedules.find(s => s.scheduleId === schedId);
                        if (sched) {
                          setSessionForm({
                            ...sessionForm,
                            scheduleId: schedId,
                            startTime: sched.startTime,
                            endTime: sched.endTime
                          });
                        } else {
                          setSessionForm({...sessionForm, scheduleId: null});
                        }
                      }}
                      required
                    >
                      <option value="">Select Schedule</option>
                      {classSchedules.map(schedule => (
                        <option key={schedule.scheduleId} value={schedule.scheduleId}>
                          {schedule.dayOfWeek} ({formatTime(schedule.startTime)}-{formatTime(schedule.endTime)}) - {schedule.classroom?.roomCode}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Session Type: *</label>
                    <select
                      value={sessionForm.sessionType}
                      onChange={(e) => setSessionForm({...sessionForm, sessionType: e.target.value})}
                      required
                    >
                      <option value="LECTURE">Lecture</option>
                      <option value="LABORATORY">Laboratory</option>
                      <option value="QUIZ">Quiz</option>
                      <option value="EXAM">Exam</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Start Time: *</label>
                    <input
                      type="time"
                      value={sessionForm.startTime}
                      onChange={(e) => setSessionForm({...sessionForm, startTime: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>End Time: *</label>
                    <input
                      type="time"
                      value={sessionForm.endTime}
                      onChange={(e) => setSessionForm({...sessionForm, endTime: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label>Remarks:</label>
                    <input
                      type="text"
                      value={sessionForm.remarks}
                      onChange={(e) => setSessionForm({...sessionForm, remarks: e.target.value})}
                      placeholder="Optional notes about this session..."
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Session'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Existing Sessions */}
          <div style={{ overflowX: 'auto' }}>
            <table className="table-container" style={{ minWidth: '800px' }}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Day</th>
                  <th>Time</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Remarks</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {sessions.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                      No sessions found. Create one to start taking attendance.
                    </td>
                  </tr>
                ) : (
                  sessions.map(session => (
                    <tr 
                      key={session.sessionId}
                      style={{ 
                        background: selectedSession?.sessionId === session.sessionId ? '#e8f4f8' : 'white',
                        cursor: 'pointer'
                      }}
                      onClick={() => handleSessionSelect(session)}
                    >
                      <td>{formatDate(session.date)}</td>
                      <td>{new Date(session.date).toLocaleDateString('en-US', { weekday: 'long' })}</td>
                      <td>{formatTime(session.startTime)} - {formatTime(session.endTime)}</td>
                      <td>
                        <span style={{ 
                          padding: '4px 8px', 
                          borderRadius: '4px', 
                          background: '#e8f4f8',
                          fontSize: '12px'
                        }}>
                          {session.sessionType}
                        </span>
                      </td>
                      <td>
                        <span className={session.isFinalized ? 'status-inactive' : 'status-active'}>
                          {session.isFinalized ? '🔒 Finalized' : '📝 Open'}
                        </span>
                      </td>
                      <td style={{ fontSize: '13px', color: '#666' }}>{session.remarks || '-'}</td>
                      <td>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSessionSelect(session);
                          }}
                          className="btn-primary"
                          style={{ padding: '6px 12px', fontSize: '13px' }}
                        >
                          {session.isFinalized ? 'View' : 'Take Attendance'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Step 3: Mark Attendance */}
      {selectedSession && students.length > 0 && (
        <div>
          <div style={{ 
            background: selectedSession.isFinalized 
              ? 'linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%)'
              : 'linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%)', 
            padding: '24px', 
            borderRadius: '16px', 
            marginBottom: '24px',
            color: 'white',
            boxShadow: '0 6px 20px rgba(0,0,0,0.15)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <span style={{ fontSize: '32px' }}>
                {selectedSession.isFinalized ? '🔒' : '✍️'}
              </span>
              <h3 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
                Step 3: Mark Attendance
                {selectedSession.isFinalized && ' (View Only)'}
              </h3>
            </div>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '16px',
              marginTop: '16px'
            }}>
              <div style={{ 
                background: 'rgba(255,255,255,0.2)', 
                padding: '12px', 
                borderRadius: '10px',
                backdropFilter: 'blur(10px)'
              }}>
                <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '4px' }}>📅 Date</div>
                <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
                  {formatDate(selectedSession.date)}
                </div>
              </div>
              
              <div style={{ 
                background: 'rgba(255,255,255,0.2)', 
                padding: '12px', 
                borderRadius: '10px',
                backdropFilter: 'blur(10px)'
              }}>
                <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '4px' }}>⏰ Time</div>
                <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
                  {formatTime(selectedSession.startTime)} - {formatTime(selectedSession.endTime)}
                </div>
              </div>
              
              <div style={{ 
                background: 'rgba(255,255,255,0.2)', 
                padding: '12px', 
                borderRadius: '10px',
                backdropFilter: 'blur(10px)'
              }}>
                <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '4px' }}>📚 Type</div>
                <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
                  {selectedSession.sessionType}
                </div>
              </div>
              
              <div style={{ 
                background: 'rgba(255,255,255,0.2)', 
                padding: '12px', 
                borderRadius: '10px',
                backdropFilter: 'blur(10px)'
              }}>
                <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '4px' }}>👥 Students</div>
                <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
                  {students.length} enrolled
                </div>
              </div>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <thead>
                <tr style={{ background: '#25364a', color: 'white' }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>#</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Student Name</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Year & Section</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Time In</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => {
                  const record = attendanceRecords[student.studentId] || {};
                  return (
                    <tr key={student.studentId} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '12px' }}>{index + 1}</td>
                      <td style={{ padding: '12px', fontWeight: 'bold' }}>{student.studentName}</td>
                      <td style={{ padding: '12px' }}>Year {student.yearLevel} - {student.section}</td>
                      <td style={{ padding: '12px' }}>
                        <select
                          value={record.status || ''}
                          onChange={(e) => handleStatusChange(student.studentId, e.target.value)}
                          disabled={selectedSession.isFinalized}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '4px',
                            border: '1px solid #ccc',
                            background: selectedSession.isFinalized ? '#f5f5f5' : 'white',
                            cursor: selectedSession.isFinalized ? 'not-allowed' : 'pointer'
                          }}
                        >
                          <option value="">Select...</option>
                          <option value="PRESENT">✅ Present</option>
                          <option value="LATE">⏰ Late</option>
                          <option value="ABSENT">❌ Absent</option>
                          <option value="EXCUSED">📝 Excused</option>
                        </select>
                      </td>
                      <td style={{ padding: '12px', fontSize: '13px', color: '#666' }}>
                        {record.timeIn || '-'}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <input
                          type="text"
                          value={record.remarks || ''}
                          onChange={(e) => handleRemarksChange(student.studentId, e.target.value)}
                          disabled={selectedSession.isFinalized}
                          placeholder="Optional notes..."
                          style={{
                            padding: '6px 10px',
                            borderRadius: '4px',
                            border: '1px solid #ccc',
                            width: '200px',
                            background: selectedSession.isFinalized ? '#f5f5f5' : 'white'
                          }}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {!selectedSession.isFinalized && (
            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
              <button
                onClick={handleSubmitAttendance}
                disabled={loading || Object.keys(attendanceRecords).length === 0}
                className="btn-primary"
                style={{ padding: '12px 30px' }}
              >
                {loading ? 'Saving...' : '💾 Save Attendance'}
              </button>

              <button
                onClick={handleFinalizeSession}
                disabled={loading}
                className="btn-warning"
                style={{ padding: '12px 30px' }}
              >
                🔒 Finalize Session
              </button>
            </div>
          )}

          {selectedSession.isFinalized && (
            <div style={{ 
              marginTop: '20px', 
              padding: '15px', 
              background: '#fff3cd', 
              border: '1px solid #ffc107',
              borderRadius: '6px' 
            }}>
              <strong>⚠️ This session has been finalized.</strong> Attendance records are locked and cannot be modified.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
