import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function LoginPage({ onLogin }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })

  function handleSubmit(event) {
    event.preventDefault()

    const fallbackName = form.email.split('@')[0] || 'User'
    onLogin({
      name: fallbackName.charAt(0).toUpperCase() + fallbackName.slice(1),
      role: 'student',
    })
    navigate('/home')
  }

  return (
    <main className="flex min-h-[calc(100vh-81px)] items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
        <p className="text-sm uppercase tracking-[0.35em] text-brand-600">
          Soo dhawoow
        </p>
        <h1 className="mt-4 font-display text-4xl text-slate-950">Sign in</h1>
        <p className="mt-3 text-slate-500">
          Continue into the Hage Hub community.
        </p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm text-slate-600">
            Email
            <input
              type="email"
              required
              value={form.email}
              onChange={(event) =>
                setForm((current) => ({ ...current, email: event.target.value }))
              }
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-stone-50 px-4 py-3 outline-none transition focus:border-brand-500"
            />
          </label>

          <label className="block text-sm text-slate-600">
            Password
            <input
              type="password"
              required
              value={form.password}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  password: event.target.value,
                }))
              }
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-stone-50 px-4 py-3 outline-none transition focus:border-brand-500"
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-full bg-brand-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-brand-600"
          >
            Sign in
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-500">
          New here?{' '}
          <Link to="/signup" className="font-medium text-brand-700">
            Create an account
          </Link>
        </p>
      </div>
    </main>
  )
}

export default LoginPage
