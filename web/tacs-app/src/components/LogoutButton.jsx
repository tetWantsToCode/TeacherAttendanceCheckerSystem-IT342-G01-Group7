import React from 'react';

const LogoutButton = () => {
  function handleLogout() {
    // Clear storage; adjust if you use a different auth storage approach
    localStorage.clear();
    sessionStorage.clear();
    // Redirect to login/home page
    window.location.href = '/';
  }

  return (
    <button
      onClick={handleLogout}
      style={{
        background: '#25364a',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        padding: '0.5rem 1.2rem',
        cursor: 'pointer'
      }}
    >
      Logout
    </button>
  );
};

export default LogoutButton;