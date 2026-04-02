import React, { useState, useRef, useEffect } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles, Loader2 } from "lucide-react";
import { sendChatMessage } from "../../services/chatService"; // Ensure this API call is set up

const suggestions = [
  "What is our top selling product?",
  "Which region has the highest revenue?",
  "Show me the monthly sales trend",
  "Forecast sales for next 30 days",
  "Are there any anomalies in sales?"
];

const AIChat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  const scrollToBottom = () => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (textToUse) => {
    const query = typeof textToUse === 'string' ? textToUse : message;
    if (!query.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      role: "user",
      text: query.trim(),
      time: new Date()
    };

    setMessages(prev => [...prev, userMsg].slice(-100));
    setMessage("");
    setLoading(true);

    try {
      const reply = await sendChatMessage(query);
      
      const aiMsg = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        text: reply.reply || reply, // Handle depending on how your axios interceptor returns data
        time: new Date()
      };
      
      setMessages(prev => [...prev, aiMsg].slice(-100));
    } catch  {
      const errorMsg = {
        id: (Date.now() + 2).toString(),
        role: "ai",
        text: "I'm sorry, I encountered an error processing your request. Please try again.",
        time: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMsg].slice(-100));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="mx-auto max-w-4xl h-[calc(100vh-6rem)] flex flex-col space-y-4">
      {/* Header */}
      <div className="shrink-0 flex flex-col">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
          <Sparkles className="text-indigo-600 dark:text-indigo-400" />
          AI Assistant
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Query your data using natural language. Ask about sales, trends, or predictions.
        </p>
      </div>

      {/* Suggested Prompts */}
      <div className="shrink-0 flex flex-wrap gap-2">
        {suggestions.map((s, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(s)}
            disabled={loading}
            className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 shadow-sm transition-colors hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-indigo-500/50 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col rounded-xl border border-gray-200 bg-gray-50 overflow-hidden shadow-sm dark:border-gray-800 dark:bg-gray-900/50 transition-colors duration-300">
        
        {/* Messages Area */}
        <div ref={chatRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center opacity-70">
              <Bot size={48} className="mb-4 text-gray-400 dark:text-gray-600" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">How can I help you today?</h3>
              <p className="mt-1 max-w-sm text-sm text-gray-500 dark:text-gray-400">
                I can analyze your database, predict churn, forecast revenue, and find data anomalies.
              </p>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {messages.map((msg) => {
                const isUser = msg.role === "user";
                return (
                  <Motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`flex items-end gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                  >
                    {/* Avatar */}
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      isUser 
                        ? "bg-indigo-600 text-white" 
                        : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                    }`}>
                      {isUser ? <User size={16} /> : <Bot size={16} />}
                    </div>

                    {/* Bubble */}
                    <div className={`relative max-w-[75%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                      isUser
                        ? "bg-indigo-600 text-white rounded-br-none"
                        : msg.isError 
                          ? "bg-red-50 border border-red-200 text-red-700 rounded-bl-none dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400"
                          : "bg-white border border-gray-200 text-gray-800 rounded-bl-none dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                    }`}>
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                      <span className={`mt-1 block text-[10px] ${isUser ? "text-indigo-200" : "text-gray-400 dark:text-gray-500"}`}>
                        {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </Motion.div>
                );
              })}
            </AnimatePresence>
          )}

          {/* Typing Indicator */}
          {loading && (
            <Motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-end gap-3"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                <Bot size={16} />
              </div>
              <div className="rounded-2xl rounded-bl-none border border-gray-200 bg-white px-4 py-3 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div className="flex gap-1">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 dark:bg-gray-500"></span>
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 dark:bg-gray-500" style={{ animationDelay: "0.15s" }}></span>
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 dark:bg-gray-500" style={{ animationDelay: "0.3s" }}></span>
                </div>
              </div>
            </Motion.div>
          )}
        </div>

        {/* Input Area */}
        <div className="shrink-0 border-t border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <div className="relative flex items-center">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              placeholder="Ask PRISMORA a question..."
              className="w-full rounded-full border border-gray-300 bg-gray-50 py-3 pl-4 pr-12 text-sm text-gray-900 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-indigo-500 dark:focus:bg-gray-900"
            />
            <button
              onClick={handleSendMessage}
              disabled={!message.trim() || loading}
              className="absolute right-2 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white transition-all hover:bg-indigo-700 disabled:scale-90 disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} className="ml-0.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat;