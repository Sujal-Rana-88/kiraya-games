'use client'

import { useState } from 'react'

export default function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([])
  const [input, setInput] = useState('')

  const sendMessage = async () => {
    if (!input.trim()) return

    const newMessages = [...messages, { role: 'user', content: input }]
    setMessages(newMessages)
    setInput('')

    try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: newMessages }), // array of messages
        })
      
        if (!res.ok) {
          throw new Error('Failed to fetch response from server')
        }
      
        const data = await res.json()
        const reply = data.choices?.[0]?.message?.content || 'Something went wrong. Try again!'
        setMessages([...newMessages, { role: 'assistant', content: reply }])
      } catch (error) {
        console.error('Error fetching from server:', error)
        setMessages([...newMessages, { role: 'assistant', content: 'Something went wrong. Try again!' }])
      }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 font-sans">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#111] border border-gray-700 text-white px-4 py-2 rounded-full shadow-lg hover:bg-[#222] transition"
        >
          💬
        </button>
      ) : (
        <div className="bg-[#1e1e1e] border border-gray-700 w-80 h-96 rounded-2xl flex flex-col text-white shadow-xl">
          <div className="bg-[#111] text-white p-3 flex justify-between items-center rounded-t-2xl border-b border-gray-700">
            <span className="text-sm font-medium">🎮 AI Game Bot</span>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:text-red-400 transition"
            >
              ✖
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg max-w-xs ${msg.role === 'user' ? 'bg-[#333] self-end text-right ml-auto' : 'bg-[#2d2d2d] self-start text-left mr-auto'}`}
              >
                {msg.content}
              </div>
            ))}
          </div>

          <div className="p-2 border-t border-gray-700 flex gap-2">
            <input
              type="text"
              className="flex-1 bg-[#2a2a2a] border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Ask about a game..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 rounded-lg text-sm"
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
