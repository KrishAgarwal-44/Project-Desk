import React, { useEffect, useState } from "react";
import { sendMessage, getMessages } from "../../services/headService";

const HeadMessage = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [recipientRole, setRecipientRole] = useState("student"); // "student", "mentor", "all"
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("sent");


  // ✅ Load sent messages on mount
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const msgs = await getMessages();
        setMessages(msgs);
      } catch (err) {
        console.error("Error fetching messages:", err);
        setMessages([]);
      }
    };
    fetchMessages();
  }, []);

  // ✅ Send message
  const handleSend = async () => {
    if (!newMessage.trim()) return;
    setLoading(true);

    try {
      const receiverRoles = recipientRole === "all" ? ["student", "mentor"] : [recipientRole];

      const payload = { content: newMessage, receiverRoles };

      await sendMessage(payload);

      // Clear form
      setNewMessage("");
      setRecipientRole("student");

      // Refresh messages after sending
      const msgs = await getMessages();
      setMessages(msgs);
      setTab("sent");
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Sent messages (backend already filters for head)
  const sentMessages = Array.isArray(messages) ? messages : [];

  return (
    <div className="bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">Messages</h2>

      {/* Send Message Form */}
      <div className="mb-6 space-y-3 p-4 border rounded bg-gray-50">
        <h3 className="font-semibold mb-2">Send a Message</h3>

        <select
          value={recipientRole}
          onChange={(e) => setRecipientRole(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="student">All Students</option>
          <option value="mentor">All Mentors</option>
          <option value="all">Both Students & Mentors</option>
        </select>

        <textarea
          placeholder="Write your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setTab("sent")}
          className={`px-4 py-2 rounded ${tab === "sent" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          Sent
        </button>
      </div>

      {/* Sent Messages */}
      {tab === "sent" && (
        <div>
          <h3 className="font-semibold mb-2">Sent Messages</h3>
          {sentMessages.length === 0 ? (
            <p className="text-gray-500">No sent messages</p>
          ) : (
            <ul className="space-y-2">
              {sentMessages.map((m) => (
                <li key={m._id} className="border p-2 rounded bg-green-50">
                  <p>{m.content}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(m.createdAt).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    To: {m.receiverRoles.join(", ")}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default HeadMessage;

