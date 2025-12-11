import React, { useState, useEffect } from 'react';
import { api } from '../utils/api-utils';
import '../css/AdminDashboard.css';

const ClassroomManagement = () => {
    const [classrooms, setClassrooms] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        roomNumber: '',
        building: '',
        capacity: '',
        roomType: 'LECTURE'
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('room'); // room, building, capacity, type
    const [filterType, setFilterType] = useState('all');

    const roomTypes = ['LECTURE', 'LABORATORY', 'COMPUTER_LAB', 'LIBRARY', 'AUDITORIUM', 'GYM', 'OTHER'];

    useEffect(() => {
        fetchClassrooms();
    }, []);

    const fetchClassrooms = async () => {
        const result = await api.get('/classrooms');
        if (result.success) {
            setClassrooms(result.data);
        } else {
            alert('Failed to fetch classrooms: ' + result.error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            roomNumber: formData.roomNumber,
            building: formData.building,
            capacity: parseInt(formData.capacity),
            roomType: formData.roomType
        };

        const result = editingId
            ? await api.put(`/classrooms/${editingId}`, payload)
            : await api.post('/classrooms', payload);

        if (result.success) {
            alert(`Classroom ${editingId ? 'updated' : 'created'} successfully!`);
            resetForm();
            fetchClassrooms();
        } else {
            alert('Failed to save classroom: ' + result.error);
        }
    };

    const handleEdit = (classroom) => {
        setFormData({
            roomNumber: classroom.roomNumber,
            building: classroom.building,
            capacity: classroom.capacity,
            roomType: classroom.roomType
        });
        setEditingId(classroom.classroomId);
        setShowForm(true);
    };

    const handleDelete = async (classroomId) => {
        if (window.confirm('Are you sure you want to delete this classroom?')) {
            const result = await api.delete(`/classrooms/${classroomId}`);
            if (result.success) {
                alert('Classroom deleted successfully!');
                fetchClassrooms();
            } else {
                alert('Failed to delete classroom: ' + result.error);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            roomNumber: '',
            building: '',
            capacity: '',
            roomType: 'LECTURE'
        });
        setEditingId(null);
        setShowForm(false);
    };

    return (
        <div className="admin-container">
            <h2>Classroom Management</h2>
            
            <button 
                onClick={() => setShowForm(!showForm)} 
                className="btn-primary"
                style={{ marginBottom: '20px' }}
            >
                {showForm ? 'Cancel' : 'Add New Classroom'}
            </button>

            {showForm && (
                <div className="form-container">
                    <h3>{editingId ? 'Edit Classroom' : 'Add New Classroom'}</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Room Number: *</label>
                            <input
                                type="text"
                                value={formData.roomNumber}
                                onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                                placeholder="e.g., 101, LAB-A, ROOM-305"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Building: *</label>
                            <input
                                type="text"
                                value={formData.building}
                                onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                                placeholder="e.g., Engineering Building, Main Hall"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Capacity: *</label>
                            <input
                                type="number"
                                value={formData.capacity}
                                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                                min="1"
                                placeholder="Number of students"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Room Type: *</label>
                            <select
                                value={formData.roomType}
                                onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                                required
                            >
                                {roomTypes.map(type => (
                                    <option key={type} value={type}>
                                        {type.replace('_', ' ')}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn-primary">
                                {editingId ? 'Update' : 'Create'} Classroom
                            </button>
                            <button type="button" onClick={resetForm} className="btn-secondary">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="table-container">
                <h3>Classrooms List</h3>
                
                {/* Search, Sort, and Filter Controls */}
                <div style={{ marginBottom: '20px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '10px' }}>
                    <input
                        type="text"
                        placeholder="Search by room number, building..."
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
                        <option value="room">Sort: Room Number</option>
                        <option value="building">Sort: Building</option>
                        <option value="capacity">Sort: Capacity</option>
                        <option value="type">Sort: Room Type</option>
                    </select>
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        style={{
                            padding: '10px',
                            borderRadius: '6px',
                            border: '1px solid #ccc',
                            fontSize: '14px'
                        }}
                    >
                        <option value="all">All Room Types</option>
                        {roomTypes.map(type => (
                            <option key={type} value={type}>{type.replace('_', ' ')}</option>
                        ))}
                    </select>
                </div>
                
                <table>
                    <thead>
                        <tr>
                            <th>Room Number</th>
                            <th>Building</th>
                            <th>Capacity</th>
                            <th>Room Type</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {classrooms.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center' }}>No classrooms found</td>
                            </tr>
                        ) : (
                            classrooms
                                .filter(room => {
                                    const search = searchTerm.toLowerCase();
                                    const matchesSearch = room.roomNumber?.toLowerCase().includes(search) ||
                                                         room.building?.toLowerCase().includes(search);
                                    const matchesType = filterType === 'all' || room.roomType === filterType;
                                    return matchesSearch && matchesType;
                                })
                                .sort((a, b) => {
                                    if (sortBy === 'room') {
                                        return (a.roomNumber || '').localeCompare(b.roomNumber || '');
                                    } else if (sortBy === 'building') {
                                        return (a.building || '').localeCompare(b.building || '');
                                    } else if (sortBy === 'capacity') {
                                        return (a.capacity || 0) - (b.capacity || 0);
                                    } else {
                                        return (a.roomType || '').localeCompare(b.roomType || '');
                                    }
                                })
                                .map(room => (
                                <tr key={room.classroomId}>
                                    <td>{room.roomNumber}</td>
                                    <td>{room.building}</td>
                                    <td>{room.capacity}</td>
                                    <td>{room.roomType}</td>
                                    <td>
                                        <button onClick={() => handleEdit(room)} className="btn-edit">
                                            Edit
                                        </button>
                                        <button onClick={() => handleDelete(room.classroomId)} className="btn-delete">
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

export default ClassroomManagement;
