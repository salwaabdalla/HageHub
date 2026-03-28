import { supabase } from '../supabase'

export async function fetchQuestions() {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20)
  
  console.log('QUESTIONS RAW:', data, error)
  
  if (error) throw error
  return data || []
}

export async function insertQuestion(question) {
  const cleanQuestion = {
    ...question,
    poster_photo: (question.poster_photo &&
      !question.poster_photo.startsWith('data:'))
      ? question.poster_photo
      : '',
  }

  const { data, error } = await supabase
    .from('questions')
    .insert(cleanQuestion)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function fetchUserVotes(userId, questionIds) {
  const { data, error } = await supabase
    .from('votes')
    .select('*')
    .eq('user_id', userId)
    .in('question_id', questionIds)
  
  if (error) throw error
  return data || []
}
