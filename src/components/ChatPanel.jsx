import { useState, useEffect, useRef } from 'react'

/**
 * ChatPanel - left column. Renders the conversation and the input form.
 * It's a controlled component: all data comes from props, all changes go up via callbacks.
 */
function ChatPanel({ messages, isLoading, onSendMessage }) {
  // Local state for the input value. It stays in the panel because nothing else cares.
  const [inputValue, setInputValue] = useState('')

  // Ref pointing to an empty div at the bottom of the messages list.
  // We use it to auto-scroll the conversation as new messages arrive.
  const messagesEndRef = useRef(null)

  // Auto-scroll to the bottom whenever messages change or loading state toggles.
  // This is a small UX detail that makes the chat feel polished.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = inputValue.trim()
    // Guard: don't send empty messages, and don't allow sending while loading.
    if (!trimmed || isLoading) return
    onSendMessage(trimmed)
    setInputValue('')
  }

  return (
    <aside className="chat-panel">
      <header className="chat-header">
        <h1 className="chat-title">MatchDay <span className="accent">Copilot</span></h1>
        <p className="chat-subtitle">Your best assistant for the World Cup 2026</p>
      </header>

      <div className="messages-area">
        {messages.map((msg, i) => (
          <div key={i} className={`message message-${msg.role}`}>
            {msg.content}
          </div>
        ))}

        {/* Animated dots shown while waiting for the AI response */}
        {isLoading && (
          <div className="message message-ai message-loading">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        )}

        {/* Empty div used as a scroll anchor for the useEffect above */}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input" onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask anything"
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !inputValue.trim()}>
          →
        </button>
      </form>
    </aside>
  )
}

export default ChatPanel
