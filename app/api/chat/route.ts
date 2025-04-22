import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    const { messages } = await req.json()
  
    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json({ error: 'API key is missing in the environment variables.' }, { status: 500 })
    }
  
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo', // Replace with the correct model
          messages: [
            { role: 'system', content: 'You are a helpful game assistant.' },
            ...messages,
          ],
        }),
      })
  
      if (!response.ok) {
        const errorBody = await response.text()
        console.error(`OpenRouter API Error - Status: ${response.status}, Body: ${errorBody}`)
        throw new Error(`Failed to fetch from OpenRouter API: ${errorBody}`)
      }
  
      const data = await response.json()
      return NextResponse.json(data)
  
    } catch (error) {
      console.error('Server-side Error:', error)
      return NextResponse.json({ error: 'Something went wrong. Please try again later.' }, { status: 500 })
    }
  }
  
