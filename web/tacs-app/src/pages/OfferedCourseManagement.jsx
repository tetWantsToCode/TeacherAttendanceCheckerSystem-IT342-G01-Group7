import React, { useState, useEffect } from 'react';
import { api } from '../utils/api-utils';
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
        semester: 'FIRST_SEM',
        section: '',
        units: ''
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('course'); // course, teacher, section, semester
    const [filterSemester, setFilterSemester] = useState('all');

    const semesters = ['FIRST_SEM', 'SECOND_SEM', 'SUMMER'];

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        await Promise.all([
            fetchOfferedCourses(),
            fetchCourses(),
            fetchTeachers(),
            fetchClassrooms()
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

    const fetchClassrooms = async () => {
        const result = await api.get('/classrooms');
        if (result.success) setClassrooms(result.data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            course: { courseId: parseInt(formData.course) },
            teacher: { teacherId: formData.teacher },
            classroom: { classroomId: parseInt(formData.classroom) },
            semester: formData.semester,
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
            classroom: offeredCourse.classroom?.classroomId || '',
            semester: offeredCourse.semester || 'FIRST_SEM',
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
            classroom: '',
            semester: 'FIRST_SEM',
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
                Define which courses are offered each semester, assign teachers, and set classrooms.
            </p>
            <div style={{ background: '#e3f2fd', border: '1px solid #2196f3', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                <strong>ℹ️ Note:</strong> After creating an Offered Course, go to <strong>Class Schedules</strong> to set the specific 
                days and times when this course meets. You can create multiple schedules for courses that meet on different days 
                (e.g., Monday/Wednesday lectures, Thursday labs).
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
                                    console.log('Selected course:', selectedCourse);
                                    console.log('Units from course:', selectedCourse?.units);
                                    console.log('Semester from course:', selectedCourse?.semester);
                                    
                                    if (selectedCourse) {
                                        const newFormData = { 
                                            ...formData, 
                                            course: e.target.value,
                                            units: selectedCourse.units?.toString() || '',
                                            semester: selectedCourse.semester || 'FIRST_SEM'
                                        };
                                        console.log('New form data:', newFormData);
                                        setFormData(newFormData);
                                    } else {
                                        setFormData({ 
                                            ...formData, 
                                            course: e.target.value,
                                            units: '',
                                            semester: 'FIRST_SEM'
                                        });
                                    }
                                }}
                                required
                            >
                                <option value="">Select Course</option>
                                {courses.map(course => (
                                    <option key={course.courseId} value={course.courseId}>
                                        {course.courseCode} - {course.courseName} ({course.units || 'N/A'} units, {course.semester || 'N/A'})
                                    </option>
                                ))}
                            </select>
                            {formData.course && (
                                <small style={{ color: '#666', display: 'block', marginTop: '5px' }}>
                                    ℹ️ Units and semester auto-filled from selected course
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
                
                {/* Search, Sort, and Filter Controls */}
                <div style={{ marginBottom: '20px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '10px' }}>
                    <input
                        type="text"
                        placeholder="Search by course name, teacher, section..."
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
                        <option value="course">Sort: Course Name</option>
                        <option value="teacher">Sort: Teacher</option>
                        <option value="section">Sort: Section</option>
                        <option value="semester">Sort: Semester</option>
                    </select>
                    <select
                        value={filterSemester}
                        onChange={(e) => setFilterSemester(e.target.value)}
                        style={{
                            padding: '10px',
                            borderRadius: '6px',
                            border: '1px solid #ccc',
                            fontSize: '14px'
                        }}
                    >
                        <option value="all">All Semesters</option>
                        {semesters.map(sem => (
                            <option key={sem} value={sem}>{sem.replace('_', ' ')}</option>
                        ))}
                    </select>
                </div>
                
                <table>
                    <thead>
                        <tr>
                            <th>Course Code</th>
                            <th>Course Name</th>
                            <th>Teacher</th>
                            <th>Classroom</th>
                            <th>Section</th>
                            <th>Semester</th>
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
                            offeredCourses
                                .filter(oc => {
                                    const search = searchTerm.toLowerCase();
                                    const matchesSearch = oc.course?.courseName?.toLowerCase().includes(search) ||
                                                         oc.teacher?.user?.fname?.toLowerCase().includes(search) ||
                                                         oc.teacher?.user?.lname?.toLowerCase().includes(search) ||
                                                         oc.section?.toLowerCase().includes(search);
                                    const matchesSemester = filterSemester === 'all' || oc.semester === filterSemester;
                                    return matchesSearch && matchesSemester;
                                })
                                .sort((a, b) => {
                                    if (sortBy === 'course') {
                                        return (a.course?.courseName || '').localeCompare(b.course?.courseName || '');
                                    } else if (sortBy === 'teacher') {
                                        const nameA = `${a.teacher?.user?.fname} ${a.teacher?.user?.lname}`;
                                        const nameB = `${b.teacher?.user?.fname} ${b.teacher?.user?.lname}`;
                                        return nameA.localeCompare(nameB);
                                    } else if (sortBy === 'section') {
                                        return (a.section || '').localeCompare(b.section || '');
                                    } else {
                                        return (a.semester || '').localeCompare(b.semester || '');
                                    }
                                })
                                .map(oc => (
                                <tr key={oc.offeredCourseId}>
                                    <td>{oc.course?.courseCode || 'N/A'}</td>
                                    <td>{oc.course?.courseName || 'N/A'}</td>
                                    <td>{oc.teacher?.user?.fname} {oc.teacher?.user?.lname}</td>
                                    <td>{oc.classroom?.roomNumber} - {oc.classroom?.building}</td>
                                    <td>{oc.section || 'N/A'}</td>
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
