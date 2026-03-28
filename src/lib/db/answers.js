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

/**
 * Insert a new answer.
 * @param {{ question_id, user_id?, body, poster_name, poster_init }} a
 */
export async function insertAnswer(a) {
  const { data, error } = await supabase
    .from('answers')
    .insert([{
      question_id: a.question_id,
      user_id: a.user_id ?? null,
      body: a.body,
      poster_name: a.poster_name,
      poster_init: a.poster_init,
    }])
    .select()
    .single()

  if (error) throw error

  // Keep answer_count in sync
  const { data: question } = await supabase
    .from('questions')
    .select('answer_count')
    .eq('id', a.question_id)
    .single()

  if (question) {
    await supabase
      .from('questions')
      .update({ answer_count: (question.answer_count ?? 0) + 1 })
      .eq('id', a.question_id)
  }

  return data
}
