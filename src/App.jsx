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
import JobsPage from './pages/JobsPage'
import { supabase } from './lib/supabase'

// Build user object from Supabase auth — uses metadata, no DB query needed
function userFromSession(supabaseUser) {
  if (!supabaseUser) return null
  const meta = supabaseUser.user_metadata ?? {}
  return {
    id: supabaseUser.id,
    email: supabaseUser.email,
    name: meta.name || supabaseUser.email?.split('@')[0] || 'User',
    role: meta.role || 'student',
    country: meta.country || '',
    metadata: meta,
  }
}

function ProtectedRoute({ user, loading, children }) {
  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontSize: 14, color: '#8a9bbf' }}>Loading…</p>
      </div>
    )
  }
  if (!user) return <Navigate to="/login" replace />
  return children
}

function GuestRoute({ user, loading, children }) {
  if (loading) return null
  if (user) return <Navigate to="/home" replace />
  return children
}

function AppRoutes({ user, setUser, loading }) {
  const { pathname } = useLocation()
  const hideGlobalNavbar = [
    '/', '/home', '/learn', '/ask', '/ai',
    '/connect', '/build', '/stories', '/jobs', '/profile', '/settings',
  ].includes(pathname)

  async function handleLogout() {
    await supabase.auth.signOut()
    setUser(null)
  }

  const pageProps = { user, onLogout: handleLogout }

  return (
    <div className={hideGlobalNavbar ? undefined : 'relative min-h-screen bg-stone-50'}>
      {!hideGlobalNavbar && (
        <>
          <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,_rgba(65,137,221,0.2),_transparent_60%)]" />
          <Navbar user={user} />
        </>
      )}
      <Routes>
        <Route path="/" element={<Landing />} />

        <Route path="/login"  element={<GuestRoute user={user} loading={loading}><LoginPage  onLogin={setUser}  /></GuestRoute>} />
        <Route path="/signup" element={<GuestRoute user={user} loading={loading}><SignupPage onSignup={setUser} /></GuestRoute>} />

        <Route path="/home"     element={<ProtectedRoute user={user} loading={loading}><DashboardPage   {...pageProps} /></ProtectedRoute>} />
        <Route path="/learn"    element={<ProtectedRoute user={user} loading={loading}><LearnPage        {...pageProps} /></ProtectedRoute>} />
        <Route path="/ask"      element={<ProtectedRoute user={user} loading={loading}><AskPage          {...pageProps} /></ProtectedRoute>} />
        <Route path="/ai"       element={<ProtectedRoute user={user} loading={loading}><AIExplainerPage  {...pageProps} /></ProtectedRoute>} />
        <Route path="/connect"  element={<ProtectedRoute user={user} loading={loading}><ConnectPage      {...pageProps} /></ProtectedRoute>} />
        <Route path="/build"    element={<ProtectedRoute user={user} loading={loading}><BuildPage        {...pageProps} /></ProtectedRoute>} />
        <Route path="/stories"  element={<ProtectedRoute user={user} loading={loading}><StoriesPage      {...pageProps} /></ProtectedRoute>} />
        <Route path="/jobs"     element={<ProtectedRoute user={user} loading={loading}><JobsPage         {...pageProps} /></ProtectedRoute>} />
        <Route path="/profile"  element={<ProtectedRoute user={user} loading={loading}><ProfilePage      {...pageProps} /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute user={user} loading={loading}><SettingsPage     {...pageProps} /></ProtectedRoute>} />
      </Routes>
    </div>
  )
}

function App() {
  const [user, setUser]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    localStorage.removeItem('hh_photo')

    // Restore existing session on page load / refresh
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        if (mounted) {
          setUser(userFromSession(session?.user ?? null))
          setLoading(false)
        }
      })
      .catch(() => {
        // Supabase unreachable — let the user through to login
        if (mounted) setLoading(false)
      })

    // Keep user state in sync with Supabase session events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return
      setUser(userFromSession(session?.user ?? null))
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  return (
    <BrowserRouter>
      <AppRoutes user={user} setUser={setUser} loading={loading} />
    </BrowserRouter>
  )
}

export default App
