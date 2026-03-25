import HageHubWorkspace from './HageHubWorkspace'

function BuildPage({ user, onLogout }) {
  return <HageHubWorkspace user={user} onLogout={onLogout} />
}

export default BuildPage
