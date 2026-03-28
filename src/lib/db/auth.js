import { supabase } from '../supabase'

/**
 * Sign up a new user with Supabase Auth.
 * The profile row is auto-created via database trigger.
 */
export async function signUp({ email, password, name, role, country }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: name.trim(),
        role: role === 'Mentor' ? 'mentor' : 'student',
        country: country.trim(),
      },
    },
  })
  if (error) throw error
  return data
}

/**
 * Sign in an existing user.
 * Returns { session, user } from Supabase.
 */
export async function signIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

/** Sign out the current user. */
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

/** Get the current active session (null if not logged in). */
export async function getSession() {
  const { data } = await supabase.auth.getSession()
  return data.session
}

/**
 * Fetch the profile row for a given auth user ID.
 * Returns { id, name, role, country, photo_url, created_at }
 */
export async function getProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) throw error
  return data
}

/**
 * Update the current user's profile (name, role, country, photo_url).
 */
export async function updateProfile(userId, updates) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  if (error) throw error
  return data
}
