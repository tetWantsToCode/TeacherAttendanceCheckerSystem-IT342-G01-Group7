import React, { useState, useEffect } from 'react';
import { api } from '../utils/api-utils';

export default function AdminReports() {
  const [reportType, setReportType] = useState('daily');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCourses();
    fetchStudents();
  }, []);

  const fetchCourses = async () => {
    const result = await api.get('/courses');
    if (result.success) setCourses(result.data);
  };

  const fetchStudents = async () => {
    const result = await api.get('/students');
    if (result.success) setStudents(result.data);
  };

  const generateReport = async () => {
    setLoading(true);
    let endpoint = '';
    
    switch(reportType) {
      case 'daily':
        endpoint = `/reports/daily/${selectedDate}`;
        break;
      case 'monthly':
        endpoint = `/reports/monthly/${selectedMonth}`;
        break;
      case 'course':
        endpoint = `/reports/course/${selectedCourse}`;
        break;
      case 'student':
        endpoint = `/reports/student/${selectedStudent}`;
        break;
      default:
        return;
    }

    const result = await api.get(endpoint);
    if (result.success) {
      setReportData(result.data);
    }
    setLoading(false);
  };

  const exportToCSV = () => {
    if (!reportData) return;
    
    const csvContent = generateCSVContent(reportData);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_report_${reportType}_${Date.now()}.csv`;
    a.click();
  };

  const generateCSVContent = (data) => {
    if (!data || !data.records) return '';
    
    const headers = ['Date', 'Student Name', 'Course', 'Status', 'Time In', 'Remarks'];
    const rows = data.records.map(record => [
      record.date,
      record.studentName,
      record.courseName,
      record.status,
      record.timeIn || 'N/A',
      record.remarks || ''
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>📊 Attendance Reports</h2>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Generate and export comprehensive attendance reports
      </p>

      <div style={{ 
        background: 'white', 
        padding: '25px', 
        borderRadius: '12px', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Report Type:
          </label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #ddd'
            }}
          >
            <option value="daily">Daily Attendance Summary</option>
            <option value="monthly">Monthly Attendance Report</option>
            <option value="course">Per-Class Attendance Report</option>
            <option value="student">Per-Student Attendance History</option>
          </select>
        </div>

        {reportType === 'daily' && (
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Select Date:
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #ddd'
              }}
            />
          </div>
        )}

        {reportType === 'monthly' && (
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Select Month:
            </label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #ddd'
              }}
            />
          </div>
        )}

        {reportType === 'course' && (
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Select Course:
            </label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #ddd'
              }}
            >
              <option value="">Choose a course...</option>
              {courses.map(course => (
                <option key={course.courseId} value={course.courseId}>
                  {course.courseName}
                </option>
              ))}
            </select>
          </div>
        )}

        {reportType === 'student' && (
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Select Student:
            </label>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #ddd'
              }}
            >
              <option value="">Choose a student...</option>
              {students.map(student => (
                <option key={student.studentId} value={student.studentId}>
                  {student.user?.fname} {student.user?.lname}
                </option>
              ))}
            </select>
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={generateReport}
            disabled={loading}
            style={{
              flex: 1,
              padding: '12px',
              background: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold'
            }}
          >
            {loading ? '⏳ Generating...' : '📊 Generate Report'}
          </button>
          
          {reportData && (
            <button
              onClick={exportToCSV}
              style={{
                padding: '12px 20px',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              📥 Export CSV
            </button>
          )}
        </div>
      </div>

      {reportData && (
        <div style={{
          background: 'white',
          padding: '25px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3>Report Results</h3>
          <div style={{ marginTop: '20px' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '15px',
              marginBottom: '20px'
            }}>
              <div style={{ padding: '15px', background: '#10b98120', borderRadius: '8px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>
                  {reportData.summary?.totalPresent || 0}
                </div>
                <div style={{ color: '#666', fontSize: '14px' }}>Total Present</div>
              </div>
              <div style={{ padding: '15px', background: '#ef444420', borderRadius: '8px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444' }}>
                  {reportData.summary?.totalAbsent || 0}
                </div>
                <div style={{ color: '#666', fontSize: '14px' }}>Total Absent</div>
              </div>
              <div style={{ padding: '15px', background: '#f59e0b20', borderRadius: '8px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>
                  {reportData.summary?.totalLate || 0}
                </div>
                <div style={{ color: '#666', fontSize: '14px' }}>Total Late</div>
              </div>
              <div style={{ padding: '15px', background: '#3b82f620', borderRadius: '8px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>
                  {reportData.summary?.attendanceRate || 0}%
                </div>
                <div style={{ color: '#666', fontSize: '14px' }}>Attendance Rate</div>
              </div>
            </div>

            {reportData.records && reportData.records.length > 0 && (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Date</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Student</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Course</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Time In</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.records.map((record, index) => (
                      <tr key={index} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '12px' }}>{record.date}</td>
                        <td style={{ padding: '12px' }}>{record.studentName}</td>
                        <td style={{ padding: '12px' }}>{record.courseName}</td>
                        <td style={{ padding: '12px' }}>
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: '12px',
                            background: 
                              record.status === 'PRESENT' ? '#10b98120' :
                              record.status === 'ABSENT' ? '#ef444420' :
                              record.status === 'LATE' ? '#f59e0b20' : '#6366f120',
                            color:
                              record.status === 'PRESENT' ? '#10b981' :
                              record.status === 'ABSENT' ? '#ef4444' :
                              record.status === 'LATE' ? '#f59e0b' : '#6366f1',
                            fontWeight: 'bold',
                            fontSize: '12px'
                          }}>
                            {record.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px' }}>{record.timeIn || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
