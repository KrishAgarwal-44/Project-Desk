import React, { useEffect, useState } from "react";
import {
  getPendingIdeasForHead,
  reviewIdeaByHead,
} from "../../../services/headService";

const PendingIdeas = ({ academicYear }) => {
  const [ideas, setIdeas] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [currentIdeaId, setCurrentIdeaId] = useState(null);
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (academicYear) {
      fetchIdeas();
    }
  }, [academicYear]);

  const fetchIdeas = async () => {
    try {
      const data = await getPendingIdeasForHead(academicYear);
      setIdeas(data);
    } catch (err) {
      console.error("Error fetching ideas:", err);
    }
  };

  const handleApprove = async (id) => {
    try {
      await reviewIdeaByHead(id, "approve");
      fetchIdeas();
    } catch (err) {
      console.error("Error approving idea:", err);
    }
  };

  const handleRejectClick = (id) => {
    setCurrentIdeaId(id);
    setReason("");
    setShowModal(true);
  };

  const handleRejectConfirm = async () => {
    try {
      await reviewIdeaByHead(currentIdeaId, "reject", reason || "No remarks provided");
      setShowModal(false);
      setCurrentIdeaId(null);
      fetchIdeas();
    } catch (err) {
      console.error("Error rejecting idea:", err);
    }
  };

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">
        Pending Project Ideas ({academicYear})
      </h2>
      {ideas.length === 0 ? (
        <p>No pending ideas</p>
      ) : (
        ideas.map((idea) => (
          <div
            key={idea._id}
            className="border rounded p-4 mb-3 shadow hover:shadow-md transition"
          >
            {/* Title + Buttons Row */}
            <div className="flex justify-between items-center">
              <h3
                onClick={() => toggleExpand(idea._id)}
                className="font-semibold text-lg cursor-pointer hover:text-blue-600"
              >
                {idea.title}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleApprove(idea._id)}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleRejectClick(idea._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Reject
                </button>
              </div>
            </div>

            {/* Expanded Details */}
            {expanded[idea._id] && (
              <div className="mt-3 text-gray-700">
                <p>{idea.description}</p>
                <p className="mt-2">
                  <span className="font-medium">Technology:</span>{" "}
                  {idea.technology}
                </p>
                {idea.teamLead && (
                  <p className="mt-1">
                    <span className="font-medium">Team Lead:</span>{" "}
                    {idea.teamLead.name} ({idea.teamLead.email})
                  </p>
                )}
                {idea.teamMembers?.length > 0 && (
                  <div className="mt-2">
                    <span className="font-medium">Team Members:</span>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {idea.teamMembers.map((member) => (
                        <li key={member._id}>
                          {member.name} ({member.rollno})
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        ))
      )}

      {/* Reject Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h3 className="text-lg font-semibold mb-3">Reject Project Idea</h3>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full border rounded p-2 mb-4"
              rows="4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectConfirm}
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingIdeas;

