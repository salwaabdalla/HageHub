const SOMALI_SYSTEM_PROMPT = `Adiga waxaad tahay macallin teknoolojiyada ah oo ku hadla 
af Soomaali dabiici ah. Marka aad ku jawaabayso af Soomaali:
- Isticmaal af Soomaali sax ah oo ay dadka reer Soomaaliya ay si fudud u fahmaan
- HA turjumin erey-ka-erey Ingiriisiga
- Ereyada farsamada (algorithm, database, function) - u sii af Ingiriisi laakiin sharax Soomaali
- Jawaabtu ha ka gaabato 200 erey`

const ENGLISH_MARKERS = new Set([
  'the','and','for','with','that','this','from','your','you','are','how',
  'what','why','when','where','can','use','using','into','then','than',
  'code','data','system','build','learn','answer','question','english',
  'response','explain','database','function','algorithm','frontend','backend',
])

const SYSTEM_PROMPTS = {
  en: `You are a helpful CS tutor on Hage Hub for Somali tech students. Answer clearly and practically. Keep answers under 250 words.`,
  so: SOMALI_SYSTEM_PROMPT,
  both: `You are a helpful CS tutor on Hage Hub. Answer in BOTH English and Somali.
Format exactly like this:
English:
[English answer]
---
Af Soomaali:
[Somali answer]`,
}

function shouldWarnSomaliQuality(text) {
  const words = (text.toLowerCase().match(/[a-z']+/g) ?? [])
  if (!words.length) return false
  const englishWords = words.filter(w => ENGLISH_MARKERS.has(w)).length
  return (englishWords / words.length) > 0.4
}

function buildContents(messages, system) {
  const firstMsg = messages[0]?.content || ''
  const combined = system ? `${system}\n\n${firstMsg}` : firstMsg
  return [
    { role: 'user', parts: [{ text: combined }] },
    ...messages.slice(1).map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }))
  ]
}

async function requestAI(messages, system, langForWarning = 'both') {
  const isDev = import.meta.env.DEV
  let response

  if (isDev) {
    const contents = buildContents(messages, system)
    response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: { maxOutputTokens: 1024, temperature: 0.7 }
        })
      }
    )
  } else {
    response = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, system })
    })
  }

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const msg = data.error?.message ?? data.error ?? `Request failed with status ${response.status}`
    throw new Error(msg)
  }

  const content = isDev
    ? data.candidates?.[0]?.content?.parts?.[0]?.text
    : data.content

  if (!content) throw new Error('AI returned an empty response.')

  const model = isDev ? 'gemini' : (data.model || 'gemini')

  return {
    content,
    model,
    warning: langForWarning === 'so' && shouldWarnSomaliQuality(content)
      ? 'AI response may not be fully in Somali' : '',
  }
}

export async function askHageAI(message, lang = 'both', history = []) {
  const messages = [
    ...history
      .filter(m => m.role !== 'system')
      .map(({ role, content }) => ({ role, content })),
    { role: 'user', content: message },
  ]
  return requestAI(messages, SYSTEM_PROMPTS[lang] ?? SYSTEM_PROMPTS.both, lang)
}

export async function askHageAICustom(message, system, langForWarning = 'both') {
  return requestAI([{ role: 'user', content: message }], system, langForWarning)
}