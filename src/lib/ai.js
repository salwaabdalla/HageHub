const GROQ_MODEL = 'llama-3.3-70b-versatile'
const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions'

const SOMALI_SYSTEM_PROMPT = `"Adiga waxaad tahay macallin teknoolojiyada ah oo ku hadla 
af Soomaali dabiici ah. Marka aad ku jawaabayso af Soomaali:

- Isticmaal af Soomaali sax ah oo ay dadka reer Soomaaliya 
  ay si fudud u fahmaan
- HA turjumin erey-ka-erey Ingiriisiga — qor si dabiici ah 
  sida Soomaali wax u qoro
- Ereyada farsamada ee aan lahayn turjumaad Soomaali 
  (sida 'algorithm', 'database', 'function') — u sii af 
  Ingiriisi laakiin sharax macnahooda Soomaali ah
- Heerka waxbarashada ha ahaado mid fudud oo waxtar leh
- Jawaabtu ha ka gaabato 200 erey

Tusaale KHALAD ah (ha samaynin): 
'Algorithm waa tilmaan-raac ah oo la raacaa'

Tusaale SAXIIX ah (samee sidaan):
'Algorithm waa taxane tallaabooyin ah oo kombiyuutarka 
la siinayo si uu u xaliyo dhibaato'

Kaliya isticmaal af Soomaali habboon."`

const ENGLISH_MARKERS = new Set([
  'the', 'and', 'for', 'with', 'that', 'this', 'from', 'your', 'you', 'are', 'how',
  'what', 'why', 'when', 'where', 'can', 'use', 'using', 'into', 'then', 'than',
  'code', 'data', 'system', 'build', 'learn', 'answer', 'question', 'english',
  'response', 'explain', 'database', 'function', 'algorithm', 'frontend', 'backend',
])

const SYSTEM_PROMPTS = {
  en: `You are a helpful CS tutor on Hage Hub, a platform for Somali tech students and professionals. Answer clearly, encouragingly, and practically. Include code examples when relevant. Keep answers under 250 words.`,
  so: SOMALI_SYSTEM_PROMPT,
  both: `You are a helpful CS tutor on Hage Hub. Answer in BOTH English and Somali (af Soomaali).

Format your response exactly like this:

English:
[English answer here]

---

Af Soomaali:
[Somali answer here]

Use this Somali quality standard exactly when writing the Somali portion:
${SOMALI_SYSTEM_PROMPT}`,
}

function shouldWarnSomaliQuality(text) {
  const words = (text.toLowerCase().match(/[a-z']+/g) ?? [])
  if (!words.length) return false
  const englishWords = words.filter((word) => ENGLISH_MARKERS.has(word)).length
  return (englishWords / words.length) > 0.4
}

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
        ...history
          .filter((messageItem) => messageItem.role !== 'system')
          .map(({ role, content }) => ({ role, content })),
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
  if (!text) {
    throw new Error('AI returned an empty response.')
  }

  return {
    content: text,
    warning: lang === 'so' && shouldWarnSomaliQuality(text)
      ? 'AI response may not be fully in Somali — we are working on improving this'
      : '',
  }
}
