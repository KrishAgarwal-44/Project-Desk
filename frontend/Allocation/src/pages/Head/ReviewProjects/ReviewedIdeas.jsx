// src/pages/head/projectideas/ReviewedIdeas.jsx
import React, { useEffect, useState } from "react";
import { getReviewedIdeasForHead } from "../../../services/headService";

const ReviewedIdeas = ({ academicYear }) => {
  const [accepted, setAccepted] = useState([]);
  const [rejected, setRejected] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const data = await getReviewedIdeasForHead(academicYear);

        // Separate approved & rejected
        const approvedIdeas = data.filter(
          (idea) => idea.status === "approved_by_head"
        );
        const rejectedIdeas = data.filter(
          (idea) => idea.status === "rejected_by_head"
        );

        setAccepted(approvedIdeas);
        setRejected(rejectedIdeas);
      } catch (err) {
        console.error("Error fetching reviewed ideas:", err);
      } finally {
        setLoading(false);
      }
    };

    if (academicYear) fetchIdeas();
  }, [academicYear]);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Reviewed Project Ideas</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ✅ Accepted Ideas */}
        <div className="bg-green-50 border border-green-300 rounded-lg p-6 shadow">
          <h3 className="text-lg font-semibold text-green-700 mb-4">
            Accepted Ideas
          </h3>
          {accepted.length === 0 ? (
            <p className="text-gray-500">No accepted ideas.</p>
          ) : (
            accepted.map((idea) => (
              <div
                key={idea._id}
                className="mb-4 p-4 bg-white border rounded shadow-sm"
              >
                <h4 className="font-bold text-gray-800">{idea.title}</h4>
                <p className="text-sm text-gray-600">{idea.description}</p>
              </div>
            ))
          )}
        </div>

        {/* ❌ Rejected Ideas */}
        <div className="bg-red-50 border border-red-300 rounded-lg p-6 shadow">
          <h3 className="text-lg font-semibold text-red-700 mb-4">
            Rejected Ideas
          </h3>
          {rejected.length === 0 ? (
            <p className="text-gray-500">No rejected ideas.</p>
          ) : (
            rejected.map((idea) => (
              <div
                key={idea._id}
                className="mb-4 p-4 bg-white border rounded shadow-sm"
              >
                <h4 className="font-bold text-gray-800">{idea.title}</h4>
                <p className="text-sm text-gray-600">{idea.description}</p>
                {idea.headRemarks && (
                  <p className="text-sm text-gray-500 mt-1">
                    <strong>Remarks:</strong> {idea.headRemarks}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewedIdeas;
