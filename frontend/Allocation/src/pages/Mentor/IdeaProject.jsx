import React, { useEffect, useState } from "react";
import {
  getMentorIdeaProjects,
  reviewIdeaProject,
} from "../../services/mentorService";

export default function IdeaProject() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch mentor's idea projects
  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMentorIdeaProjects();
      setProjects(data.projects || []);
    } catch (err) {
      console.error("Error fetching idea projects:", err);
      setError(err.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Handle mentor review
  const handleReview = async (id, action) => {
    const feedback = prompt("Enter feedback (optional)"); // optional feedback
    try {
      const res = await reviewIdeaProject(id, action, feedback);
      alert(res.message);
      // Update local state
      setProjects((prev) =>
        prev.map((p) => (p._id === id ? res.project : p))
      );
    } catch (err) {
      alert(err.message || "Failed to update project");
    }
  };

  if (loading) return <p>Loading idea projects...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!projects.length) return <p>No idea projects assigned to you yet.</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Idea Projects Assigned</h2>
      <table className="w-full border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border">Title</th>
            <th className="px-4 py-2 border">Description</th>
            <th className="px-4 py-2 border">Technology</th>
            <th className="px-4 py-2 border">Team Lead</th>
            <th className="px-4 py-2 border">Team Members</th>
            <th className="px-4 py-2 border">Status</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project._id}>
              <td className="px-4 py-2 border">{project.title}</td>
              <td className="px-4 py-2 border">{project.description}</td>
              <td className="px-4 py-2 border">{project.technology}</td>
              <td className="px-4 py-2 border">{project.teamLead?.name}</td>
              <td className="px-4 py-2 border">
                {project.teamMembers?.map((m) => m.name).join(", ")}
              </td>
              <td className="px-4 py-2 border">{project.status}</td>
              <td className="px-4 py-2 border">
                {project.status === "interview_passed" && (
                  <>
                    <button
                      onClick={() => handleReview(project._id, "approve")}
                      className="mr-2 px-3 py-1 bg-green-500 text-white rounded"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReview(project._id, "reject")}
                      className="px-3 py-1 bg-red-500 text-white rounded"
                    >
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}