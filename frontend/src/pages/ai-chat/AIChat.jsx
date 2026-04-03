import React, { useState, useRef, useEffect } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles, Loader2 } from "lucide-react";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { sendChatMessage } from "../../services/chatService";

const suggestions = [
  "Sales by category",
  "What are my top products?",
  "Show me the monthly sales trend",
  "Forecast sales for next 30 days",
  "Total earnings"
];

const COLORS = ["#4f46e5", "#06b6d4", "#10b981", "#f59e0b", "#f43f5e", "#8b5cf6"];

const generateId = () => `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

const AIChat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const chatRef = useRef(null);
  const requestRef = useRef(0);

  // Auto-scroll to bottom
  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  const handleSendMessage = async (textToUse) => {
    if (loading) return;

    const query = typeof textToUse === "string" ? textToUse : message;
    if (!query.trim()) return;

    const requestId = ++requestRef.current;

    const userMsg = {
      id: generateId(),
      role: "user",
      text: query.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setMessage("");
    setLoading(true);

    try {
      const res = await sendChatMessage(query);

      if (requestId !== requestRef.current) return;

      // Extract text and chart data from the backend response
      const text = typeof res === "string" ? res : (res?.text || res?.reply || "No response from AI");
      const chartType = res?.chartType;
      const chartData = res?.chartData;
      const xKey = res?.xKey;
      const yKey = res?.yKey;

      const aiMsg = {
        id: generateId(),
        role: "ai",
        text,
        chartType,
        chartData,
        xKey,
        yKey
      };

      setMessages((prev) => [...prev, aiMsg]);

    } catch (err) {
      console.error(err);
      if (requestId !== requestRef.current) return;

      const errorMsg = {
        id: generateId(),
        role: "ai",
        text: "AI service error. Unable to analyze data at this moment.",
        isError: true,
      };

      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      if (requestId === requestRef.current) setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 📊 Helper to render interactive charts inside the chat bubble
  const renderChart = (msg) => {
    if (!msg.chartData || msg.chartData.length === 0) return null;

    return (
      <div className="h-64 w-full min-w-[300px] mt-4 bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
        <ResponsiveContainer width="100%" height="100%">
          {msg.chartType === "bar" ? (
            <BarChart data={msg.chartData}>
              <XAxis dataKey={msg.xKey} stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis hide />
              <Tooltip 
                cursor={{ fill: 'transparent' }} 
                contentStyle={{ borderRadius: '8px', backgroundColor: '#1f2937', color: '#fff', border: 'none' }} 
                itemStyle={{ color: '#fff' }}
              />
              <Bar dataKey={msg.yKey} fill="#4f46e5" radius={[4, 4, 0, 0]} />
            </BarChart>
          ) : (
            <PieChart>
              <Pie 
                data={msg.chartData} 
                dataKey={msg.yKey} 
                nameKey={msg.xKey} 
                cx="50%" cy="50%" 
                innerRadius={60} 
                outerRadius={80} 
                stroke="none"
              >
                {msg.chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '8px', backgroundColor: '#1f2937', color: '#fff', border: 'none' }} 
                itemStyle={{ color: '#fff' }}
              />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-4xl h-[calc(100vh-6rem)] flex flex-col space-y-4">

      {/* HEADER */}
      <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
        <Sparkles className="text-indigo-500" />
        Conversational BI
      </h1>

      {/* SUGGESTIONS */}
      <div className="flex flex-wrap gap-2">
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(s)}
            disabled={loading}
            className="px-3 py-1.5 text-xs font-medium border border-gray-200 dark:border-gray-700 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-200 transition-colors disabled:opacity-50 text-gray-600 dark:text-gray-300"
          >
            {s}
          </button>
        ))}
      </div>

      {/* CHAT */}
      <div className="flex-1 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm rounded-xl flex flex-col overflow-hidden">

        <div ref={chatRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">

          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 space-y-3">
              <Bot size={48} className="text-indigo-200 dark:text-indigo-500/30" />
              <p>I am your Data Assistant.<br/>Ask me to generate charts or analyze your sales!</p>
            </div>
          )}

          <AnimatePresence>
            {messages.map((msg) => {
              const isUser = msg.role === "user";

              return (
                <Motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex items-start gap-3 max-w-[85%] md:max-w-[75%] ${isUser ? "flex-row-reverse" : ""}`}>
                    
                    {/* Avatar */}
                    <div className={`h-8 w-8 shrink-0 rounded-full flex items-center justify-center mt-1 ${
                      isUser ? "bg-purple-500 text-white" : "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400"
                    }`}>
                      {isUser ? <User size={16} /> : <Bot size={18} />}
                    </div>

                    {/* Message Bubble & Chart Container */}
                    <div className={`flex flex-col ${isUser ? "items-end" : "items-start"} w-full`}>
                      <div className={`px-5 py-3 rounded-2xl shadow-sm text-sm leading-relaxed ${
                        isUser
                          ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-tr-none"
                          : msg.isError 
                            ? "bg-red-50 dark:bg-red-500/10 text-red-600 border border-red-100 dark:border-red-500/20 rounded-tl-none"
                            : "bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-none"
                      }`}>
                        {msg.text.split("\n").map((line, i) => (
                          <p key={i} className="min-h-[1rem]">{line}</p>
                        ))}
                      </div>

                      {/* Render Chart if AI provided one */}
                      {renderChart(msg)}
                    </div>
                    
                  </div>
                </Motion.div>
              );
            })}
          </AnimatePresence>

          {/* Typing Indicator */}
          {loading && (
            <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 shrink-0 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mt-1">
                  <Bot size={18} />
                </div>
                <div className="px-5 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl rounded-tl-none flex items-center gap-2">
                  <Loader2 className="animate-spin text-indigo-500" size={16} />
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Crunching data...</span>
                </div>
              </div>
            </Motion.div>
          )}
        </div>

        {/* INPUT */}
        <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
          <div className="relative flex items-center">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none rounded-full py-3.5 pl-6 pr-14 text-gray-900 dark:text-white shadow-sm disabled:opacity-60 transition-all"
              placeholder="Ask about your sales, regions, or products..."
            />
            <button 
              onClick={() => handleSendMessage()}
              disabled={!message.trim() || loading}
              className="absolute right-2 p-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white rounded-full transition-colors shadow-sm"
            >
              <Send size={18} className="ml-0.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AIChat;