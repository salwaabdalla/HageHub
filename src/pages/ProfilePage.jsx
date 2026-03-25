import HageHubWorkspace from './HageHubWorkspace'

function ProfilePage({ user, onLogout }) {
  return <HageHubWorkspace user={user} onLogout={onLogout} />
}

export default ProfilePage
