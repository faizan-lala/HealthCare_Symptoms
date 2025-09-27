import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'

// Components
import Layout from './components/Layout'
import LoadingSpinner from './components/LoadingSpinner'

// Pages
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Symptoms from './pages/Symptoms'
import AddSymptom from './pages/AddSymptom'
import SymptomDetail from './pages/SymptomDetail'
import SymptomEdit from './pages/SymptomEdit'
import Suggestions from './pages/Suggestions'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Routes>
        {/* Public routes */}
        <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Landing />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <Register />} />
        
        {/* Protected routes */}
        <Route path="/" element={user ? <Layout /> : <Navigate to="/login" replace />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="symptoms" element={<Symptoms />} />
          <Route path="symptoms/new" element={<AddSymptom />} />
          <Route path="symptoms/:id" element={<SymptomDetail />} />
          <Route path="symptoms/:id/edit" element={<SymptomEdit />} />
          <Route path="suggestions" element={<Suggestions />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App
