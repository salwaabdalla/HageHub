import { supabase } from '../supabase'

function upsertContributor(map, key, name, score, country = '') {
  if (!key || !name) return
  const existing = map.get(key) ?? { name, city: country || 'Community', points: 0 }
  existing.points += score
  if (!existing.name && name) existing.name = name
  if (!existing.city && country) existing.city = country
  map.set(key, existing)
}

export async function fetchTopContributors(limit = 5) {
  const [{ data: questions, error: questionsError }, { data: answers, error: answersError }, { data: profiles, error: profilesError }] = await Promise.all([
    supabase.from('questions').select('user_id, poster_name, vote_count'),
    supabase.from('answers').select('user_id, poster_name'),
    supabase.from('profiles').select('id, name, country'),
  ])

  if (questionsError) throw questionsError
  if (answersError) throw answersError
  if (profilesError) throw profilesError

  const profilesById = new Map((profiles ?? []).map((profile) => [
    profile.id,
    { name: profile.name, country: profile.country },
  ]))
  const contributors = new Map()

  for (const question of questions ?? []) {
    const profile = question.user_id ? profilesById.get(question.user_id) : null
    const key = question.user_id ?? `question:${question.poster_name}`
    const name = question.poster_name || profile?.name
    upsertContributor(
      contributors,
      key,
      name,
      10 + (Math.max(question.vote_count ?? 0, 0) * 2),
      profile?.country || '',
    )
  }

  for (const answer of answers ?? []) {
    const profile = answer.user_id ? profilesById.get(answer.user_id) : null
    const key = answer.user_id ?? `answer:${answer.poster_name}`
    const name = answer.poster_name || profile?.name
    upsertContributor(
      contributors,
      key,
      name,
      5,
      profile?.country || '',
    )
  }

  return [...contributors.values()]
    .sort((a, b) => b.points - a.points)
    .slice(0, limit)
}
