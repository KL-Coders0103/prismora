import { useState, useRef, useEffect } from "react";
import API from "../../services/api";
import DashboardLayout from "../../components/layout/DashboardLayout";

const suggestions = [
  "What is the top selling product?",
  "Which region has highest revenue?",
  "Show sales trends",
  "Which category is underperforming?"
];

const AIChat = () => {

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const chatRef = useRef();

  const sendMessage = async (text) => {

    const query = text || message;

    if (!query) return;

    const userMessage = { role: "user", text: query };

    setMessages(prev => [...prev, userMessage]);

    setMessage("");
    setLoading(true);

    try {

      const res = await API.post("/chat", { message: query });

      const aiMessage = {
        role: "ai",
        text: res.data.reply
      };

      setMessages(prev => [...prev, aiMessage]);

    } catch {

      setMessages(prev => [
        ...prev,
        { role:"ai", text:"Error processing query." }
      ]);

    } finally {

      setLoading(false);

    }

  };

  // auto scroll

  useEffect(() => {

    if (chatRef.current) {

      chatRef.current.scrollTop =
        chatRef.current.scrollHeight;

    }

  }, [messages]);

  return (

    <DashboardLayout>

      <h1 className="text-3xl font-bold mb-6">
        AI Assistant
      </h1>

      {/* Suggested Questions */}

      <div className="flex flex-wrap gap-2 mb-4">

        {suggestions.map((s, i) => (

          <button
            key={i}
            onClick={() => sendMessage(s)}
            className="bg-slate-800 px-3 py-1 rounded text-sm hover:bg-slate-700"
          >

            {s}

          </button>

        ))}

      </div>

      {/* Chat Box */}

      <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 h-[500px] flex flex-col">

        <div
          ref={chatRef}
          className="flex-1 overflow-y-auto space-y-4"
        >

          {messages.map((msg, index) => (

            <div
              key={index}
              className={`p-3 rounded-lg max-w-[70%] ${
                msg.role === "user"
                  ? "bg-blue-500 ml-auto"
                  : "bg-slate-800"
              }`}
            >

              {msg.text}

            </div>

          ))}

          {loading && (

            <div className="bg-slate-800 p-3 rounded-lg w-fit">

              AI is typing...

            </div>

          )}

        </div>

        {/* Input */}

        <div className="flex gap-2 mt-4">

          <input
            className="bg-slate-800 p-3 rounded w-full"
            placeholder="Ask about revenue, sales trends..."
            value={message}
            onChange={(e)=>setMessage(e.target.value)}
            onKeyDown={(e)=>{
              if(e.key==="Enter") sendMessage();
            }}
          />

          <button
            onClick={()=>sendMessage()}
            className="bg-blue-500 px-4 rounded"
          >

            Send

          </button>

        </div>

      </div>

    </DashboardLayout>

  );

};

export default AIChat;