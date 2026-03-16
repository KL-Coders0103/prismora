import { useState, useRef, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { sendChatMessage } from "../../services/chatService";

const suggestions = [
  "What is the top selling product?",
  "Which region has highest revenue?",
  "Show sales trends",
  "Which category is underperforming?"
];

const AIChat = () => {

  const [message,setMessage] = useState("");
  const [messages,setMessages] = useState([]);
  const [loading,setLoading] = useState(false);

  const chatRef = useRef();

  const sendMessage = async (text) => {

    const query = text || message;

    if(!query.trim()) return;

    const userMessage = {
      id:Date.now(),
      role:"user",
      text:query,
      time:new Date()
    };

    setMessages(prev => [...prev,userMessage].slice(-100));

    setMessage("");
    setLoading(true);

    try{

      const reply = await sendChatMessage(query);

      const aiMessage = {
        id:Date.now()+1,
        role:"ai",
        text:reply,
        time:new Date()
      };

      setMessages(prev => [...prev,aiMessage].slice(-100));

    }catch{

      setMessages(prev => [
        ...prev,
        {
          id:Date.now()+2,
          role:"ai",
          text:"Error processing query.",
          time:new Date()
        }
      ]);

    }finally{

      setLoading(false);

    }

  };

  useEffect(()=>{

    if(chatRef.current){

      chatRef.current.scrollTop =
        chatRef.current.scrollHeight;

    }

  },[messages]);

  return(

    <DashboardLayout>

      <h1 className="text-3xl font-bold mb-6">
        AI Assistant
      </h1>

      {/* Suggestions */}

      <div className="flex flex-wrap gap-2 mb-4">

        {suggestions.map((s)=> (

          <button
            key={s}
            onClick={()=>sendMessage(s)}
            className="bg-slate-800 px-3 py-1 rounded text-sm hover:bg-slate-700"
          >

            {s}

          </button>

        ))}

      </div>

      {/* Chat */}

      <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 h-[500px] flex flex-col">

        <div
          ref={chatRef}
          className="flex-1 overflow-y-auto space-y-4"
        >

          {messages.length===0 && (

            <p className="text-gray-400 text-sm">
              Ask a question about sales, customers or revenue.
            </p>

          )}

          {messages.map((msg)=>(

            <div
              key={msg.id}
              className={`p-3 rounded-lg max-w-[70%] ${
                msg.role==="user"
                  ? "bg-blue-500 ml-auto"
                  : "bg-slate-800"
              }`}
            >

              <div>{msg.text}</div>

              <div className="text-xs opacity-60 mt-1">

                {msg.time.toLocaleTimeString()}

              </div>

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
            disabled={loading}
            onChange={(e)=>setMessage(e.target.value)}
            onKeyDown={(e)=>{
              if(e.key==="Enter") sendMessage();
            }}
          />

          <button
            onClick={()=>sendMessage()}
            disabled={loading}
            className="bg-blue-500 px-4 rounded disabled:opacity-50"
          >

            Send

          </button>

        </div>

      </div>

    </DashboardLayout>

  )

}

export default AIChat