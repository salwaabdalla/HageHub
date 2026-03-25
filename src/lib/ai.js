const GROQ_MODEL = 'llama-3.3-70b-versatile'
const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions'

const SYSTEM_PROMPTS = {
  en: `You are a helpful CS tutor on Hage Hub, a platform for Somali tech students and professionals. Answer clearly, encouragingly, and practically. Include code examples when relevant. Keep answers under 250 words.`,

  so: `Adiga waxaad tahay macallin CS ah oo ku shaqeeya Hage Hub, goobta bulshada teknoolojiyada Soomaalida. Ku jawaab af Soomaali oo dabiici ah — HAY isticmaalin turjumaad toos ah oo Ingiriisi. Isticmaal luqadda Soomaalida ee dadka reer Soomaaliya ku hadlaan. Haddii ereyga farsamada aan lahayn turjumaad Soomaali, isticmaal ereyga Ingiriisiga oo ku sharax macnaheeda Soomaaliga. Jawaabtu ha ka gaabato 250 erey.`,

  both: `You are a helpful CS tutor on Hage Hub. Answer in BOTH English and Somali (af Soomaali).

Format your response exactly like this:

🇬🇧 English:
[English answer here]

---

🇸🇴 Af Soomaali:
[Somali answer here — must be authentic natural Somali, NOT word-for-word translation. Write as a native Somali speaker would.]`,
}

/**
 * Ask Hage AI a question.
 * @param {string} message - The user's question
 * @param {'en'|'so'|'both'} lang - Response language
 * @param {Array<{role:string,content:string}>} history - Previous messages (exclude system)
 * @returns {Promise<string>} The AI response text
 */
export async function askHageAI(message, lang = 'both', history = []) {
  const key = import.meta.env.VITE_GROQ_API_KEY
  if (!key) {
    throw new Error(
      'VITE_GROQ_API_KEY is not set. Add it to your .env file and restart the dev server.',
    )
  }

  const res = await fetch(GROQ_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      max_tokens: 1024,
      messages: [
        { role: 'system', content: SYSTEM_PROMPTS[lang] ?? SYSTEM_PROMPTS.both },
        ...history.filter((m) => m.role !== 'system').map(({ role, content }) => ({ role, content })),
        { role: 'user', content: message },
      ],
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    const msg = err.error?.message ?? `Request failed with status ${res.status}`
    throw new Error(msg)
  }

  const data = await res.json()
  const text = data.choices?.[0]?.message?.content
  if (!text) throw new Error('AI returned an empty response.')
  return text
}
