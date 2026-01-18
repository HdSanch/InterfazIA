import { useContext, useState, useRef, useEffect } from "react";
import { ClassContext } from "../context/ClassContext";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/main.css";

export default function ChatBox() {
  const { docId, messages, setMessages } = useContext(ClassContext);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Función para formatear Markdown a HTML
  const formatMarkdown = (text) => {
    if (!text) return '';
    
    return text
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="chat-md-h3">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="chat-md-h2">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="chat-md-h1">$1</h1>')
      
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      
      // Italic
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      
      // Links (Citations) - [Fuente N]
      .replace(/\[Fuente (\d+)\]/g, '<span class="citation">Fuente $1</span>')
      
      // Lists with bullet points
      .replace(/^\* (.*$)/gim, '<li class="chat-md-li">$1</li>')
      .replace(/^- (.*$)/gim, '<li class="chat-md-li">$1</li>')
      
      // Numbered lists
      .replace(/^(\d+)\. (.*$)/gim, '<li class="chat-md-li-num" value="$1">$2</li>')
      
      // Line breaks
      .replace(/\n/g, '<br>');
  };

  async function sendMessage(e) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doc_id: docId,
          question: userMessage.content
        })
      });

      const data = await res.json();

      const aiMessage = {
        role: "assistant",
        content: data.answer ?? data.response ?? "No se pudo obtener una respuesta. Intente nuevamente."
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { 
          role: "assistant", 
          content: "Error al procesar su consulta. Verifique la conexión e intente nuevamente." 
        }
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e);
    }
  };

  const suggestions = [
    "¿Cuál es el tema principal?",
    "Resume este documento",
    "Explica los conceptos clave"
  ];

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
    inputRef.current?.focus();
  };

  return (
    <div className="chatbox-container">
      {/* MESSAGES AREA */}
      <div className="chat-messages-area">
        {messages.length === 0 ? (
          <div className="chat-empty-state">
            <div className="chat-empty-icon">💬</div>
            <div className="chat-empty-text">
              Realice preguntas sobre el contenido del documento.
              <br />
              El asistente virtual está listo para ayudarle.
            </div>
          </div>
        ) : (
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                className={`chat-message ${msg.role}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="message-header">
                  <div className={`message-avatar ${msg.role}`}>
                    {msg.role === "user" ? "👤" : "🤖"}
                  </div>
                  <div className="message-sender">
                    {msg.role === "user" ? "Usuario" : "Asistente IA"}
                  </div>
                </div>
                <div className="message-bubble">
                  {msg.role === "assistant" ? (
                    <div 
                      className="chat-markdown-content"
                      dangerouslySetInnerHTML={{ __html: formatMarkdown(msg.content) }}
                    />
                  ) : (
                    <span>{msg.content}</span>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="message-header">
              <div className="message-avatar assistant">🤖</div>
              <div className="message-sender">Asistente IA</div>
            </div>
            <div className="typing-indicator">
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* SUGGESTIONS */}
      {messages.length === 0 && !loading && (
        <div className="chat-suggestions">
          {suggestions.map((suggestion, i) => (
            <button
              key={i}
              className="suggestion-chip"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {/* INPUT AREA */}
      <div className="chat-input-area">
        <form className="chat-input-form" onSubmit={sendMessage}>
          <div className="chat-input-wrapper">
            <textarea
              ref={inputRef}
              className="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escriba su pregunta aquí..."
              rows={1}
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className="chat-send-btn"
            disabled={!input.trim() || loading}
          >
            {loading ? (
              <>Enviando...</>
            ) : (
              <>
                Enviar
                <span className="send-icon">➤</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}