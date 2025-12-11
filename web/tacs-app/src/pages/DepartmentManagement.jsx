import React, { useState, useEffect } from 'react';
import { api } from '../utils/api-utils';
import '../css/AdminDashboard.css';

const DepartmentManagement = () => {
    const [departments, setDepartments] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        departmentCode: '',
        departmentName: ''
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('code'); // code, name

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        const result = await api.get('/departments');
        if (result.success) {
            setDepartments(result.data);
        } else {
            alert('Failed to fetch departments: ' + result.error);
        }
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = editingId
            ? await api.put(`/departments/${editingId}`, formData)
            : await api.post('/departments', formData);

        if (result.success) {
            alert(`Department ${editingId ? 'updated' : 'created'} successfully!`);
            resetForm();
            fetchDepartments();
        } else {
            alert('Failed to save department: ' + result.error);
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
            const result = await api.delete(`/departments/${departmentId}`);
            if (result.success) {
                alert('Department deleted successfully!');
                fetchDepartments();
            } else {
                alert('Failed to delete department: ' + result.error);
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
                
                {/* Search and Sort Controls */}
                <div style={{ 
                    marginBottom: '20px', 
                    display: 'flex', 
                    gap: '10px',
                    alignItems: 'stretch'
                }}>
                    <input
                        type="text"
                        placeholder="Search by department code or name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            flex: '1',
                            padding: '10px 15px',
                            borderRadius: '6px',
                            border: '1px solid #ddd',
                            fontSize: '14px',
                            minHeight: '42px'
                        }}
                    />
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        style={{
                            padding: '10px 15px',
                            borderRadius: '6px',
                            border: '1px solid #ddd',
                            fontSize: '14px',
                            minWidth: '200px',
                            cursor: 'pointer',
                            minHeight: '42px'
                        }}
                    >
                        <option value="code">Sort: Code (A-Z)</option>
                        <option value="name">Sort: Name (A-Z)</option>
                    </select>
                </div>
                
                <table>
                    <thead>
                        <tr>
                            <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: '600', width: '15%' }}>Code</th>
                            <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: '600', width: '55%' }}>Name</th>
                            <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: '600', width: '30%' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {departments.length === 0 ? (
                            <tr>
                                <td colSpan="3" style={{ textAlign: 'center', padding: '14px 16px' }}>No departments found</td>
                            </tr>
                        ) : (
                            departments
                                .filter(dept => {
                                    const search = searchTerm.toLowerCase();
                                    return dept.departmentCode?.toLowerCase().includes(search) ||
                                           dept.departmentName?.toLowerCase().includes(search);
                                })
                                .sort((a, b) => {
                                    if (sortBy === 'code') {
                                        return (a.departmentCode || '').localeCompare(b.departmentCode || '');
                                    } else {
                                        return (a.departmentName || '').localeCompare(b.departmentName || '');
                                    }
                                })
                                .map(dept => (
                                <tr key={dept.departmentId}>
                                    <td style={{ padding: '14px 16px', verticalAlign: 'middle', width: '15%' }}>{dept.departmentCode}</td>
                                    <td style={{ padding: '14px 16px', verticalAlign: 'middle', width: '55%' }}>{dept.departmentName}</td>
                                    <td style={{ padding: '14px 16px', verticalAlign: 'middle', width: '30%' }}>
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
