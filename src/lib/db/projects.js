import { supabase } from '../supabase'

export async function fetchProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function insertProject(project) {
  const { data, error } = await supabase
    .from('projects')
    .insert([project])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function joinProject(projectId, userId, userName) {
  const { error } = await supabase
    .from('project_members')
    .insert([{
      project_id: projectId,
      user_id: userId,
      user_name: userName,
    }])
  if (error && error.code !== '23505') throw error

  await supabase.rpc('increment_project_members', { project_id: projectId })
}

export async function fetchUserProjects(userId) {
  const { data } = await supabase
    .from('project_members')
    .select('project_id')
    .eq('user_id', userId)
  return data?.map(d => d.project_id) || []
}

export async function fetchProjectMembers(projectId) {
  const { data } = await supabase
    .from('project_members')
    .select('user_name, user_id, created_at')
    .eq('project_id', projectId)
    .order('created_at', { ascending: true })
  return data || []
}

export async function fetchTopBuilders() {
  const { data } = await supabase
    .from('project_members')
    .select('user_name, user_id')
  if (!data || data.length === 0) return []
  const counts = {}
  for (const row of data) {
    const key = row.user_id || row.user_name
    if (!counts[key]) counts[key] = { user_name: row.user_name || 'Builder', count: 0 }
    counts[key].count++
  }
  return Object.values(counts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
}
