import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const roleOptions = ['Student', 'Mentor']

function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', country: '', role: 'Student' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm((c) => ({ ...c, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setLoading(true)
    const { error: err } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          name: form.name.trim(),
          role: form.role === 'Mentor' ? 'mentor' : 'student',
          country: form.country.trim(),
        },
      },
    })
    if (err) {
      setError(err.message)
      setLoading(false)
    }
    // On success, onAuthStateChange in App.jsx sets the user → GuestRoute
    // redirects to /home automatically. No manual navigate() needed.
  }

  return (
    <main className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
        <p className="text-sm uppercase tracking-[0.35em] text-brand-600">Join Hage Hub</p>
        <h1 className="mt-4 font-display text-4xl text-slate-950">Create your profile</h1>
        <p className="mt-3 max-w-xl text-slate-500">
          Your account is shared across all sessions — log in from any device.
        </p>

        <form className="mt-8 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
          <label className="block text-sm text-slate-600">
            Full Name
            <input name="name" required value={form.name} onChange={handleChange}
              placeholder="Asha Nuur"
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-stone-50 px-4 py-3 outline-none transition focus:border-brand-500"
            />
          </label>

          <label className="block text-sm text-slate-600">
            Email
            <input name="email" type="email" required value={form.email} onChange={handleChange}
              placeholder="asha@example.com"
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-stone-50 px-4 py-3 outline-none transition focus:border-brand-500"
            />
          </label>

          <label className="block text-sm text-slate-600">
            Password
            <input name="password" type="password" required value={form.password} onChange={handleChange}
              placeholder="Min. 6 characters"
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-stone-50 px-4 py-3 outline-none transition focus:border-brand-500"
            />
          </label>

          <label className="block text-sm text-slate-600">
            Country
            <input name="country" value={form.country} onChange={handleChange}
              placeholder="Somalia, UK, USA…"
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-stone-50 px-4 py-3 outline-none transition focus:border-brand-500"
            />
          </label>

          <label className="block text-sm text-slate-600 sm:col-span-2">
            Role
            <select name="role" value={form.role} onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-stone-50 px-4 py-3 outline-none transition focus:border-brand-500"
            >
              {roleOptions.map((r) => <option key={r}>{r}</option>)}
            </select>
          </label>

          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 sm:col-span-2">{error}</p>
          )}

          <button type="submit" disabled={loading}
            className="mt-2 w-full rounded-full bg-brand-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-brand-600 disabled:opacity-50 sm:col-span-2"
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-500">
          Already a member?{' '}
          <Link to="/login" className="font-medium text-brand-700">Sign in</Link>
        </p>
      </div>
    </main>
  )
}

export default SignupPage
