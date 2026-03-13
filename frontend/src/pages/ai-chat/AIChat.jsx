import { useState } from "react";
import API from "../../services/api";
import DashboardLayout from "../../components/layout/DashboardLayout";

const AIChat = () => {

  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");

  const sendMessage = async () => {

    const res = await API.post("/chat", {
      message
    });

    setReply(res.data.reply);
  };

  return (

    <DashboardLayout>

      <h1 className="text-3xl font-bold mb-6">
        AI Assistant
      </h1>

      <div className="space-y-4">

        <input
          className="bg-slate-800 p-3 rounded w-full"
          placeholder="Ask something..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button
          onClick={sendMessage}
          className="bg-blue-500 px-4 py-2 rounded"
        >
          Ask
        </button>

        {reply && (

          <div className="bg-slate-900 border border-slate-700 p-4 rounded">

            {reply}

          </div>

        )}

      </div>

    </DashboardLayout>

  );

};

export default AIChat;