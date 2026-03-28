import { supabase } from './supabase'

export const KEYS = {
  QUESTIONS: 'hagehub_questions',
  VOTES: 'hh_votes',
  THREAD_COMMENTS: 'hh_thread_comments',
  COMMUNITY: 'hh_comments',
  AI_CHAT: 'hh_ai_messages',
}

export async function uploadQuestionImage(file) {
  const ext = file.name.split('.').pop()
  const name = `${Date.now()}-${Math.random()
    .toString(36).substring(2)}.${ext}`

  const { error } = await supabase.storage
    .from('question-images')
    .upload(name, file)

  if (error) {
    console.error('Upload failed:', error)
    return null
  }

  const { data } = supabase.storage
    .from('question-images')
    .getPublicUrl(name)

  return data.publicUrl
}

export function read(key, fallback) {
  try {
    const v = localStorage.getItem(key)
    return v ? JSON.parse(v) : fallback
  } catch {
    return fallback
  }
}

export function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // storage full — fail silently
  }
}

/**
 * Cast or toggle a vote on a question.
 * Toggles off if the same value is voted again.
 * @param {string} questionId
 * @param {1|-1} value
 * @returns {{ newVotes: number, userVote: number }}
 */
export function castVote(questionId, value) {
  const votes = read(KEYS.VOTES, {})
  const prev = votes[questionId] ?? 0
  const newVal = prev === value ? 0 : value
  const delta = newVal - prev
  votes[questionId] = newVal
  write(KEYS.VOTES, votes)

  const questions = read(KEYS.QUESTIONS, [])
  const q = questions.find((q) => q.id === questionId)
  if (q) {
    q.votes = (q.votes ?? 0) + delta
    write(KEYS.QUESTIONS, questions)
    return { newVotes: q.votes, userVote: newVal }
  }
  // seed question not in localStorage yet — return best guess
  return { newVotes: delta, userVote: newVal }
}

export function getUserVote(questionId) {
  return read(KEYS.VOTES, {})[questionId] ?? 0
}
