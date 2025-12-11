import React, { useState, useEffect } from 'react';

export default function EnrollStudentForm() {
  const [formData, setFormData] = useState({
    studentId: '',
    offeredCourseId: ''
  });
  const [students, setStudents] = useState([]);
  const [offeredCourses, setOfferedCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name'); // name, studentId, yearLevel
  const [filterYearLevel, setFilterYearLevel] = useState('all');
  const [studentSearch, setStudentSearch] = useState('');
  const [courseSearch, setCourseSearch] = useState('');
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);
  const [showCourseDropdown, setShowCourseDropdown] = useState(false);

  useEffect(() => {
    fetchStudents();
    fetchOfferedCourses();
    fetchEnrollments();
  }, []);

  const fetchStudents = async () => {
    try {
      const authData = JSON.parse(localStorage.getItem('auth'));
      const token = authData?.token;

      const response = await fetch('http://localhost:8080/api/students', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      }
    } catch (err) {
      console.error('Error fetching students:', err);
    }
  };

  const fetchOfferedCourses = async () => {
    try {
      const authData = JSON.parse(localStorage.getItem('auth'));
      const token = authData?.token;

      const response = await fetch('http://localhost:8080/api/offered-courses', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setOfferedCourses(data);
      }
    } catch (err) {
      console.error('Error fetching offered courses:', err);
    }
  };

  const fetchEnrollments = async () => {
    try {
      const authData = JSON.parse(localStorage.getItem('auth'));
      const token = authData?.token;

      const response = await fetch('http://localhost:8080/api/enrollments', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setEnrollments(data);
      }
    } catch (err) {
      console.error('Error fetching enrollments:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.searchable-dropdown')) {
        setShowStudentDropdown(false);
        setShowCourseDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const authData = JSON.parse(localStorage.getItem('auth'));
      const token = authData?.token;

      const response = await fetch('http://localhost:8080/api/enrollments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          studentId: parseInt(formData.studentId),
          offeredCourseId: parseInt(formData.offeredCourseId)
        })
      });

      if (response.ok) {
        setSuccess('Student enrolled successfully!');
        setFormData({ studentId: '', offeredCourseId: '' });
        fetchEnrollments();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const errorText = await response.text();
        setError(errorText || 'Failed to enroll student');
      }
    } catch (err) {
      setError('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEnrollment = async (enrollmentId) => {
    if (!confirm('Are you sure you want to delete this enrollment?')) return;

    try {
      const authData = JSON.parse(localStorage.getItem('auth'));
      const token = authData?.token;

      const response = await fetch(`http://localhost:8080/api/enrollments/${enrollmentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        fetchEnrollments();
      } else {
        alert('Failed to delete enrollment');
      }
    } catch (err) {
      alert('Error deleting enrollment');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Enroll Student in Course</h2>

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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
        {/* Enrollment Form */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>New Enrollment</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ position: 'relative' }} className="searchable-dropdown">
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Select Student *
              </label>
              <input
                type="text"
                placeholder="Search by student number..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                onFocus={() => setShowStudentDropdown(true)}
                required={!formData.studentId}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid #ccc',
                  fontSize: '14px'
                }}
              />
              {formData.studentId && (
                <div style={{ marginTop: '5px', padding: '8px', background: '#e8f5e9', borderRadius: '4px', fontSize: '13px' }}>
                  Selected: {students.find(s => s.studentId === parseInt(formData.studentId))?.user?.fname} {students.find(s => s.studentId === parseInt(formData.studentId))?.user?.lname}
                  <button 
                    type="button"
                    onClick={() => { setFormData({ ...formData, studentId: '' }); setStudentSearch(''); }}
                    style={{ marginLeft: '10px', background: '#f44336', color: 'white', border: 'none', borderRadius: '4px', padding: '2px 8px', cursor: 'pointer', fontSize: '12px' }}
                  >
                    Clear
                  </button>
                </div>
              )}
              {showStudentDropdown && !formData.studentId && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  maxHeight: '200px',
                  overflowY: 'auto',
                  background: 'white',
                  border: '1px solid #ccc',
                  borderRadius: '6px',
                  marginTop: '5px',
                  zIndex: 1000,
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}>
                  {students
                    .filter(student => {
                      const searchStr = studentSearch.toLowerCase();
                      const studentNumStr = student.studentNumber?.toLowerCase() || '';
                      return studentNumStr.includes(searchStr);
                    })
                    .slice(0, 50)
                    .map(student => (
                      <div
                        key={student.studentId}
                        onClick={() => {
                          setFormData({ ...formData, studentId: student.studentId });
                          setStudentSearch('');
                          setShowStudentDropdown(false);
                        }}
                        style={{
                          padding: '10px',
                          cursor: 'pointer',
                          borderBottom: '1px solid #eee',
                          ':hover': { background: '#f5f5f5' }
                        }}
                        onMouseEnter={(e) => e.target.style.background = '#f5f5f5'}
                        onMouseLeave={(e) => e.target.style.background = 'white'}
                      >
                        <strong>{student.user?.fname} {student.user?.lname}</strong>
                        <br />
                        <small style={{ color: '#666' }}>Student No: {student.studentNumber} | Year {student.yearLevel} - {student.program}</small>
                      </div>
                    ))}
                  {students.filter(s => (s.studentNumber?.toLowerCase() || '').includes(studentSearch.toLowerCase())).length === 0 && (
                    <div style={{ padding: '10px', color: '#999', textAlign: 'center' }}>No students found</div>
                  )}
                </div>
              )}
            </div>

            <div style={{ position: 'relative' }} className="searchable-dropdown">
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Select Offered Course *
              </label>
              <input
                type="text"
                placeholder="Search course by name, teacher, or section..."
                value={courseSearch}
                onChange={(e) => setCourseSearch(e.target.value)}
                onFocus={() => setShowCourseDropdown(true)}
                required={!formData.offeredCourseId}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid #ccc',
                  fontSize: '14px'
                }}
              />
              {formData.offeredCourseId && (
                <div style={{ marginTop: '5px', padding: '8px', background: '#e3f2fd', borderRadius: '4px', fontSize: '13px' }}>
                  Selected: {offeredCourses.find(oc => oc.offeredCourseId === parseInt(formData.offeredCourseId))?.course?.courseName}
                  <button 
                    type="button"
                    onClick={() => { setFormData({ ...formData, offeredCourseId: '' }); setCourseSearch(''); }}
                    style={{ marginLeft: '10px', background: '#f44336', color: 'white', border: 'none', borderRadius: '4px', padding: '2px 8px', cursor: 'pointer', fontSize: '12px' }}
                  >
                    Clear
                  </button>
                </div>
              )}
              {showCourseDropdown && !formData.offeredCourseId && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  maxHeight: '250px',
                  overflowY: 'auto',
                  background: 'white',
                  border: '1px solid #ccc',
                  borderRadius: '6px',
                  marginTop: '5px',
                  zIndex: 1000,
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}>
                  {offeredCourses
                    .filter(oc => {
                      const searchLower = courseSearch.toLowerCase();
                      const courseName = oc.course?.courseName?.toLowerCase() || '';
                      const teacherName = `${oc.teacher?.user?.fname} ${oc.teacher?.user?.lname}`.toLowerCase();
                      const section = oc.section?.toLowerCase() || '';
                      return courseName.includes(searchLower) || teacherName.includes(searchLower) || section.includes(searchLower);
                    })
                    .slice(0, 50)
                    .map(oc => (
                      <div
                        key={oc.offeredCourseId}
                        onClick={() => {
                          setFormData({ ...formData, offeredCourseId: oc.offeredCourseId });
                          setCourseSearch('');
                          setShowCourseDropdown(false);
                        }}
                        style={{
                          padding: '10px',
                          cursor: 'pointer',
                          borderBottom: '1px solid #eee'
                        }}
                        onMouseEnter={(e) => e.target.style.background = '#f5f5f5'}
                        onMouseLeave={(e) => e.target.style.background = 'white'}
                      >
                        <strong>{oc.course?.courseName}</strong>
                        <br />
                        <small style={{ color: '#666' }}>
                          {oc.teacher?.user?.fname} {oc.teacher?.user?.lname} | {oc.section} | {oc.semester}
                        </small>
                      </div>
                    ))}
                  {offeredCourses.filter(oc => {
                    const searchLower = courseSearch.toLowerCase();
                    return (oc.course?.courseName?.toLowerCase() || '').includes(searchLower) ||
                           `${oc.teacher?.user?.fname} ${oc.teacher?.user?.lname}`.toLowerCase().includes(searchLower) ||
                           (oc.section?.toLowerCase() || '').includes(searchLower);
                  }).length === 0 && (
                    <div style={{ padding: '10px', color: '#999', textAlign: 'center' }}>No courses found</div>
                  )}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '12px',
                background: loading ? '#ccc' : '#3F72AF',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                marginTop: '10px'
              }}
            >
              {loading ? 'Enrolling...' : 'Enroll Student'}
            </button>
          </form>
        </div>

        {/* Enrollments List */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>Current Enrollments ({enrollments.length})</h3>
          
          {/* Search and Filter Controls */}
          <div style={{ marginBottom: '20px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '10px' }}>
            <div>
              <input
                type="text"
                placeholder="Search by student number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid #ccc',
                  fontSize: '14px'
                }}
              />
            </div>
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid #ccc',
                  fontSize: '14px'
                }}
              >
                <option value="name">Sort: A-Z (Name)</option>
                <option value="studentId">Sort: Student ID</option>
                <option value="yearLevel">Sort: Year Level</option>
              </select>
            </div>
            <div>
              <select
                value={filterYearLevel}
                onChange={(e) => setFilterYearLevel(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid #ccc',
                  fontSize: '14px'
                }}
              >
                <option value="all">All Year Levels</option>
                <option value="1">Year 1</option>
                <option value="2">Year 2</option>
                <option value="3">Year 3</option>
                <option value="4">Year 4</option>
                <option value="5">Year 5</option>
              </select>
            </div>
          </div>

          {enrollments.length === 0 ? (
            <p style={{ color: '#666' }}>No enrollments yet.</p>
          ) : (
            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ position: 'sticky', top: 0, background: '#25364a', color: 'white' }}>
                  <tr>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Student Number</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Student</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Year Level</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Course</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {enrollments
                    .filter(enrollment => {
                      // Search filter
                      const studentNumStr = enrollment.student?.studentNumber?.toLowerCase() || '';
                      const matchesSearch = studentNumStr.includes(searchTerm.toLowerCase());
                      
                      // Year level filter
                      const matchesYearLevel = filterYearLevel === 'all' || 
                        enrollment.student?.yearLevel?.toString() === filterYearLevel;
                      
                      return matchesSearch && matchesYearLevel;
                    })
                    .sort((a, b) => {
                      if (sortBy === 'name') {
                        const nameA = `${a.student?.user?.fname} ${a.student?.user?.lname}`.toLowerCase();
                        const nameB = `${b.student?.user?.fname} ${b.student?.user?.lname}`.toLowerCase();
                        return nameA.localeCompare(nameB);
                      } else if (sortBy === 'studentId') {
                        return (a.student?.studentId || 0) - (b.student?.studentId || 0);
                      } else if (sortBy === 'yearLevel') {
                        return (a.student?.yearLevel || 0) - (b.student?.yearLevel || 0);
                      }
                      return 0;
                    })
                    .map(enrollment => (
                    <tr key={enrollment.enrollmentId} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '10px' }}>
                        {enrollment.student?.studentNumber}
                      </td>
                      <td style={{ padding: '10px' }}>
                        {enrollment.student?.user?.fname} {enrollment.student?.user?.lname}
                      </td>
                      <td style={{ padding: '10px' }}>
                        Year {enrollment.student?.yearLevel}
                      </td>
                      <td style={{ padding: '10px' }}>
                        {enrollment.offeredCourse?.course?.courseName} 
                        <br />
                        <small style={{ color: '#666' }}>
                          {enrollment.offeredCourse?.teacher?.user?.fname} {enrollment.offeredCourse?.teacher?.user?.lname} - 
                          {enrollment.offeredCourse?.section} ({enrollment.offeredCourse?.semester})
                        </small>
                      </td>
                      <td style={{ padding: '10px' }}>
                        <button
                          onClick={() => handleDeleteEnrollment(enrollment.enrollmentId)}
                          style={{
                            padding: '5px 10px',
                            background: '#f44336',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '13px'
                          }}
                        >
                          Delete
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
  );
}
