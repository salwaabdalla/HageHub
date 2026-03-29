import { supabase } from '../supabase'

/** Fetch all answers for a question, oldest first. */
export async function fetchAnswers(questionId) {
  const { data, error } = await supabase
    .from('answers')
    .select('*')
    .eq('question_id', questionId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data ?? []
}

export async function fetchAnswerCounts(questionIds) {
  if (!questionIds?.length) return {}

  const { data, error } = await supabase
    .from('answers')
    .select('question_id')
    .in('question_id', questionIds)

  if (error) throw error

  return (data ?? []).reduce((acc, row) => {
    acc[row.question_id] = (acc[row.question_id] ?? 0) + 1
    return acc
  }, {})
}

/**
 * Insert a new answer.
 * @param {{ question_id, user_id?, body, poster_name, poster_init }} a
 */
export async function insertAnswer(a) {
  const questionId = a.question_id

  const { data, error } = await supabase
    .from('answers')
    .insert([{
      question_id: questionId,
      user_id: a.user_id ?? null,
      body: a.body,
      poster_name: a.poster_name,
      poster_init: a.poster_init,
    }])
    .select()
    .single()

  if (error) throw error

  // Keep answer_count in sync with the real number of answers.
  const { count, error: countError } = await supabase
    .from('answers')
    .select('*', { count: 'exact', head: true })
    .eq('question_id', questionId)

  if (countError) throw countError

  const { error: updateError } = await supabase
    .from('questions')
    .update({ answer_count: count ?? 0 })
    .eq('id', questionId)

  if (updateError) {
    throw updateError
  }

  return data
}
