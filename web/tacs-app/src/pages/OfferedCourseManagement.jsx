import React, { useState, useEffect } from 'react';
import { api } from '../utils/api-utils';
import '../css/AdminDashboard.css';

const OfferedCourseManagement = () => {
    const [offeredCourses, setOfferedCourses] = useState([]);
    const [courses, setCourses] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        course: '',
        teacher: '',
        schedule: '',
        semester: 'FIRST_SEM',
        schoolYear: new Date().getFullYear() + '-' + (new Date().getFullYear() + 1),
        section: '',
        units: ''
    });

    const semesters = ['FIRST_SEM', 'SECOND_SEM', 'SUMMER'];

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        await Promise.all([
            fetchOfferedCourses(),
            fetchCourses(),
            fetchTeachers()
        ]);
    };

    const fetchOfferedCourses = async () => {
        const result = await api.get('/offered-courses');
        if (result.success) {
            setOfferedCourses(result.data);
        } else {
            alert('Failed to fetch offered courses: ' + result.error);
        }
    };

    const fetchCourses = async () => {
        const result = await api.get('/courses');
        if (result.success) setCourses(result.data);
    };

    const fetchTeachers = async () => {
        const result = await api.get('/teachers');
        if (result.success) setTeachers(result.data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            course: { courseId: parseInt(formData.course) },
            teacher: { teacherId: formData.teacher },
            semester: formData.semester,
            schoolYear: formData.schoolYear,
            section: formData.section,
            units: parseInt(formData.units)
        };

        const result = editingId
            ? await api.put(`/offered-courses/${editingId}`, payload)
            : await api.post('/offered-courses', payload);

        if (result.success) {
            alert(`Offered course ${editingId ? 'updated' : 'created'} successfully!`);
            resetForm();
            fetchOfferedCourses();
        } else {
            alert('Failed to save offered course: ' + result.error);
        }
    };

    const handleEdit = (offeredCourse) => {
        setFormData({
            course: offeredCourse.course?.courseId || '',
            teacher: offeredCourse.teacher?.teacherId || '',
            semester: offeredCourse.semester || 'FIRST_SEM',
            schoolYear: offeredCourse.schoolYear || new Date().getFullYear() + '-' + (new Date().getFullYear() + 1),
            section: offeredCourse.section || '',
            units: offeredCourse.units || ''
        });
        setEditingId(offeredCourse.offeredCourseId);
        setShowForm(true);
    };

    const handleDelete = async (offeredCourseId) => {
        if (window.confirm('Are you sure you want to delete this offered course?')) {
            const result = await api.delete(`/offered-courses/${offeredCourseId}`);
            if (result.success) {
                alert('Offered course deleted successfully!');
                fetchOfferedCourses();
            } else {
                alert('Failed to delete offered course: ' + result.error);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            course: '',
            teacher: '',
            semester: 'FIRST_SEM',
            schoolYear: new Date().getFullYear() + '-' + (new Date().getFullYear() + 1),
            section: '',
            units: ''
        });
        setEditingId(null);
        setShowForm(false);
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
            <h2>Offered Course Management</h2>
            <p style={{ color: '#666', marginBottom: '10px' }}>
                Define which courses are offered, by which teachers, for which semester and section.
            </p>
            <div style={{ background: '#d1ecf1', border: '1px solid #17a2b8', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                <strong>📋 Workflow:</strong>
                <ol style={{ marginTop: '10px', marginBottom: '5px', paddingLeft: '20px' }}>
                    <li><strong>Step 1:</strong> Create an Offered Course here (Course + Teacher + Section)</li>
                    <li><strong>Step 2:</strong> Go to <strong>Class Schedules</strong> tab to define when & where it meets</li>
                    <li><strong>Step 3:</strong> Create multiple schedules if course meets multiple times per week</li>
                </ol>
                <p style={{ marginTop: '10px', marginBottom: '0' }}>
                    <strong>Example:</strong> IT101 Section A with Prof. Smith → Then create schedules for Tuesday 8AM (Lecture Hall) + Thursday 2PM (Lab)
                </p>
            </div>
            
            <button 
                onClick={() => setShowForm(!showForm)} 
                className="btn-primary"
                style={{ marginBottom: '20px' }}
            >
                {showForm ? 'Cancel' : 'Add New Offered Course'}
            </button>

            {showForm && (
                <div className="form-container">
                    <h3>{editingId ? 'Edit Offered Course' : 'Add New Offered Course'}</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Course: *</label>
                            <select
                                value={formData.course}
                                onChange={(e) => {
                                    const selectedCourseId = parseInt(e.target.value);
                                    const selectedCourse = courses.find(c => c.courseId === selectedCourseId);
                                    
                                    if (selectedCourse) {
                                        setFormData({ 
                                            ...formData, 
                                            course: e.target.value,
                                            units: selectedCourse.units?.toString() || ''
                                        });
                                    } else {
                                        setFormData({ 
                                            ...formData, 
                                            course: e.target.value,
                                            units: ''
                                        });
                                    }
                                }}
                                required
                            >
                                <option value="">Select Course</option>
                                {courses.map(course => (
                                    <option key={course.courseId} value={course.courseId}>
                                        {course.courseCode} - {course.courseName} ({course.units || 'N/A'} units)
                                    </option>
                                ))}
                            </select>
                            {formData.course && (
                                <small style={{ color: '#666', display: 'block', marginTop: '5px' }}>
                                    ℹ️ Units auto-filled from selected course
                                </small>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Teacher: *</label>
                            <select
                                value={formData.teacher}
                                onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
                                required
                            >
                                <option value="">Select Teacher</option>
                                {teachers.map(teacher => (
                                    <option key={teacher.teacherId} value={teacher.teacherId}>
                                        {teacher.user?.fname} {teacher.user?.lname} - {teacher.specialization || 'N/A'}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Semester: *</label>
                            <select
                                value={formData.semester}
                                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                                required
                            >
                                {semesters.map(sem => (
                                    <option key={sem} value={sem}>{sem.replace('_', ' ')}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>School Year: *</label>
                            <input
                                type="text"
                                placeholder="e.g., 2024-2025"
                                value={formData.schoolYear}
                                onChange={(e) => setFormData({ ...formData, schoolYear: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Section: *</label>
                            <input
                                type="text"
                                placeholder="e.g., A, B, C, 1A, 2B"
                                value={formData.section}
                                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Units: *</label>
                            <input
                                type="number"
                                value={formData.units}
                                onChange={(e) => setFormData({ ...formData, units: e.target.value })}
                                min="1"
                                max="6"
                                required
                                disabled={!!formData.course}
                                style={formData.course ? { backgroundColor: '#f0f0f0', cursor: 'not-allowed' } : {}}
                            />
                            {formData.course && (
                                <small style={{ color: '#666', display: 'block', marginTop: '5px' }}>
                                    Auto-filled from course. Clear course to edit manually.
                                </small>
                            )}
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn-primary">
                                {editingId ? 'Update' : 'Create'} Offered Course
                            </button>
                            <button type="button" onClick={resetForm} className="btn-secondary">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="table-container">
                <h3>Offered Courses List</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Course Code</th>
                            <th>Course Name</th>
                            <th>Teacher</th>
                            <th>Section</th>
                            <th>Semester</th>
                            <th>School Year</th>
                            <th>Units</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {offeredCourses.length === 0 ? (
                            <tr>
                                <td colSpan="8" style={{ textAlign: 'center' }}>
                                    No offered courses found. Create one to enable class scheduling.
                                </td>
                            </tr>
                        ) : (
                            offeredCourses.map(oc => (
                                <tr key={oc.offeredCourseId}>
                                    <td>{oc.course?.courseCode || 'N/A'}</td>
                                    <td>{oc.course?.courseName || 'N/A'}</td>
                                    <td>{oc.teacher?.user?.fname} {oc.teacher?.user?.lname}</td>
                                    <td>{oc.section || 'N/A'}</td>
                                    <td>{oc.semester}</td>
                                    <td>{oc.schoolYear || 'N/A'}</td>
                                    <td>{oc.units}</td>
                                    <td>
                                        <button onClick={() => handleEdit(oc)} className="btn-edit">
                                            Edit
                                        </button>
                                        <button onClick={() => handleDelete(oc.offeredCourseId)} className="btn-delete">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OfferedCourseManagement;
