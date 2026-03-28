import { supabase } from '../supabase'

/**
 * Cast or toggle a vote on a question.
 * Toggling: if you vote the same value again, it resets to 0.
 *
 * @param {string} questionId
 * @param {string} userId  — current auth user's id
 * @param {1|-1}  value
 * @returns {Promise<{ newVoteCount: number, userVote: number }>}
 */
export async function castVote(questionId, userId, value) {
  if (!userId) throw new Error('Missing authenticated user id for voting.')

  // 1. Get the user's existing vote (if any)
  const { data: existing } = await supabase
    .from('votes')
    .select('value')
    .eq('question_id', questionId)
    .eq('user_id', userId)
    .maybeSingle()

  // 2. Toggle: same value → remove (set 0); otherwise apply new value
  const finalValue = existing?.value === value ? 0 : value

  // 3. Upsert the vote row
  await supabase
    .from('votes')
    .upsert(
      { question_id: questionId, user_id: userId, value: finalValue },
      { onConflict: 'question_id,user_id' },
    )

  // 4. Recalculate total vote_count from all votes on this question
  const { data: allVotes } = await supabase
    .from('votes')
    .select('value')
    .eq('question_id', questionId)

  const newVoteCount = (allVotes ?? []).reduce((sum, v) => sum + v.value, 0)

  // 5. Persist the new total on the question row
  await supabase
    .from('questions')
    .update({ vote_count: newVoteCount })
    .eq('id', questionId)

  return { newVoteCount, userVote: finalValue }
}

/**
 * Fetch all votes cast by a user across a list of question IDs.
 * Returns a map: { [questionId]: value }
 */
export async function fetchUserVotes(userId, questionIds) {
  if (!userId || !questionIds?.length) return {}

  const { data } = await supabase
    .from('votes')
    .select('question_id, value')
    .eq('user_id', userId)
    .in('question_id', questionIds)

  return Object.fromEntries((data ?? []).map((v) => [v.question_id, v.value]))
}
