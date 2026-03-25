import HageHubWorkspace from './HageHubWorkspace'

function DashboardPage({ user, onLogout }) {
  return <HageHubWorkspace user={user} onLogout={onLogout} />
}

export default DashboardPage
