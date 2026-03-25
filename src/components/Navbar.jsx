import { Link, NavLink } from 'react-router-dom'

const links = [
  { label: 'Ask', to: '/ask' },
  { label: 'AI', to: '/ai' },
  { label: 'Connect', to: '/home#connect' },
  { label: 'Build', to: '/home#build' },
]

function Navbar({ user }) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <Link
          to="/"
          className="font-display text-2xl tracking-tight text-slate-950"
        >
          Hage Hub
        </Link>

        <nav className="flex w-full items-center gap-1 overflow-x-auto rounded-full border border-slate-200 bg-white/90 p-1 md:w-auto">
          {links.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm transition ${
                  isActive
                    ? 'bg-brand-500 text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2 self-end md:self-auto">
          {user ? (
            <span className="rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-2 text-sm font-medium text-brand-700">
              {user.name}
            </span>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-full px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="rounded-full bg-brand-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-600"
              >
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
