// src/components/HeadDashboardCards.jsx
import React, { useState } from "react";

const HeadDashboardCards = ({
  pendingIdeas = [],
  acceptedIdeas = [],
  rejectedIdeas = [],
  onApprove,
  onReject,
}) => {
  const [activeTab, setActiveTab] = useState("pending");
  const [expandedId, setExpandedId] = useState(null);

  const renderReview = () => (
    <div>
      {pendingIdeas.length === 0 ? (
        <p>No pending ideas.</p>
      ) : (
        pendingIdeas.map((idea) => (
          <div
            key={idea._id}
            className="border p-4 mb-4 rounded bg-white shadow"
          >
            <h3
              className="font-bold cursor-pointer text-blue-600"
              onClick={() => setExpandedId(expandedId === idea._id ? null : idea._id)}
            >
              {idea.title}
            </h3>
            {expandedId === idea._id && (
              <div className="mt-2 text-sm text-gray-700">
                <p>{idea.description}</p>
                {idea.mentor && (
                  <p>
                    <strong>Mentor:</strong> {idea.mentor.name}
                  </p>
                )}
                {idea.team?.length > 0 && (
                  <p>
                    <strong>Team:</strong>{" "}
                    {idea.team.map((m) => m.name).join(", ")}
                  </p>
                )}
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => onApprove(idea._id)}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => onReject(idea._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Reject
                  </button>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );

  const renderStatus = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Accepted */}
      <div className="p-4 bg-green-50 border rounded shadow">
        <h3 className="font-bold mb-2 text-green-700">✅ Accepted Ideas</h3>
        {acceptedIdeas.length === 0 ? (
          <p>No accepted ideas.</p>
        ) : (
          acceptedIdeas.map((idea) => (
            <div key={idea._id} className="mb-2 border-b pb-2">
              <h4 className="font-semibold">{idea.title}</h4>
              <p className="text-sm text-gray-600">{idea.description}</p>
            </div>
          ))
        )}
      </div>

      {/* Rejected */}
      <div className="p-4 bg-red-50 border rounded shadow">
        <h3 className="font-bold mb-2 text-red-700">❌ Rejected Ideas</h3>
        {rejectedIdeas.length === 0 ? (
          <p>No rejected ideas.</p>
        ) : (
          rejectedIdeas.map((idea) => (
            <div key={idea._id} className="mb-2 border-b pb-2">
              <h4 className="font-semibold">{idea.title}</h4>
              <p className="text-sm text-gray-600">{idea.description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div>
      {/* Tab buttons */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setActiveTab("pending")}
          className={`px-4 py-2 rounded ${
            activeTab === "review" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Pending Ideas
        </button>
        <button
          onClick={() => setActiveTab("review")}
          className={`px-4 py-2 rounded ${
            activeTab === "status" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Review Ideas
        </button>
      </div>

      {/* Tab content */}
      {activeTab === "review" ? renderPending() : renderReview()}
    </div>
  );
};

export default HeadDashboardCards;
