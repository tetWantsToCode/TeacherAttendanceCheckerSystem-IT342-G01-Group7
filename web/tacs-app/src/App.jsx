import React, { useState } from 'react'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import TempPage from './pages/TempPage.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';

export default function App() {
  const [page, setPage] = useState('login') // or 'register' as default

  function navigate(to) {
    setPage(to)
    window.scrollTo(0, 0)
  }

  return (
    <GoogleOAuthProvider clientId="1032045816890-72lk7isilq0n6gd11m23gfd01u4kb7gm.apps.googleusercontent.com">
      {page === 'login' && <Login onNavigate={navigate} />}
      {page === 'register' && <Register onNavigate={navigate} />}
      {page === 'temp' && <TempPage />}
    </GoogleOAuthProvider>
  )
}