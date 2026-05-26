import { useState, useRef, useEffect } from 'react'
import { askAgent } from '../api/agentApi'

type MessagePart =
  | { kind: 'text'; content: string }
  | { kind: 'tool'; name: string }

type Message = {
  role: 'user' | 'agent'
  parts: MessagePart[]
  isStreaming?: boolean
}

export function AgentChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const appendToLast = (updater: (msg: Message) => void) =>
    setMessages((prev) => {
      const updated = [...prev]
      const last = { ...updated[updated.length - 1], parts: [...updated[updated.length - 1].parts.map(p => ({ ...p }))] }
      updater(last)
      updated[updated.length - 1] = last
      return updated
    })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const question = input.trim()
    if (!question || isLoading) return

    setInput('')
    setIsLoading(true)
    setMessages((prev) => [
      ...prev,
      { role: 'user', parts: [{ kind: 'text', content: question }] },
      { role: 'agent', parts: [], isStreaming: true },
    ])

    try {
      await askAgent(question, (event) => {
        if (event.type === 'text') {
          appendToLast((msg) => {
            const last = msg.parts[msg.parts.length - 1]
            if (last?.kind === 'text') last.content += event.text
            else msg.parts.push({ kind: 'text', content: event.text })
          })
        } else if (event.type === 'tool') {
          appendToLast((msg) => msg.parts.push({ kind: 'tool', name: event.name }))
        } else if (event.type === 'done' || event.type === 'error') {
          appendToLast((msg) => {
            msg.isStreaming = false
            if (event.type === 'error')
              msg.parts = [{ kind: 'text', content: 'Something went wrong. Please try again.' }]
          })
          setIsLoading(false)
        }
      })
    } catch {
      appendToLast((msg) => {
        msg.parts = [{ kind: 'text', content: 'Could not reach the agent. Is the server running?' }]
        msg.isStreaming = false
      })
      setIsLoading(false)
    }
  }

  return (
    <div className="chat-container">
      <header className="chat-header">
        <div className="chat-header-icon">✦</div>
        <div>
          <h1>Strands Agent</h1>
          <p>Powered by Gemini 2.5 Flash</p>
        </div>
        <div className="chat-header-status">
          <span className="status-dot" />
          Online
        </div>
      </header>

      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="chat-empty">
            <div className="chat-empty-icon">✦</div>
            <p>Ask me anything to get started.</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`chat-bubble ${msg.role}`}>
            <span className="chat-bubble-label">{msg.role === 'user' ? 'You' : 'Agent'}</span>
            <p className="chat-bubble-text">
              {msg.parts.map((part, j) =>
                part.kind === 'tool' ? (
                  <span key={j} className="tool-pill">⚙ {part.name}</span>
                ) : (
                  <span key={j}>{part.content}</span>
                )
              )}
              {msg.isStreaming && msg.parts.length === 0 && <span className="cursor" />}
            </p>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form className="chat-form" onSubmit={handleSubmit}>
        <div className="chat-input-wrap">
          <input
            className="chat-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask the agent something…"
            disabled={isLoading}
            autoFocus
          />
        </div>
        <button
          className="chat-submit"
          type="submit"
          disabled={isLoading || !input.trim()}
          aria-label="Send message"
        >
          {isLoading ? '…' : '↑'}
        </button>
      </form>
    </div>
  )
}
