export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { messages, system } = req.body

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({
      error: 'Invalid request: messages array required'
    })
  }

  console.log('GEMINI KEY EXISTS:', !!process.env.GEMINI_API_KEY)
  console.log('GROQ KEY EXISTS:', !!process.env.GROQ_API_KEY)
  console.log('Messages count:', messages.length)

  // Try Gemini first
  try {
    const contents = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }))

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: system
            ? { parts: [{ text: system }] }
            : undefined,
          contents,
          generationConfig: {
            maxOutputTokens: 1024,
            temperature: 0.7,
          }
        })
      }
    )

    const geminiData = await geminiRes.json()
    console.log('Gemini status:', geminiRes.status)
    console.log('Gemini response:', JSON.stringify(geminiData).substring(0, 200))

    if (geminiRes.ok) {
      const text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text
      if (text) {
        return res.status(200).json({
          content: text,
          model: 'gemini'
        })
      }
    }

    console.log('Gemini failed, trying Groq...')

  } catch (geminiError) {
    console.log('Gemini error:', geminiError.message)
  }

  // Fallback to Groq
  try {
    const groqMessages = system
      ? [{ role: 'system', content: system }, ...messages]
      : messages

    const groqRes = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: groqMessages,
          max_tokens: 1024,
        })
      }
    )

    const groqData = await groqRes.json()
    console.log('Groq status:', groqRes.status)
    console.log('Groq response:', JSON.stringify(groqData).substring(0, 200))

    if (!groqRes.ok) {
      throw new Error(
        groqData.error?.message ||
        'Groq failed with status ' + groqRes.status
      )
    }

    return res.status(200).json({
      content: groqData.choices[0].message.content,
      model: 'groq'
    })

  } catch (groqError) {
    console.log('Groq error:', groqError.message)
    return res.status(500).json({
      error: 'Both AI services failed. ' + groqError.message
    })
  }
}
