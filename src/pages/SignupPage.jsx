import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const roleOptions = ['Student', 'Mentor']

const COUNTRIES = [
  "Somalia",
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda",
  "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain",
  "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
  "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria",
  "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada",
  "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros",
  "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark",
  "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador",
  "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji",
  "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece",
  "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras",
  "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Italy",
  "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait",
  "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya",
  "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia",
  "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius",
  "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco",
  "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand",
  "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman",
  "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru",
  "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda",
  "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa",
  "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia",
  "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands",
  "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka",
  "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan",
  "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago",
  "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine",
  "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan",
  "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe",
]

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
            <select name="country" value={form.country} onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-stone-50 px-4 py-3 outline-none transition focus:border-brand-500"
            >
              <option value="">Select your country</option>
              {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
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
