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
                            classrooms.map(room => (
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
