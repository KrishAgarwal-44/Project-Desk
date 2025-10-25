import React, { useEffect, useState } from "react";
import {
  getAcceptedIdeasForInterview,
  scheduleInterview,
} from "../../../services/headService";

const ScheduleInterview = () => {
  const [ideas, setIdeas] = useState([]);
  const [selectedIdeaId, setSelectedIdeaId] = useState(null);
  const [interviewDetails, setInterviewDetails] = useState({
    date: "",
    time: "",
    location: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchIdeas() {
      try {
        const data = await getAcceptedIdeasForInterview();
        setIdeas(data);
      } catch (error) {
        console.error("Failed to fetch accepted ideas:", error);
      }
    }
    fetchIdeas();
  }, []);

  const handleChange = (e) => {
    setInterviewDetails({
      ...interviewDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSchedule = async (ideaId) => {
    const { date, time, location } = interviewDetails;
    if (!date || !time || !location) {
      return alert("Please fill in date, time, and location.");
    }

    setLoading(true);
    try {
      await scheduleInterview(ideaId, interviewDetails);

      // Update idea status locally
      setIdeas((prev) =>
        prev.map((idea) =>
          idea._id === ideaId
            ? { ...idea, status: "interview_scheduled" }
            : idea
        )
      );

      alert("Interview scheduled successfully!");
      setSelectedIdeaId(null);
      setInterviewDetails({ date: "", time: "", location: "", notes: "" });
    } catch (error) {
      console.error(error);
      alert("Failed to schedule interview");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Accepted Project Ideas</h2>

      {ideas.length === 0 && (
        <p className="text-gray-500">No accepted ideas available.</p>
      )}

      <div className="space-y-4">
        {ideas.map((idea) => {
          const isSelected = selectedIdeaId === idea._id;
          const isScheduled = idea.status === "interview_scheduled";

          return (
            <div
              key={idea._id}
              className={`p-4 border rounded-lg shadow-sm transition 
                         ${
                           isSelected
                             ? "border-blue-500 bg-blue-50"
                             : "hover:shadow-md hover:bg-gray-50"
                         }
                         ${
                           isScheduled
                             ? "opacity-50 cursor-not-allowed"
                             : "cursor-pointer"
                         }`}
              onClick={() =>
                !isScheduled && setSelectedIdeaId(isSelected ? null : idea._id)
              }
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-blue-600 hover:underline">
                    {idea.title}
                  </h3>
                  <p className="text-gray-700">
                    Team Lead: {idea.teamLead?.name || "N/A"}
                  </p>
                  <p className="text-gray-600">
                    Description: {idea.description || "N/A"}
                  </p>
                </div>
                {isScheduled && (
                  <span className="ml-2 px-2 py-1 text-xs bg-green-200 text-green-800 rounded">
                    Scheduled
                  </span>
                )}
              </div>

              {isSelected && !isScheduled && (
                <div
                  className="mt-4 p-4 border-t border-gray-200 bg-white rounded-md shadow-inner"
                  onClick={(e) => e.stopPropagation()} // Prevent collapsing when interacting with form
                >
                  <h4 className="text-md font-semibold mb-2">
                    Schedule Interview
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700">Date</label>
                      <input
                        type="date"
                        name="date"
                        value={interviewDetails.date}
                        onChange={handleChange}
                        className="mt-1 block w-full border rounded-md p-2"
                        min={new Date().toISOString().split("T")[0]} // <-- prevents past dates
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700">Time</label>
                      <input
                        type="time"
                        name="time"
                        value={interviewDetails.time}
                        onChange={handleChange}
                        className="mt-1 block w-full border rounded-md p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700">Location</label>
                      <input
                        type="text"
                        name="location"
                        placeholder="Interview Location"
                        value={interviewDetails.location}
                        onChange={handleChange}
                        className="mt-1 block w-full border rounded-md p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700">Notes</label>
                      <textarea
                        name="notes"
                        placeholder="Additional notes"
                        value={interviewDetails.notes}
                        onChange={handleChange}
                        className="mt-1 block w-full border rounded-md p-2 h-24"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => handleSchedule(idea._id)}
                    disabled={loading}
                    className={`mt-4 px-6 py-2 rounded-md transition 
                                ${
                                  loading
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-blue-600 text-white hover:bg-blue-700"
                                }`}
                  >
                    {loading ? "Scheduling..." : "Schedule Interview"}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ScheduleInterview;
