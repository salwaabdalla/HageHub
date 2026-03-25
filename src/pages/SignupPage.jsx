import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const roleOptions = ['Student', 'Junior', 'Mid', 'Senior', 'Mentor']

function SignupPage({ onSignup }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    country: '',
    role: 'Student',
  })

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    onSignup({
      name: form.name || 'User',
      role: form.role === 'Mentor' ? 'mentor' : 'student',
    })
    navigate('/home')
  }

  return (
    <main className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
        <p className="text-sm uppercase tracking-[0.35em] text-brand-600">
          Join Hage Hub
        </p>
        <h1 className="mt-4 font-display text-4xl text-slate-950">Create your profile</h1>
        <p className="mt-3 max-w-xl text-slate-500">
          Start simple. Your local profile will personalize the experience
          across the app.
        </p>

        <form className="mt-8 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
          <label className="block text-sm text-slate-600">
            Name
            <input
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-stone-50 px-4 py-3 outline-none transition focus:border-brand-500"
            />
          </label>

          <label className="block text-sm text-slate-600">
            Email
            <input
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-stone-50 px-4 py-3 outline-none transition focus:border-brand-500"
            />
          </label>

          <label className="block text-sm text-slate-600">
            Password
            <input
              name="password"
              type="password"
              required
              value={form.password}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-stone-50 px-4 py-3 outline-none transition focus:border-brand-500"
            />
          </label>

          <label className="block text-sm text-slate-600">
            Country
            <input
              name="country"
              required
              value={form.country}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-stone-50 px-4 py-3 outline-none transition focus:border-brand-500"
            />
          </label>

          <label className="block text-sm text-slate-600 sm:col-span-2">
            Role
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-stone-50 px-4 py-3 outline-none transition focus:border-brand-500"
            >
              {roleOptions.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </label>

          <button
            type="submit"
            className="mt-2 w-full rounded-full bg-brand-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-brand-600 sm:col-span-2"
          >
            Create account
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-500">
          Already a member?{' '}
          <Link to="/login" className="font-medium text-brand-700">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  )
}

export default SignupPage
