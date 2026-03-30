export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  const { messages, system } = req.body
  try {
    const firstMsg = messages[0]?.content || ''
    const combined = system ? `${system}\n\n${firstMsg}` : firstMsg
    const contents = [
      { role: 'user', parts: [{ text: combined }] },
      ...messages.slice(1).map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }))
    ]
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: { maxOutputTokens: 1024, temperature: 0.7 }
        })
      }
    )
    const data = await response.json()
    if (!response.ok) return res.status(response.status).json(data)
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text
    if (!text) return res.status(500).json({ error: 'Empty response' })
    return res.status(200).json({ content: text })
  } catch (error) {
    return res.status(500).json({ error: 'AI request failed: ' + error.message })
  }
}