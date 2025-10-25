import React, { useEffect, useState } from "react";
import { getScheduledInterviews, reviewInterview } from "../../../services/headService";

const InterviewStatus = ({ academicYear }) => {
  const [ideas, setIdeas] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [loading, setLoading] = useState(true);

  // Modal states for failing
  const [showModal, setShowModal] = useState(false);
  const [currentIdeaId, setCurrentIdeaId] = useState(null);

  useEffect(() => {
    if (academicYear) fetchInterviews();
  }, [academicYear]);

  const fetchInterviews = async () => {
    setLoading(true);
    try {
      const data = await getScheduledInterviews(academicYear);
      setIdeas(data);
    } catch (err) {
      console.error("Error fetching interviews:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePass = async (id) => {
    try {
      await reviewInterview(id, "pass");
      fetchInterviews();
    } catch (err) {
      console.error("Error marking as passed:", err);
    }
  };

  const handleFailClick = (id) => {
    setCurrentIdeaId(id);
    setShowModal(true);
  };

  const handleFailConfirm = async () => {
    try {
      await reviewInterview(currentIdeaId, "fail");
      setShowModal(false);
      setCurrentIdeaId(null);
      fetchInterviews();
    } catch (err) {
      console.error("Error marking as failed:", err);
    }
  };

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const scheduledInterviews = ideas.filter((i) => i.status === "interview_scheduled");
  const passedInterviews = ideas.filter((i) => i.status === "interview_passed");
  const failedInterviews = ideas.filter((i) => i.status === "interview_failed");

  const renderIdeaDetails = (idea) => (
    <div className="mt-3 text-gray-700">
      <p>{idea.description}</p>
      <p className="mt-2">
        <span className="font-medium">Technology:</span> {idea.technology}
      </p>
      {idea.teamLead && (
        <p className="mt-1">
          <span className="font-medium">Team Lead:</span> {idea.teamLead.name} ({idea.teamLead.email})
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
  );

  const renderIdeaCard = (idea, showActions = false, cardColor = "") => (
    <div
      key={idea._id}
      className={`border rounded p-4 mb-3 shadow hover:shadow-md transition ${cardColor}`}
    >
      <div className="flex justify-between items-center">
        <h3
          onClick={() => toggleExpand(idea._id)}
          className="font-semibold text-lg cursor-pointer hover:text-blue-600"
        >
          {idea.title}
        </h3>
        {showActions && (
          <div className="flex gap-2">
            <button
              onClick={() => handlePass(idea._id)}
              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
            >
              Pass
            </button>
            <button
              onClick={() => handleFailClick(idea._id)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Fail
            </button>
          </div>
        )}
      </div>
      {expanded[idea._id] && renderIdeaDetails(idea)}
    </div>
  );

  return (
    <div className="p-4">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* Scheduled Interviews */}
          <h2 className="text-xl font-bold mb-3">Scheduled Interviews</h2>
          {scheduledInterviews.length === 0 ? (
            <p>No scheduled interviews</p>
          ) : (
            scheduledInterviews.map((idea) => renderIdeaCard(idea, true))
          )}

          {/* Passed and Failed side by side */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded shadow">
              <h2 className="text-lg font-bold text-green-800 mb-3">
                Passed Interviews ({passedInterviews.length})
              </h2>
              {passedInterviews.length === 0 ? (
                <p>No passed interviews</p>
              ) : (
                passedInterviews.map((idea) => renderIdeaCard(idea, false))
              )}
            </div>
            <div className="bg-red-50 p-4 rounded shadow">
              <h2 className="text-lg font-bold text-red-800 mb-3">
                Failed Interviews ({failedInterviews.length})
              </h2>
              {failedInterviews.length === 0 ? (
                <p>No failed interviews</p>
              ) : (
                failedInterviews.map((idea) => renderIdeaCard(idea, false))
              )}
            </div>
          </div>
        </>
      )}

      {/* Fail Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h3 className="text-lg font-semibold mb-3">Fail Interview</h3>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleFailConfirm}
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
              >
                Fail
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewStatus;
