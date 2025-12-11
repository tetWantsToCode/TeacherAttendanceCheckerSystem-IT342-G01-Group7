import React, { useState, useEffect } from 'react';
import { api } from '../utils/api-utils';
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
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('course'); // course, teacher, day, time
    const [filterDay, setFilterDay] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');

    const daysOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        await Promise.all([
            fetchSchedules(),
            fetchOfferedCourses(),
            fetchClassrooms()
        ]);
    };

    const fetchSchedules = async () => {
        const result = await api.get('/schedules');
        if (result.success) {
            setSchedules(result.data);
        } else {
            alert('Failed to fetch schedules: ' + result.error);
        }
    };

    const fetchOfferedCourses = async () => {
        const result = await api.get('/offered-courses');
        if (result.success) setOfferedCourses(result.data);
    };

    const fetchClassrooms = async () => {
        const result = await api.get('/classrooms');
        if (result.success) setClassrooms(result.data);
    };

    const checkConflicts = async (classroomId, dayOfWeek, startTime, endTime) => {
        const result = await api.post('/schedules/check-conflicts', {
            classroomId: parseInt(classroomId),
            dayOfWeek,
            startTime,
            endTime
        });
        return result.success ? result.data : [];
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

        const payload = {
            offeredCourse: { offeredCourseId: parseInt(formData.offeredCourse) },
            classroom: { classroomId: parseInt(formData.classroom) },
            dayOfWeek: formData.dayOfWeek,
            startTime: formData.startTime,
            endTime: formData.endTime,
            isActive: formData.isActive
        };

        const result = editingId
            ? await api.put(`/schedules/${editingId}`, payload)
            : await api.post('/schedules', payload);

        if (result.success) {
            alert(`Schedule ${editingId ? 'updated' : 'created'} successfully!`);
            resetForm();
            fetchSchedules();
        } else {
            alert('Failed to save schedule: ' + result.error);
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
            const result = await api.put(`/schedules/${scheduleId}/deactivate`, {});
            if (result.success) {
                alert('Schedule deactivated successfully!');
                fetchSchedules();
            } else {
                alert('Failed to deactivate schedule: ' + result.error);
            }
        }
    };

    const handleDelete = async (scheduleId) => {
        console.log('Attempting to delete schedule with ID:', scheduleId);
        if (window.confirm('Are you sure you want to delete this schedule?')) {
            console.log('Delete confirmed, calling API...');
            const result = await api.delete(`/schedules/${scheduleId}`);
            console.log('Delete API result:', result);
            if (result.success) {
                alert('Schedule deleted successfully!');
                fetchSchedules();
            } else {
                console.error('Delete failed:', result.error, result.details);
                alert('Failed to delete schedule: ' + result.error);
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

    const handleOfferedCourseChange = (offeredCourseId) => {
        setFormData({
            ...formData,
            offeredCourse: offeredCourseId
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
                                onChange={(e) => handleOfferedCourseChange(e.target.value)}
                                required
                            >
                                <option value="">Select Offered Course</option>
                                {offeredCourses.map(oc => {
                                    const existingSchedules = schedules.filter(s => s.offeredCourse?.offeredCourseId === oc.offeredCourseId);
                                    const scheduleCount = existingSchedules.length;
                                    const scheduleNote = oc.schedule ? ` - ${oc.schedule}` : '';
                                    return (
                                        <option key={oc.offeredCourseId} value={oc.offeredCourseId}>
                                            {oc.course?.courseCode || 'N/A'} - {oc.course?.courseName || 'Unknown'} 
                                            ({oc.teacher?.user?.fname} {oc.teacher?.user?.lname}) - Section {oc.section || 'N/A'}
                                            {scheduleNote}
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
                
                {/* Search, Sort, and Filter Controls */}
                <div style={{ marginBottom: '20px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '10px' }}>
                    <input
                        type="text"
                        placeholder="Search by course, teacher, classroom..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            padding: '10px',
                            borderRadius: '6px',
                            border: '1px solid #ccc',
                            fontSize: '14px'
                        }}
                    />
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        style={{
                            padding: '10px',
                            borderRadius: '6px',
                            border: '1px solid #ccc',
                            fontSize: '14px'
                        }}
                    >
                        <option value="course">Sort: Course</option>
                        <option value="teacher">Sort: Teacher</option>
                        <option value="day">Sort: Day</option>
                        <option value="time">Sort: Time</option>
                    </select>
                    <select
                        value={filterDay}
                        onChange={(e) => setFilterDay(e.target.value)}
                        style={{
                            padding: '10px',
                            borderRadius: '6px',
                            border: '1px solid #ccc',
                            fontSize: '14px'
                        }}
                    >
                        <option value="all">All Days</option>
                        {daysOfWeek.map(day => (
                            <option key={day} value={day}>{day}</option>
                        ))}
                    </select>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        style={{
                            padding: '10px',
                            borderRadius: '6px',
                            border: '1px solid #ccc',
                            fontSize: '14px'
                        }}
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active Only</option>
                        <option value="inactive">Inactive Only</option>
                    </select>
                </div>
                
                <table>
                    <thead>
                        <tr>
                            <th style={{ fontWeight: '600' }}>Course</th>
                            <th style={{ fontWeight: '600' }}>Teacher</th>
                            <th style={{ fontWeight: '600' }}>Day</th>
                            <th style={{ fontWeight: '600' }}>Time</th>
                            <th style={{ fontWeight: '600' }}>Classroom</th>
                            <th style={{ fontWeight: '600' }}>Status</th>
                            <th style={{ fontWeight: '600' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {schedules.length === 0 ? (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center' }}>No schedules found</td>
                            </tr>
                        ) : (
                            schedules
                                .filter(schedule => {
                                    const search = searchTerm.toLowerCase();
                                    const matchesSearch = schedule.offeredCourse?.course?.courseName?.toLowerCase().includes(search) ||
                                                         schedule.offeredCourse?.teacher?.user?.fname?.toLowerCase().includes(search) ||
                                                         schedule.offeredCourse?.teacher?.user?.lname?.toLowerCase().includes(search) ||
                                                         schedule.classroom?.roomNumber?.toLowerCase().includes(search);
                                    const matchesDay = filterDay === 'all' || schedule.dayOfWeek === filterDay;
                                    const matchesStatus = filterStatus === 'all' ||
                                                         (filterStatus === 'active' && schedule.isActive) ||
                                                         (filterStatus === 'inactive' && !schedule.isActive);
                                    return matchesSearch && matchesDay && matchesStatus;
                                })
                                .sort((a, b) => {
                                    if (sortBy === 'course') {
                                        return (a.offeredCourse?.course?.courseName || '').localeCompare(b.offeredCourse?.course?.courseName || '');
                                    } else if (sortBy === 'teacher') {
                                        const nameA = `${a.offeredCourse?.teacher?.user?.fname} ${a.offeredCourse?.teacher?.user?.lname}`;
                                        const nameB = `${b.offeredCourse?.teacher?.user?.fname} ${b.offeredCourse?.teacher?.user?.lname}`;
                                        return nameA.localeCompare(nameB);
                                    } else if (sortBy === 'day') {
                                        const dayOrder = { 'MONDAY': 1, 'TUESDAY': 2, 'WEDNESDAY': 3, 'THURSDAY': 4, 'FRIDAY': 5, 'SATURDAY': 6, 'SUNDAY': 7 };
                                        return (dayOrder[a.dayOfWeek] || 0) - (dayOrder[b.dayOfWeek] || 0);
                                    } else {
                                        return (a.startTime || '').localeCompare(b.startTime || '');
                                    }
                                })
                                .map(schedule => (
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
