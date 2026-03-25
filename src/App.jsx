import { useEffect, useState } from 'react'
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom'
import Navbar from './components/Navbar'
import AIExplainerPage from './pages/AIExplainerPage'
import AskPage from './pages/AskPage'
import LearnPage from './pages/LearnPage'
import BuildPage from './pages/BuildPage'
import ConnectPage from './pages/ConnectPage'
import DashboardPage from './pages/DashboardPage'
import Landing from './pages/Landing'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'
import SignupPage from './pages/SignupPage'
import StoriesPage from './pages/StoriesPage'

const USER_STORAGE_KEY = 'hagehub_user'

function readStoredUser() {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const stored = window.localStorage.getItem(USER_STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

function ProtectedRoute({ user, children }) {
  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

function GuestRoute({ user, children }) {
  if (user) {
    return <Navigate to="/home" replace />
  }

  return children
}

function AppRoutes({ user, setUser }) {
  const { pathname } = useLocation()
  const hideGlobalNavbar = [
    '/',
    '/home',
    '/learn',
    '/ask',
    '/ai',
    '/connect',
    '/build',
    '/stories',
    '/profile',
    '/settings',
  ].includes(pathname)

  return (
    <div
      className={
        hideGlobalNavbar ? undefined : 'relative min-h-screen bg-stone-50'
      }
    >
      {!hideGlobalNavbar ? (
        <>
          <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,_rgba(65,137,221,0.2),_transparent_60%)]" />
          <Navbar user={user} />
        </>
      ) : null}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/login"
          element={
            <GuestRoute user={user}>
              <LoginPage onLogin={setUser} />
            </GuestRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <GuestRoute user={user}>
              <SignupPage onSignup={setUser} />
            </GuestRoute>
          }
        />
        <Route
          path="/home"
          element={
              <ProtectedRoute user={user}>
                <DashboardPage user={user} onLogout={() => setUser(null)} />
              </ProtectedRoute>
            }
          />
        <Route
          path="/learn"
          element={
            <ProtectedRoute user={user}>
              <LearnPage user={user} onLogout={() => setUser(null)} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ask"
          element={
            <ProtectedRoute user={user}>
              <AskPage user={user} onLogout={() => setUser(null)} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ai"
          element={
            <ProtectedRoute user={user}>
              <AIExplainerPage user={user} onLogout={() => setUser(null)} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/connect"
          element={
            <ProtectedRoute user={user}>
              <ConnectPage user={user} onLogout={() => setUser(null)} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/build"
          element={
            <ProtectedRoute user={user}>
              <BuildPage user={user} onLogout={() => setUser(null)} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/stories"
          element={
            <ProtectedRoute user={user}>
              <StoriesPage user={user} onLogout={() => setUser(null)} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute user={user}>
              <ProfilePage user={user} onLogout={() => setUser(null)} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute user={user}>
              <SettingsPage user={user} onLogout={() => setUser(null)} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  )
}

function App() {
  const [user, setUser] = useState(() => readStoredUser())

  useEffect(() => {
    if (user) {
      window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
      return
    }

    window.localStorage.removeItem(USER_STORAGE_KEY)
  }, [user])

  return (
    <BrowserRouter>
      <AppRoutes user={user} setUser={setUser} />
    </BrowserRouter>
  )
}

export default App
