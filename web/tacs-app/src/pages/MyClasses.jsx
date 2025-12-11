import React, { useState, useEffect } from 'react';
import '../css/MyClasses.css';
import { api } from '../utils/api-utils';

export default function MyClasses() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [teacherId, setTeacherId] = useState(null);
  const [showManageStudents, setShowManageStudents] = useState(false);
  const [allStudents, setAllStudents] = useState([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [studentToRemove, setStudentToRemove] = useState(null);

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
    setStudents([]);
    
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
      } else {
        // Don't set error for empty student list - just leave students array empty
        setStudents([]);
      }
    } catch (err) {
      console.error('Error loading students:', err);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseSelect = async (course) => {
    setSelectedCourse(course);
    setSuccess('');
    setError('');
    await fetchEnrolledStudents(course.courseId);
    await fetchEnrollments(course.courseId);
  };

  const handleBackToCourses = () => {
    setSelectedCourse(null);
    setStudents([]);
    setSuccess('');
    setError('');
  };

  const fetchAllStudents = async () => {
    const result = await api.get('/students');
    if (result.success) {
      setAllStudents(result.data);
    }
  };

  const fetchEnrollments = async (courseId) => {
    const result = await api.get(`/enrollments`);
    if (result.success) {
      const courseEnrollments = result.data.filter(enrollment => 
        enrollment.offeredCourse?.course?.courseId === courseId
      );
      setEnrollments(courseEnrollments);
    }
  };

  const handleManageStudents = async () => {
    setShowManageStudents(true);
    await fetchAllStudents();
    await fetchEnrollments(selectedCourse.courseId);
  };

  const handleAddStudent = async (studentId) => {
    setError('');
    setSuccess('');
    
    const offeredCoursesResult = await api.get(`/offered-courses/course/${selectedCourse.courseId}`);
    
    if (!offeredCoursesResult.success || offeredCoursesResult.data.length === 0) {
      setError('No offered course found for this course. Please create an offered course first.');
      return;
    }
    
    const offeredCourseId = offeredCoursesResult.data[0].offeredCourseId;
    
    const result = await api.post('/enrollments', {
      studentId: studentId,
      offeredCourseId: offeredCourseId,
      status: 'ACTIVE'
    });

    if (result.success) {
      setSuccess('Student added successfully!');
      await fetchEnrollments(selectedCourse.courseId);
      await fetchEnrolledStudents(selectedCourse.courseId);
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError(result.error || 'Failed to add student');
    }
  };

  const handleRemoveStudent = async (enrollmentId) => {
    setStudentToRemove(enrollmentId);
    setShowConfirmDialog(true);
  };

  const confirmRemoveStudent = async () => {
    setError('');
    setSuccess('');
    setShowConfirmDialog(false);

    const result = await api.delete(`/enrollments/${studentToRemove}`);

    if (result.success) {
      setSuccess('Student removed successfully!');
      await fetchEnrollments(selectedCourse.courseId);
      await fetchEnrolledStudents(selectedCourse.courseId);
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError(result.error || 'Failed to remove student');
    }
    
    setStudentToRemove(null);
  };

  const cancelRemoveStudent = () => {
    setShowConfirmDialog(false);
    setStudentToRemove(null);
  };

  return (
    <div className="my-classes-container">
      <div className="my-classes-header">
        <h1 className="my-classes-title">📚 My Classes</h1>
        <p className="my-classes-subtitle">View and manage your course rosters</p>
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
                  Click on a course to view enrolled students and manage class roster
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

      {selectedCourse && (
        <div>
          <button onClick={handleBackToCourses} className="back-button">
            <span>←</span> Back to Courses
          </button>

          <div className="course-info-bar">
            <div className="course-info-details">
              <h2 className="course-info-name">{selectedCourse.courseName}</h2>
              <p className="course-info-description">{selectedCourse.description}</p>
            </div>
          </div>

          {loading ? (
            <div className="loading-message">
              <div className="loading-spinner"></div>
              <p>Loading students...</p>
            </div>
          ) : (
            <>
              <div className="students-header">
                <h2 className="students-title">Enrolled Students</h2>
                <div className="students-header-actions">
                  <span className="students-count">{enrollments.length} Student{enrollments.length !== 1 ? 's' : ''}</span>
                  <button onClick={handleManageStudents} className="manage-students-button-small">
                    ➕ Manage Students
                  </button>
                </div>
              </div>
              
              {enrollments.length === 0 ? (
                <div className="warning-state">
                  <h3 className="warning-state-title">No Students Enrolled</h3>
                  <p className="warning-state-text">
                    There are no students enrolled in this course yet. Click "Manage Students" to add students to this course.
                  </p>
                </div>
              ) : (
                <div className="attendance-table-wrapper">
                  <table className="attendance-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Student Name</th>
                        <th>Email</th>
                        <th>Program</th>
                        <th>Year Level</th>
                        <th>Student ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      {enrollments.map((enrollment, index) => (
                        <tr key={enrollment.enrollmentId}>
                          <td className="student-number">{index + 1}</td>
                          <td className="student-name">
                            {enrollment.student?.user?.fname} {enrollment.student?.user?.lname}
                          </td>
                          <td className="student-email">{enrollment.student?.user?.email || 'N/A'}</td>
                          <td className="student-program">{enrollment.student?.program || 'N/A'}</td>
                          <td className="student-year">Year {enrollment.student?.yearLevel || 'N/A'}</td>
                          <td className="student-id">{enrollment.student?.studentNumber || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {showManageStudents && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Manage Students - {selectedCourse?.courseName}</h2>
              <button onClick={() => setShowManageStudents(false)} className="modal-close">
                ✕
              </button>
            </div>

            <div className="modal-section">
              <h3 className="section-heading section-heading-enrolled">
                ✓ Currently Enrolled ({enrollments.length})
              </h3>
              {enrollments.length === 0 ? (
                <p className="empty-text">No students enrolled yet</p>
              ) : (
                <div className="table-scroll-container">
                  <table className="modal-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Year & Section</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {enrollments.map(enrollment => (
                        <tr key={enrollment.enrollmentId}>
                          <td>
                            {enrollment.student?.user?.fname} {enrollment.student?.user?.lname}
                          </td>
                          <td className="muted-text">
                            Year {enrollment.student?.yearLevel} - {enrollment.student?.section || 'N/A'}
                          </td>
                          <td className="action-cell">
                            <button
                              onClick={() => handleRemoveStudent(enrollment.enrollmentId)}
                              className="action-button action-button-remove"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="modal-section">
              <h3 className="section-heading section-heading-available">
                ➕ Available Students
              </h3>
              {allStudents.filter(student => 
                !enrollments.some(e => e.student?.studentId === student.studentId)
              ).length === 0 ? (
                <p className="empty-text">All students are already enrolled</p>
              ) : (
                <div className="table-scroll-container">
                  <table className="modal-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Year & Section</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allStudents
                        .filter(student => !enrollments.some(e => e.student?.studentId === student.studentId))
                        .map(student => (
                          <tr key={student.studentId}>
                            <td>
                              {student.user?.fname} {student.user?.lname}
                            </td>
                            <td className="muted-text">
                              Year {student.yearLevel} - {student.section || 'N/A'}
                            </td>
                            <td className="action-cell">
                              <button
                                onClick={() => handleAddStudent(student.studentId)}
                                className="action-button action-button-add"
                              >
                                Add
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
      )}

      {/* Confirm Remove Dialog */}
      {showConfirmDialog && (
        <div className="modal-overlay">
          <div className="confirm-dialog">
            <h3 className="confirm-dialog-title">Remove Student</h3>
            <p className="confirm-dialog-message">
              Are you sure you want to remove this student from the course?
            </p>
            <div className="confirm-dialog-actions">
              <button onClick={cancelRemoveStudent} className="confirm-button confirm-button-cancel">
                Cancel
              </button>
              <button onClick={confirmRemoveStudent} className="confirm-button confirm-button-confirm">
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}