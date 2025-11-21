import React, { useState } from 'react';

const AddClassForm = ({ teachers, onAdd }) => {
  const [className, setClassName] = useState('');
  const [room, setRoom] = useState('');
  const [teacher, setTeacher] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!className || !room || !teacher) {
      alert('Please fill out all fields.');
      return;
    }

    onAdd({ className, room, teacher });

    setClassName('');
    setRoom('');
    setTeacher('');
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>Add New Class</h2>

      <input 
        type="text"
        placeholder="Class Name"
        value={className}
        onChange={(e) => setClassName(e.target.value)}
      />

      <input 
        type="text"
        placeholder="Room Number"
        value={room}
        onChange={(e) => setRoom(e.target.value)}
      />

      <select value={teacher} onChange={(e) => setTeacher(e.target.value)}>
        <option value="">Assign Teacher</option>
        {teachers.map(t => (
          <option key={t.id} value={t.name}>{t.name}</option>
        ))}
      </select>

      <button type="submit">Add Class</button>
    </form>
  );
};

export default AddClassForm;
