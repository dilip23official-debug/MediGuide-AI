import { useEffect, useState } from "react";
import api from "./api";

function Chat() {
const [sessionId, setSessionId] = useState(null);
const [sessions, setSessions] = useState([]);
const [message, setMessage] = useState("");
const [messages, setMessages] = useState([]);
const [loading, setLoading] = useState(false);

useEffect(() => {
loadSessions();
}, []);

const loadSessions = async () => {
try {
const token = localStorage.getItem("access_token");

  const response = await api.get("/chat-sessions/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  setSessions(response.data);

  if (response.data.length > 0) {
    const latestSession = response.data[0];

    setSessionId(latestSession.id);
    setMessages(latestSession.messages || []);
  } else {
    createSession();
  }
} catch (error) {
  console.error("Failed to load chat history:", error);
}

};

const createSession = async () => {
try {
const token = localStorage.getItem("access_token");


  const response = await api.post(
    "/chat-sessions/",
    {
      title: "Health Conversation",
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  setSessionId(response.data.id);
  setMessages([]);

  setSessions((previous) => [
    response.data,
    ...previous,
  ]);
} catch (error) {
  console.error("Session creation failed:", error);
}

};

const openSession = (session) => {
setSessionId(session.id);
setMessages(session.messages || []);
};

const sendMessage = async (e) => {
e.preventDefault();


if (!message.trim() || !sessionId) {
  return;
}

const userMessage = message;

setMessage("");

setMessages((previous) => [
  ...previous,
  {
    role: "user",
    content: userMessage,
  },
]);

setLoading(true);

try {
  const token = localStorage.getItem("access_token");

  const response = await api.post(
    "/chat-messages/send/",
    {
      session: sessionId,
      content: userMessage,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  setMessages((previous) => [
    ...previous,
    {
      role: "assistant",
      content: response.data.ai_response,
    },
  ]);
} catch (error) {
  setMessages((previous) => [
    ...previous,
    {
      role: "assistant",
      content:
        error.response?.data?.detail ||
        "MediGuide AI is currently unavailable.",
    },
  ]);
} finally {
  setLoading(false);
}


};

return ( <div className="chat-container">


  <div className="chat-header">
    <div>
      <h2>🤖 MediGuide AI</h2>
      <p>Educational health assistant</p>
    </div>

    <div className="status-dot"></div>
  </div>

  <div className="chat-history">
    <h3>💬 Previous Conversations</h3>

    {sessions.length === 0 ? (
      <p>No previous conversations.</p>
    ) : (
      sessions.map((session) => (
        <button
          key={session.id}
          className={
            session.id === sessionId
              ? "history-item active"
              : "history-item"
          }
          onClick={() => openSession(session)}
        >
          {session.title}
        </button>
      ))
    )}

    <button
      className="new-chat-btn"
      onClick={createSession}
    >
      + New Chat
    </button>
  </div>

  <div className="chat-messages">

    {messages.length === 0 && (
      <div className="chat-welcome">
        <h3>How can I help? 👋</h3>

        <p>
          Ask me general health-related questions and
          I'll explain them in simple language.
        </p>
      </div>
    )}

    {messages.map((item, index) => (
      <div
        key={index}
        className={`chat-message ${
          item.role === "user"
            ? "user-message"
            : "ai-message"
        }`}
      >
        <strong>
          {item.role === "user"
            ? "You"
            : "MediGuide AI"}
        </strong>

        <p>{item.content}</p>
      </div>
    ))}

    {loading && (
      <div className="chat-message ai-message">
        <strong>MediGuide AI</strong>
        <p>Thinking... 🤔</p>
      </div>
    )}

  </div>

  <form
    className="chat-input-area"
    onSubmit={sendMessage}
  >
    <input
      type="text"
      placeholder="Ask a health-related question..."
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      disabled={!sessionId || loading}
    />

    <button
      type="submit"
      disabled={!sessionId || loading}
    >
      Send
    </button>
  </form>

</div>

);
}

export default Chat;
