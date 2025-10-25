import React, { useEffect, useState } from "react";
import { getMessages } from "../../services/commonService";

const StudentMessage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getMessages(); // backend returns only messages for 'student' role
        setMessages(res);
      } catch (err) {
        console.error(err);
        setError("Server error while fetching messages");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  if (loading) return <p>Loading messages...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!messages.length) return <p>No messages available.</p>;

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h2 className="text-xl font-medium mb-4">Messages</h2>
      <ul className="space-y-4">
        {messages.map((msg) => (
          <li
            key={msg._id}
            className="border rounded p-3 hover:bg-gray-50 transition"
          >
            <p className="text-gray-700">{msg.content}</p>
            <p className="text-sm text-gray-500 mt-2">
              From: {msg.sender?.name || "Unknown"}
            </p>
            <p className="text-sm text-gray-400">
              {new Date(msg.createdAt).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentMessage;
