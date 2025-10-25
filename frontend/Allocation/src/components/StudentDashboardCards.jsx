import React from "react";

const StudentDashboardCards = ({ assignStatus, ideaStatus, onIdeaClick }) => {
  const renderCard = (project, title, clickable = false) => {
    if (!project) {
      return (
        <div className="p-6 bg-white shadow rounded">
          <h2 className="text-xl font-bold mb-4">{title}</h2>
          <p>No project submitted yet.</p>
        </div>
      );
    }

    const mentorName =
      project.selectedMentor?.name ||
      project.approvedMentor?.name ||
      project.mentor?.name ||
      "Not assigned";

    const status = project.status
      ? project.status.charAt(0).toUpperCase() + project.status.slice(1)
      : "Pending";

    const team = project.teamMembers || [];

    return (
      <div
        className={`p-6 bg-white shadow rounded ${
          clickable ? "cursor-pointer hover:bg-gray-100" : ""
        }`}
        onClick={clickable ? onIdeaClick : undefined} // only clickable card has onClick
      >
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
        <p className="text-sm text-gray-600 mb-2">{project.description}</p>
        <p className="text-sm">
          <strong>Mentor:</strong> {mentorName}
        </p>
        <p className="text-sm mt-2">
          <strong>Status:</strong>{" "}
          <span
            className={`font-semibold ${
              status === "Pending"
                ? "text-yellow-600"
                : status === "Approved"
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {status}
          </span>
        </p>

        {team.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Team Members:</h4>
            <ul className="space-y-1">
              {team.map((member) => (
                <li key={member._id} className="text-sm text-gray-700">
                  {member.name} ({member.rollno})
                </li>
              ))}
            </ul>
          </div>
        )}

        {project.teamLead && (
          <p className="mt-2 text-sm">
            <strong>Team Lead:</strong> {project.teamLead.name} (
            {project.teamLead.email})
          </p>
        )}

        <p className="mt-2 text-sm">
          <strong>Academic Year:</strong> {project.academicYear}
        </p>
      </div>
    );
  };

  if (!assignStatus && !ideaStatus) {
    return <p>No project assigned or idea submitted yet.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {renderCard(ideaStatus, "My Project Idea", true)} {/* clickable */}
      {renderCard(assignStatus, "My Assigned Project")} {/* not clickable */}
    </div>
  );
};

export default StudentDashboardCards;