import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/AdminDashboard.css';

const OfferedCourseManagement = () => {
    const [offeredCourses, setOfferedCourses] = useState([]);
    const [courses, setCourses] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [classrooms, setClassrooms] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        course: '',
        teacher: '',
        classroom: '',
        schedule: '',
        semester: 'FIRST_SEM',
        units: '',
        startTime: '',
        endTime: '',
        dayOfWeek: ''
    });

    const API_BASE_URL = 'http://localhost:8080/api';
    const daysOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
    const semesters = ['FIRST_SEM', 'SECOND_SEM', 'SUMMER'];

    useEffect(() => {
        fetchOfferedCourses();
        fetchCourses();
        fetchTeachers();
        fetchClassrooms();
    }, []);

    const fetchOfferedCourses = async () => {
        try {
            const authData = JSON.parse(localStorage.getItem('auth'));
            const token = authData?.token;
            const response = await axios.get(`${API_BASE_URL}/offered-courses`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOfferedCourses(response.data);
        } catch (error) {
            console.error('Error fetching offered courses:', error);
            alert('Failed to fetch offered courses');
        }
    };

    const fetchCourses = async () => {
        try {
            const authData = JSON.parse(localStorage.getItem('auth'));
            const token = authData?.token;
            const response = await axios.get(`${API_BASE_URL}/courses`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCourses(response.data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const fetchTeachers = async () => {
        try {
            const authData = JSON.parse(localStorage.getItem('auth'));
            const token = authData?.token;
            const response = await axios.get(`${API_BASE_URL}/teachers`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTeachers(response.data);
        } catch (error) {
            console.error('Error fetching teachers:', error);
        }
    };

    const fetchClassrooms = async () => {
        try {
            const authData = JSON.parse(localStorage.getItem('auth'));
            const token = authData?.token;
            const response = await axios.get(`${API_BASE_URL}/classrooms`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setClassrooms(response.data);
        } catch (error) {
            console.error('Error fetching classrooms:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const authData = JSON.parse(localStorage.getItem('auth'));
            const token = authData?.token;
            const payload = {
                course: { courseId: parseInt(formData.course) },
                teacher: { teacherId: formData.teacher },
                classroom: { classroomId: parseInt(formData.classroom) },
                schedule: formData.schedule,
                semester: formData.semester,
                units: parseInt(formData.units),
                startTime: formData.startTime,
                endTime: formData.endTime,
                dayOfWeek: formData.dayOfWeek
            };

            if (editingId) {
                await axios.put(`${API_BASE_URL}/offered-courses/${editingId}`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert('Offered course updated successfully!');
            } else {
                await axios.post(`${API_BASE_URL}/offered-courses`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert('Offered course created successfully!');
            }

            resetForm();
            fetchOfferedCourses();
        } catch (error) {
            console.error('Error saving offered course:', error);
            alert('Failed to save offered course: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleEdit = (offeredCourse) => {
        setFormData({
            course: offeredCourse.course?.courseId || '',
            teacher: offeredCourse.teacher?.teacherId || '',
            classroom: offeredCourse.classroom?.classroomId || '',
            schedule: offeredCourse.schedule || '',
            semester: offeredCourse.semester || 'FIRST_SEM',
            units: offeredCourse.units || '',
            startTime: offeredCourse.startTime || '',
            endTime: offeredCourse.endTime || '',
            dayOfWeek: offeredCourse.dayOfWeek || ''
        });
        setEditingId(offeredCourse.offeredCourseId);
        setShowForm(true);
    };

    const handleDelete = async (offeredCourseId) => {
        if (window.confirm('Are you sure you want to delete this offered course?')) {
            try {
                const authData = JSON.parse(localStorage.getItem('auth'));
                const token = authData?.token;
                await axios.delete(`${API_BASE_URL}/offered-courses/${offeredCourseId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert('Offered course deleted successfully!');
                fetchOfferedCourses();
            } catch (error) {
                console.error('Error deleting offered course:', error);
                alert('Failed to delete offered course');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            course: '',
            teacher: '',
            classroom: '',
            schedule: '',
            semester: 'FIRST_SEM',
            units: '',
            startTime: '',
            endTime: '',
            dayOfWeek: ''
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
                Link courses with teachers and classrooms for specific semesters. 
                These will be available for class scheduling.
            </p>
            <div style={{ background: '#fff3cd', border: '1px solid #ffc107', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                <strong>💡 Multiple Meetings Per Week:</strong> If a course meets multiple times (e.g., Tuesday lecture + Thursday lab), 
                create <strong>multiple Class Schedules</strong> for the same Offered Course in the Schedules page. 
                Each schedule can have different days, times, and even different classrooms!
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
                                    const selectedCourse = courses.find(c => c.courseId === parseInt(e.target.value));
                                    setFormData({ 
                                        ...formData, 
                                        course: e.target.value,
                                        units: selectedCourse?.units || '',
                                        semester: selectedCourse?.semester || 'FIRST_SEM'
                                    });
                                }}
                                required
                            >
                                <option value="">Select Course</option>
                                {courses.map(course => (
                                    <option key={course.courseId} value={course.courseId}>
                                        {course.courseCode} - {course.courseName} ({course.units} units)
                                    </option>
                                ))}
                            </select>
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
                            <label>Classroom: *</label>
                            <select
                                value={formData.classroom}
                                onChange={(e) => setFormData({ ...formData, classroom: e.target.value })}
                                required
                            >
                                <option value="">Select Classroom</option>
                                {classrooms.map(room => (
                                    <option key={room.classroomId} value={room.classroomId}>
                                        {room.roomNumber} - {room.building} (Cap: {room.capacity})
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
                            <label>Units: *</label>
                            <input
                                type="number"
                                value={formData.units}
                                onChange={(e) => setFormData({ ...formData, units: e.target.value })}
                                min="1"
                                max="6"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Day of Week: *</label>
                            <select
                                value={formData.dayOfWeek}
                                onChange={(e) => setFormData({ ...formData, dayOfWeek: e.target.value })}
                                required
                            >
                                <option value="">Select Day</option>
                                {daysOfWeek.map(day => (
                                    <option key={day} value={day}>{day}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Start Time: *</label>
                            <input
                                type="time"
                                value={formData.startTime}
                                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>End Time: *</label>
                            <input
                                type="time"
                                value={formData.endTime}
                                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Schedule Notes:</label>
                            <input
                                type="text"
                                value={formData.schedule}
                                onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                                placeholder="e.g., MW 8:00-10:00"
                            />
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
                            <th>Classroom</th>
                            <th>Day</th>
                            <th>Time</th>
                            <th>Semester</th>
                            <th>Units</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {offeredCourses.length === 0 ? (
                            <tr>
                                <td colSpan="9" style={{ textAlign: 'center' }}>
                                    No offered courses found. Create one to enable class scheduling.
                                </td>
                            </tr>
                        ) : (
                            offeredCourses.map(oc => (
                                <tr key={oc.offeredCourseId}>
                                    <td>{oc.course?.courseCode || 'N/A'}</td>
                                    <td>{oc.course?.courseName || 'N/A'}</td>
                                    <td>{oc.teacher?.user?.fname} {oc.teacher?.user?.lname}</td>
                                    <td>{oc.classroom?.roomNumber} - {oc.classroom?.building}</td>
                                    <td>{oc.dayOfWeek}</td>
                                    <td>{formatTime(oc.startTime)} - {formatTime(oc.endTime)}</td>
                                    <td>{oc.semester}</td>
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
