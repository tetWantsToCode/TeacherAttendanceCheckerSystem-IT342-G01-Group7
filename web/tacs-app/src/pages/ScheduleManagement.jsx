import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/AdminDashboard.css';

const ScheduleManagement = () => {
    const [schedules, setSchedules] = useState([]);
    const [offeredCourses, setOfferedCourses] = useState([]);
    const [classrooms, setClassrooms] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        offeredCourse: '',
        dayOfWeek: '',
        startTime: '',
        endTime: '',
        classroom: '',
        isActive: true
    });

    const API_BASE_URL = 'http://localhost:8080/api';
    const daysOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

    useEffect(() => {
        fetchSchedules();
        fetchOfferedCourses();
        fetchClassrooms();
    }, []);

    const fetchSchedules = async () => {
        try {
            const authData = JSON.parse(localStorage.getItem('auth'));
            const token = authData?.token;
            const response = await axios.get(`${API_BASE_URL}/schedules`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSchedules(response.data);
        } catch (error) {
            console.error('Error fetching schedules:', error);
            alert('Failed to fetch schedules');
        }
    };

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

    const checkConflicts = async (classroomId, dayOfWeek, startTime, endTime) => {
        try {
            const authData = JSON.parse(localStorage.getItem('auth'));
            const token = authData?.token;
            const response = await axios.post(`${API_BASE_URL}/schedules/check-conflicts`, {
                classroomId: parseInt(classroomId),
                dayOfWeek,
                startTime,
                endTime
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error('Error checking conflicts:', error);
            return [];
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Check for conflicts before submitting
        if (!editingId) {
            const conflicts = await checkConflicts(
                formData.classroom,
                formData.dayOfWeek,
                formData.startTime,
                formData.endTime
            );

            if (conflicts.length > 0) {
                alert('Schedule conflict detected! This classroom is already booked at this time.');
                return;
            }
        }

        try {
            const authData = JSON.parse(localStorage.getItem('auth'));
            const token = authData?.token;
            const payload = {
                offeredCourse: { offeredCourseId: parseInt(formData.offeredCourse) },
                classroom: { classroomId: parseInt(formData.classroom) },
                dayOfWeek: formData.dayOfWeek,
                startTime: formData.startTime,
                endTime: formData.endTime,
                isActive: formData.isActive
            };

            if (editingId) {
                await axios.put(`${API_BASE_URL}/schedules/${editingId}`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert('Schedule updated successfully!');
            } else {
                await axios.post(`${API_BASE_URL}/schedules`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert('Schedule created successfully!');
            }

            resetForm();
            fetchSchedules();
        } catch (error) {
            console.error('Error saving schedule:', error);
            const errorMsg = error.response?.data?.error || error.message;
            alert('Failed to save schedule: ' + errorMsg);
        }
    };

    const handleEdit = (schedule) => {
        setFormData({
            offeredCourse: schedule.offeredCourse?.offeredCourseId || '',
            dayOfWeek: schedule.dayOfWeek,
            startTime: schedule.startTime,
            endTime: schedule.endTime,
            classroom: schedule.classroom?.classroomId || '',
            isActive: schedule.isActive
        });
        setEditingId(schedule.scheduleId);
        setShowForm(true);
    };

    const handleDeactivate = async (scheduleId) => {
        if (window.confirm('Are you sure you want to deactivate this schedule?')) {
            try {
                const authData = JSON.parse(localStorage.getItem('auth'));
                const token = authData?.token;
                await axios.patch(`${API_BASE_URL}/schedules/${scheduleId}/deactivate`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert('Schedule deactivated successfully!');
                fetchSchedules();
            } catch (error) {
                console.error('Error deactivating schedule:', error);
                alert('Failed to deactivate schedule');
            }
        }
    };

    const handleDelete = async (scheduleId) => {
        if (window.confirm('Are you sure you want to delete this schedule?')) {
            try {
                const authData = JSON.parse(localStorage.getItem('auth'));
                const token = authData?.token;
                await axios.delete(`${API_BASE_URL}/schedules/${scheduleId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert('Schedule deleted successfully!');
                fetchSchedules();
            } catch (error) {
                console.error('Error deleting schedule:', error);
                alert('Failed to delete schedule');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            offeredCourse: '',
            dayOfWeek: '',
            startTime: '',
            endTime: '',
            classroom: '',
            isActive: true
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
            <h2>Class Schedule Management</h2>
            <p style={{ color: '#666', marginBottom: '10px' }}>
                Define when and where each offered course meets.
            </p>
            <div style={{ background: '#d1ecf1', border: '1px solid #17a2b8', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                <strong>📅 Multiple Meetings:</strong> Create multiple schedules for the same Offered Course if it meets more than once per week.
                <br />
                <strong>Example:</strong> IT101 can have:
                <ul style={{ marginTop: '10px', marginBottom: '5px' }}>
                    <li><strong>Schedule 1:</strong> Tuesday 8:00-10:00 AM (Lecture in ROOM-201)</li>
                    <li><strong>Schedule 2:</strong> Thursday 4:00-6:00 PM (Lab in LAB-101)</li>
                </ul>
            </div>
            
            <button 
                onClick={() => setShowForm(!showForm)} 
                className="btn-primary"
                style={{ marginBottom: '20px' }}
            >
                {showForm ? 'Cancel' : 'Add New Schedule'}
            </button>

            {showForm && (
                <div className="form-container">
                    <h3>{editingId ? 'Edit Schedule' : 'Add New Schedule'}</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Offered Course: *</label>
                            <select
                                value={formData.offeredCourse}
                                onChange={(e) => setFormData({ ...formData, offeredCourse: e.target.value })}
                                required
                            >
                                <option value="">Select Offered Course</option>
                                {offeredCourses.map(oc => {
                                    const existingSchedules = schedules.filter(s => s.offeredCourse?.offeredCourseId === oc.offeredCourseId);
                                    const scheduleCount = existingSchedules.length;
                                    return (
                                        <option key={oc.offeredCourseId} value={oc.offeredCourseId}>
                                            {oc.course?.courseCode || 'N/A'} - {oc.course?.courseName || 'Unknown'} 
                                            ({oc.teacher?.user?.fname} {oc.teacher?.user?.lname})
                                            {scheduleCount > 0 ? ` [${scheduleCount} schedule${scheduleCount > 1 ? 's' : ''}]` : ''}
                                        </option>
                                    );
                                })}
                            </select>
                            {formData.offeredCourse && schedules.filter(s => s.offeredCourse?.offeredCourseId === parseInt(formData.offeredCourse)).length > 0 && (
                                <small style={{ display: 'block', marginTop: '5px', color: '#17a2b8' }}>
                                    ℹ️ This course already has {schedules.filter(s => s.offeredCourse?.offeredCourseId === parseInt(formData.offeredCourse)).length} schedule(s). 
                                    You can add another meeting time.
                                </small>
                            )}
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
                            <label>Classroom: *</label>
                            <select
                                value={formData.classroom}
                                onChange={(e) => setFormData({ ...formData, classroom: e.target.value })}
                                required
                            >
                                <option value="">Select Classroom</option>
                                {classrooms.map(room => (
                                    <option key={room.classroomId} value={room.classroomId}>
                                        {room.roomNumber} - {room.building} (Capacity: {room.capacity})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                />
                                Active
                            </label>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn-primary">
                                {editingId ? 'Update' : 'Create'} Schedule
                            </button>
                            <button type="button" onClick={resetForm} className="btn-secondary">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="table-container">
                <h3>Schedules List</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Course</th>
                            <th>Teacher</th>
                            <th>Day</th>
                            <th>Time</th>
                            <th>Classroom</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {schedules.length === 0 ? (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center' }}>No schedules found</td>
                            </tr>
                        ) : (
                            schedules.map(schedule => (
                                <tr key={schedule.scheduleId}>
                                    <td>{schedule.offeredCourse?.course?.courseName || 'N/A'}</td>
                                    <td>
                                        {schedule.offeredCourse?.teacher?.user?.fname && schedule.offeredCourse?.teacher?.user?.lname
                                            ? `${schedule.offeredCourse.teacher.user.fname} ${schedule.offeredCourse.teacher.user.lname}`
                                            : 'N/A'}
                                    </td>
                                    <td>{schedule.dayOfWeek}</td>
                                    <td>{formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}</td>
                                    <td>{schedule.classroom?.roomNumber || 'N/A'} ({schedule.classroom?.building})</td>
                                    <td>
                                        <span className={schedule.isActive ? 'status-active' : 'status-inactive'}>
                                            {schedule.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td>
                                        <button onClick={() => handleEdit(schedule)} className="btn-edit">
                                            Edit
                                        </button>
                                        {schedule.isActive && (
                                            <button onClick={() => handleDeactivate(schedule.scheduleId)} className="btn-warning">
                                                Deactivate
                                            </button>
                                        )}
                                        <button onClick={() => handleDelete(schedule.scheduleId)} className="btn-delete">
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

export default ScheduleManagement;
