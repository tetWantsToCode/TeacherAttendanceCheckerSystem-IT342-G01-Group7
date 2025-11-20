import React, { useState } from 'react'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'

export default function App() {
  const [page, setPage] = useState('register') // default matches previous behavior

  function navigate(to) {
    setPage(to)
    // scroll to top when navigating
    window.scrollTo(0, 0)
  }

export default function App() {
  // Optionally, you can use state for navigation between login/register and dashboards
  // For now, use routing for all main pages
  return (
    <>
      {page === 'login' && <Login onNavigate={navigate} />}
      {page === 'register' && <Register onNavigate={navigate} />}
    </>
  )
}
