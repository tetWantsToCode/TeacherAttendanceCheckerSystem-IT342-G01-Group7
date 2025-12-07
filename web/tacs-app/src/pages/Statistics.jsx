import React, { useState, useEffect } from 'react';
import { api } from '../utils/api-utils';

const Statistics = () => {
  const [stats, setStats] = useState({
    todayPresent: 0,
    todayAbsent: 0,
    todayLate: 0,
    totalStudents: 0,
    totalTeachers: 0,
    totalCourses: 0,
    attendanceRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);
  const [absentTrends, setAbsentTrends] = useState([]);

  useEffect(() => {
    fetchStatistics();
    fetchRecentActivity();
    fetchAbsentTrends();
  }, []);

  const fetchStatistics = async () => {
    setLoading(true);
    const today = new Date().toISOString().split('T')[0];
    
    // Fetch today's attendance
    const attendanceResult = await api.get(`/attendance/date/${today}`);
    const studentsResult = await api.get('/students');
    const teachersResult = await api.get('/teachers');
    const coursesResult = await api.get('/courses');

    if (attendanceResult.success && studentsResult.success) {
      const attendance = attendanceResult.data || [];
      const present = attendance.filter(a => a.status === 'PRESENT').length;
      const absent = attendance.filter(a => a.status === 'ABSENT').length;
      const late = attendance.filter(a => a.status === 'LATE').length;
      const total = studentsResult.data.length;
      const rate = total > 0 ? ((present + late) / total * 100).toFixed(1) : 0;

      setStats({
        todayPresent: present,
        todayAbsent: absent,
        todayLate: late,
        totalStudents: total,
        totalTeachers: teachersResult.success ? teachersResult.data.length : 0,
        totalCourses: coursesResult.success ? coursesResult.data.length : 0,
        attendanceRate: rate
      });
    }
    setLoading(false);
  };

  const fetchRecentActivity = async () => {
    // Fetch recent attendance sessions
    const result = await api.get('/attendance-sessions');
    if (result.success) {
      const recent = result.data
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 10);
      setRecentActivity(recent);
    }
  };

  const fetchAbsentTrends = async () => {
    // Get students with frequent absences
    const result = await api.get('/students');
    if (result.success) {
      // This would need backend support to calculate absence count
      setAbsentTrends([]);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px' }}>⏳</div>
        <p>Loading statistics...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>📊 Real-Time Monitoring Dashboard</h2>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Track attendance and system activity in real-time
      </p>

      {/* Today's Overview */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{ 
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
          padding: '25px', 
          borderRadius: '12px', 
          color: 'white',
          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
        }}>
          <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>
            ✅ Present Today
          </div>
          <div style={{ fontSize: '36px', fontWeight: 'bold' }}>
            {stats.todayPresent}
          </div>
          <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '5px' }}>
            out of {stats.totalStudents} students
          </div>
        </div>

        <div style={{ 
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', 
          padding: '25px', 
          borderRadius: '12px', 
          color: 'white',
          boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
        }}>
          <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>
            ❌ Absent Today
          </div>
          <div style={{ fontSize: '36px', fontWeight: 'bold' }}>
            {stats.todayAbsent}
          </div>
          <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '5px' }}>
            need follow-up
          </div>
        </div>

        <div style={{ 
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', 
          padding: '25px', 
          borderRadius: '12px', 
          color: 'white',
          boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
        }}>
          <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>
            ⏰ Late Today
          </div>
          <div style={{ fontSize: '36px', fontWeight: 'bold' }}>
            {stats.todayLate}
          </div>
          <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '5px' }}>
            tardiness records
          </div>
        </div>

        <div style={{ 
          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', 
          padding: '25px', 
          borderRadius: '12px', 
          color: 'white',
          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
        }}>
          <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>
            📈 Attendance Rate
          </div>
          <div style={{ fontSize: '36px', fontWeight: 'bold' }}>
            {stats.attendanceRate}%
          </div>
          <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '5px' }}>
            today's performance
          </div>
        </div>
      </div>

      {/* System Overview */}
      <div style={{
        background: 'white',
        padding: '25px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <h3 style={{ marginBottom: '20px' }}>🏫 System Overview</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
          gap: '15px'
        }}>
          <div style={{ padding: '15px', background: '#f9fafb', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#3b82f6' }}>
              {stats.totalStudents}
            </div>
            <div style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
              👨‍🎓 Total Students
            </div>
          </div>
          <div style={{ padding: '15px', background: '#f9fafb', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#10b981' }}>
              {stats.totalTeachers}
            </div>
            <div style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
              👩‍🏫 Total Teachers
            </div>
          </div>
          <div style={{ padding: '15px', background: '#f9fafb', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#f59e0b' }}>
              {stats.totalCourses}
            </div>
            <div style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
              📚 Total Courses
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{
        background: 'white',
        padding: '25px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginBottom: '20px' }}>📝 Recent Attendance Sessions</h3>
        {recentActivity.length === 0 ? (
          <p style={{ color: '#999', fontStyle: 'italic' }}>No recent activity</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Date</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Course</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Teacher</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Type</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.map((activity, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '12px' }}>
                      {new Date(activity.date).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '12px' }}>{activity.course?.courseName || 'N/A'}</td>
                    <td style={{ padding: '12px' }}>
                      {activity.teacher?.user?.fname} {activity.teacher?.user?.lname}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '12px',
                        background: '#e8f4f8',
                        fontSize: '12px'
                      }}>
                        {activity.sessionType}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        background: activity.isFinalized ? '#fef3c7' : '#dbeafe',
                        color: activity.isFinalized ? '#92400e' : '#1e40af',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {activity.isFinalized ? '🔒 Finalized' : '📝 Open'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Statistics;

