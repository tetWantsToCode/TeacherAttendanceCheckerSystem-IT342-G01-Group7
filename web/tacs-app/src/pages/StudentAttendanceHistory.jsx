import React, { useState, useEffect } from 'react';

const StudentAttendanceHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    totalPresent: 0,
    totalAbsent: 0,
    totalLate: 0,
    attendanceRate: 0
  });
  const [courseStats, setCourseStats] = useState([]);

  useEffect(() => {
    fetchAttendanceHistory();
  }, []);

  const fetchAttendanceHistory = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      const user = JSON.parse(userStr);
      const studentId = user.studentId;
      
      // Fetch student's attendance report
      const response = await fetch(`http://localhost:8080/api/reports/student/${studentId}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const report = await response.json();
        setHistory(report.records || []);
        setSummary(report.summary || {
          totalPresent: 0,
          totalAbsent: 0,
          totalLate: 0,
          attendanceRate: 0
        });

        // Calculate per-course statistics
        const courseMap = {};
        (report.records || []).forEach(record => {
          if (!courseMap[record.courseCode]) {
            courseMap[record.courseCode] = {
              courseName: record.courseName,
              courseCode: record.courseCode,
              present: 0,
              absent: 0,
              late: 0,
              total: 0
            };
          }
          courseMap[record.courseCode].total++;
          if (record.status === 'PRESENT') courseMap[record.courseCode].present++;
          if (record.status === 'ABSENT') courseMap[record.courseCode].absent++;
          if (record.status === 'LATE') courseMap[record.courseCode].late++;
        });

        const stats = Object.values(courseMap).map(stat => ({
          ...stat,
          attendanceRate: stat.total > 0 ? 
            ((stat.present + stat.late) / stat.total * 100).toFixed(1) : 0
        }));

        setCourseStats(stats);
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      PRESENT: { background: '#d1fae5', color: '#065f46', label: '✓ Present' },
      ABSENT: { background: '#fee2e2', color: '#991b1b', label: '✗ Absent' },
      LATE: { background: '#fef3c7', color: '#92400e', label: '⏰ Late' }
    };
    const style = styles[status] || styles.PRESENT;
    
    return (
      <span style={{
        padding: '6px 12px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: 'bold',
        ...style
      }}>
        {style.label}
      </span>
    );
  };

  const getPerformanceColor = (rate) => {
    if (rate >= 90) return '#10b981';
    if (rate >= 75) return '#f59e0b';
    return '#ef4444';
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px' }}>⏳</div>
        <p>Loading your attendance history...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>📊 My Attendance History</h2>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Track your attendance across all courses
      </p>

      {/* Overall Summary */}
      <div style={{
        background: 'white',
        padding: '25px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <h3 style={{ marginBottom: '20px' }}>📈 Overall Performance</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '15px'
        }}>
          <div style={{
            padding: '20px',
            background: '#d1fae5',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#065f46' }}>
              {summary.totalPresent}
            </div>
            <div style={{ fontSize: '14px', color: '#047857', marginTop: '5px' }}>
              ✓ Present
            </div>
          </div>
          <div style={{
            padding: '20px',
            background: '#fee2e2',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#991b1b' }}>
              {summary.totalAbsent}
            </div>
            <div style={{ fontSize: '14px', color: '#b91c1c', marginTop: '5px' }}>
              ✗ Absent
            </div>
          </div>
          <div style={{
            padding: '20px',
            background: '#fef3c7',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#92400e' }}>
              {summary.totalLate}
            </div>
            <div style={{ fontSize: '14px', color: '#b45309', marginTop: '5px' }}>
              ⏰ Late
            </div>
          </div>
          <div style={{
            padding: '20px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            borderRadius: '8px',
            textAlign: 'center',
            color: 'white'
          }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>
              {summary.attendanceRate}%
            </div>
            <div style={{ fontSize: '14px', marginTop: '5px', opacity: 0.9 }}>
              📊 Overall Rate
            </div>
          </div>
        </div>
      </div>

      {/* Per-Course Performance */}
      {courseStats.length > 0 && (
        <div style={{
          background: 'white',
          padding: '25px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginBottom: '30px'
        }}>
          <h3 style={{ marginBottom: '20px' }}>📚 Performance by Course</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '15px'
          }}>
            {courseStats.map((stat, index) => (
              <div key={index} style={{
                padding: '20px',
                background: '#f9fafb',
                borderRadius: '8px',
                borderLeft: `4px solid ${getPerformanceColor(stat.attendanceRate)}`
              }}>
                <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                  {stat.courseName}
                </div>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '15px' }}>
                  {stat.courseCode}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '14px', color: '#666' }}>Present:</span>
                  <span style={{ fontWeight: 'bold', color: '#10b981' }}>{stat.present}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '14px', color: '#666' }}>Absent:</span>
                  <span style={{ fontWeight: 'bold', color: '#ef4444' }}>{stat.absent}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                  <span style={{ fontSize: '14px', color: '#666' }}>Late:</span>
                  <span style={{ fontWeight: 'bold', color: '#f59e0b' }}>{stat.late}</span>
                </div>
                <div style={{
                  padding: '10px',
                  background: 'white',
                  borderRadius: '6px',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: getPerformanceColor(stat.attendanceRate)
                  }}>
                    {stat.attendanceRate}%
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Attendance Rate</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed History */}
      <div style={{
        background: 'white',
        padding: '25px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginBottom: '20px' }}>📝 Detailed History</h3>
        {history.length === 0 ? (
          <p style={{ color: '#999', fontStyle: 'italic', textAlign: 'center', padding: '40px' }}>
            No attendance records found
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Date</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Course</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {history.map((record, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '12px' }}>
                      {new Date(record.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ fontWeight: '500' }}>{record.courseName}</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>{record.courseCode}</div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      {getStatusBadge(record.status)}
                    </td>
                    <td style={{ padding: '12px', color: '#666', fontSize: '14px' }}>
                      {record.remarks || '—'}
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

export default StudentAttendanceHistory;
