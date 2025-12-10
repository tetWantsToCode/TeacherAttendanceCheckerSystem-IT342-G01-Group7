import React, { useState } from 'react';
import { api } from '../utils/api-utils';
import '../css/DataManagement.css';

const DataManagement = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({
    offeredCourses: false,
    schedules: false,
    both: false
  });

  const deleteAllOfferedCourses = async () => {
    setLoading(true);
    try {
      // Use the bulk delete endpoint
      const response = await api.delete('/offered-courses/delete-all');
      
      if (response.success) {
        setResults({
          type: 'success',
          message: 'All offered courses have been deleted successfully!'
        });
      } else {
        setResults({
          type: 'error',
          message: `Failed to delete offered courses: ${response.error}`
        });
      }
    } catch (error) {
      setResults({
        type: 'error',
        message: `Unexpected error: ${error.message}`
      });
    }
    setLoading(false);
    setConfirmDelete({ ...confirmDelete, offeredCourses: false });
  };

  const deleteAllSchedules = async () => {
    setLoading(true);
    try {
      // Use the bulk delete endpoint
      const response = await api.delete('/schedules/delete-all');
      
      if (response.success) {
        setResults({
          type: 'success',
          message: 'All class schedules have been deleted successfully!'
        });
      } else {
        setResults({
          type: 'error',
          message: `Failed to delete schedules: ${response.error}`
        });
      }
    } catch (error) {
      setResults({
        type: 'error',
        message: `Unexpected error: ${error.message}`
      });
    }
    setLoading(false);
    setConfirmDelete({ ...confirmDelete, schedules: false });
  };

  const deleteAllData = async () => {
    setLoading(true);
    setResults({ type: 'info', message: 'Starting deletion process...' });

    try {
      // First delete all schedules (since they depend on offered courses)
      const schedulesResponse = await api.delete('/schedules/delete-all');
      
      if (!schedulesResponse.success) {
        setResults({
          type: 'error',
          message: `Failed to delete schedules: ${schedulesResponse.error}`
        });
        setLoading(false);
        setConfirmDelete({ ...confirmDelete, both: false });
        return;
      }

      setResults({
        type: 'info',
        message: 'Schedules deleted. Now deleting offered courses...'
      });

      // Then delete all offered courses
      const coursesResponse = await api.delete('/offered-courses/delete-all');
      
      if (coursesResponse.success) {
        setResults({
          type: 'success',
          message: 'Successfully deleted all data: All offered courses and schedules have been removed.'
        });
      } else {
        setResults({
          type: 'error',
          message: `Failed to delete offered courses: ${coursesResponse.error}`
        });
      }
    } catch (error) {
      setResults({
        type: 'error',
        message: `Unexpected error: ${error.message}`
      });
    }

    setLoading(false);
    setConfirmDelete({ ...confirmDelete, both: false });
  };

  return (
    <div className="data-management-container">
      <h1>Data Management</h1>
      <div className="warning-banner">
        <strong>⚠️ Warning:</strong> These actions cannot be undone. Please proceed with caution.
      </div>

      <div className="management-section">
        <h2>Delete All Offered Courses</h2>
        <p>This will remove all offered courses from the database.</p>
        {!confirmDelete.offeredCourses ? (
          <button 
            className="btn-danger"
            onClick={() => setConfirmDelete({ ...confirmDelete, offeredCourses: true })}
            disabled={loading}
          >
            Delete All Offered Courses
          </button>
        ) : (
          <div className="confirm-section">
            <p className="confirm-text">Are you sure? This action cannot be undone.</p>
            <button 
              className="btn-confirm-danger"
              onClick={deleteAllOfferedCourses}
              disabled={loading}
            >
              Yes, Delete All
            </button>
            <button 
              className="btn-cancel"
              onClick={() => setConfirmDelete({ ...confirmDelete, offeredCourses: false })}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="management-section">
        <h2>Delete All Class Schedules</h2>
        <p>This will remove all class schedules from the database.</p>
        {!confirmDelete.schedules ? (
          <button 
            className="btn-danger"
            onClick={() => setConfirmDelete({ ...confirmDelete, schedules: true })}
            disabled={loading}
          >
            Delete All Schedules
          </button>
        ) : (
          <div className="confirm-section">
            <p className="confirm-text">Are you sure? This action cannot be undone.</p>
            <button 
              className="btn-confirm-danger"
              onClick={deleteAllSchedules}
              disabled={loading}
            >
              Yes, Delete All
            </button>
            <button 
              className="btn-cancel"
              onClick={() => setConfirmDelete({ ...confirmDelete, schedules: false })}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="management-section danger-zone">
        <h2>⚠️ Danger Zone: Delete All Data</h2>
        <p>This will remove ALL offered courses and schedules from the database.</p>
        {!confirmDelete.both ? (
          <button 
            className="btn-danger-large"
            onClick={() => setConfirmDelete({ ...confirmDelete, both: true })}
            disabled={loading}
          >
            Delete All Offered Courses & Schedules
          </button>
        ) : (
          <div className="confirm-section">
            <p className="confirm-text">⚠️ <strong>FINAL WARNING:</strong> This will delete ALL offered courses and schedules. Are you absolutely sure?</p>
            <button 
              className="btn-confirm-danger"
              onClick={deleteAllData}
              disabled={loading}
            >
              Yes, Delete Everything
            </button>
            <button 
              className="btn-cancel"
              onClick={() => setConfirmDelete({ ...confirmDelete, both: false })}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Processing...</p>
        </div>
      )}

      {results && (
        <div className={`results-section ${results.type}`}>
          <h3>Results</h3>
          <p>{results.message}</p>
          {results.details && (
            <div className="error-details">
              <h4>Errors:</h4>
              <ul>
                {results.details.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DataManagement;
