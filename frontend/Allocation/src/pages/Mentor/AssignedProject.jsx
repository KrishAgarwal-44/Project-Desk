import React, { useEffect, useState } from "react";
import { getMentorProject, reviewAssignedProject } from "../../services/mentorService";

const AssignedProject = () => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getMentorProject();
        setProject(data.project);
      } catch (err) {
        console.error(err);
        setError("Failed to load project.");
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, []);

  const handleReview = async (action) => {
    try {
      const res = await reviewAssignedProject(action);
      alert(res.message);
      setProject(res.project);
    } catch (err) {
      alert(err.message || "Failed to update project status");
    }
  };

  if (loading) return <p>Loading project...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!project) return <p>No project assigned yet.</p>;

  return (
    <div className="p-4 bg-white rounded shadow-md space-y-2 max-w-3xl mx-auto text-base">
      <h2 className="mb-2">Assigned Project</h2>

      <p><strong>Project ID:</strong> {project.projectId?._id || project.projectId}</p>
      <p><strong>Title:</strong> {project.title}</p>
      <p><strong>Description:</strong> {project.description}</p>
      <p><strong>Technology:</strong> {project.technology}</p>
      <p><strong>Academic Year:</strong> {project.academicYear}</p>
      <p><strong>Branch / Section / Group:</strong> {project.branch} / {project.section} / {project.group}</p>
      <p><strong>Team Lead:</strong> {project.teamLead?.name || "N/A"}</p>
      <p>
        <strong>Team Members:</strong>{" "}
        {project.teamMembers?.length
          ? project.teamMembers.map((m) => m.name || m).join(", ")
          : "N/A"}
      </p>
      <p><strong>Selected Mentor:</strong> {project.selectedMentor?.name || project.selectedMentor || "N/A"}</p>
      <p><strong>Approved Mentor:</strong> {project.approvedMentor?.name || project.approvedMentor || "N/A"}</p>
      <p><strong>Status:</strong> {project.status}</p>

      {project.status === "pending" && (
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => handleReview("approve")}
            className="px-3 py-1 bg-green-500 text-white rounded"
          >
            Approve
          </button>
          <button
            onClick={() => handleReview("reject")}
            className="px-3 py-1 bg-red-500 text-white rounded"
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
};

export default AssignedProject;
