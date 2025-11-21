import React from 'react';

const ClassList = ({ classes, onRemove }) => {
  return (
    <div className="list-container">
      <h2>Class List</h2>

      {classes.length === 0 ? (
        <p>No classes added yet.</p>
      ) : (
        <ul className="list">
          {classes.map(c => (
            <li key={c.id} className="list-item">
              <h3>{c.className}</h3>
              <p><strong>Room:</strong> {c.room}</p>
              <p><strong>Teacher:</strong> {c.teacher}</p>
              <button onClick={() => onRemove(c.id)} className="remove-btn">Remove</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ClassList;
