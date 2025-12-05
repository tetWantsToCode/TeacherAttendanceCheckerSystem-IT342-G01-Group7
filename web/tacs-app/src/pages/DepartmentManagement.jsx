import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/AdminDashboard.css';

const DepartmentManagement = () => {
    const [departments, setDepartments] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        departmentCode: '',
        departmentName: ''
    });

    const API_BASE_URL = 'http://localhost:8080/api';

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            const authData = JSON.parse(localStorage.getItem('auth'));
            const token = authData?.token;
            const response = await axios.get(`${API_BASE_URL}/departments`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDepartments(response.data);
        } catch (error) {
            console.error('Error fetching departments:', error);
            alert('Failed to fetch departments');
        }
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const authData = JSON.parse(localStorage.getItem('auth'));
            const token = authData?.token;

            if (editingId) {
                await axios.put(`${API_BASE_URL}/departments/${editingId}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert('Department updated successfully!');
            } else {
                await axios.post(`${API_BASE_URL}/departments`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert('Department created successfully!');
            }

            resetForm();
            fetchDepartments();
        } catch (error) {
            console.error('Error saving department:', error);
            alert('Failed to save department: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleEdit = (department) => {
        setFormData({
            departmentCode: department.departmentCode,
            departmentName: department.departmentName
        });
        setEditingId(department.departmentId);
        setShowForm(true);
    };



    const handleDelete = async (departmentId) => {
        if (window.confirm('Are you sure you want to delete this department? This cannot be undone.')) {
            try {
                const authData = JSON.parse(localStorage.getItem('auth'));
                const token = authData?.token;
                await axios.delete(`${API_BASE_URL}/departments/${departmentId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert('Department deleted successfully!');
                fetchDepartments();
            } catch (error) {
                console.error('Error deleting department:', error);
                alert('Failed to delete department');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            departmentCode: '',
            departmentName: ''
        });
        setEditingId(null);
        setShowForm(false);
    };

    return (
        <div className="admin-container">
            <h2>Department Management</h2>
            
            <button 
                onClick={() => setShowForm(!showForm)} 
                className="btn-primary"
                style={{ marginBottom: '20px' }}
            >
                {showForm ? 'Cancel' : 'Add New Department'}
            </button>

            {showForm && (
                <div className="form-container">
                    <h3>{editingId ? 'Edit Department' : 'Add New Department'}</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Department Code: *</label>
                            <input
                                type="text"
                                value={formData.departmentCode}
                                onChange={(e) => setFormData({ ...formData, departmentCode: e.target.value })}
                                placeholder="e.g., IT, ENG, MATH"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Department Name: *</label>
                            <input
                                type="text"
                                value={formData.departmentName}
                                onChange={(e) => setFormData({ ...formData, departmentName: e.target.value })}
                                placeholder="e.g., Information Technology"
                                required
                            />
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn-primary">
                                {editingId ? 'Update' : 'Create'} Department
                            </button>
                            <button type="button" onClick={resetForm} className="btn-secondary">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="table-container">
                <h3>Departments List</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Code</th>
                            <th>Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {departments.length === 0 ? (
                            <tr>
                                <td colSpan="3" style={{ textAlign: 'center' }}>No departments found</td>
                            </tr>
                        ) : (
                            departments.map(dept => (
                                <tr key={dept.departmentId}>
                                    <td>{dept.departmentCode}</td>
                                    <td>{dept.departmentName}</td>
                                    <td>
                                        <button onClick={() => handleEdit(dept)} className="btn-edit">
                                            Edit
                                        </button>
                                        <button onClick={() => handleDelete(dept.departmentId)} className="btn-delete">
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

export default DepartmentManagement;
