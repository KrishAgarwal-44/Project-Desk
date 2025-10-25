// src/pages/student/StudentDashboard.jsx
import React, { useEffect, useState } from "react";
import SideMenu from "../../components/SideMenu";
import ProjectIdeaForm from "./ProjectIdeaForm";
import ProjectBankForm from "./ProjectBankForm";
import MentorList from "./MentorList";
import Documentation from "./Documentation";
import StudentMessage from "./StudentMessage";
import StudentDashboardCards from "../../components/StudentDashboardCards";
import {getMyAssignedProject,getMyIdeaProject,} from "../../services/studentService";
import Form3Student from "./Form3Student";
import ProjectDetails from "./ProjectDetails";

const StudentDashboard = () => {
  const [section, setSection] = useState("dashboard");
  const [assignedProject, setAssignedProject] = useState(null);
  const [ideaProject, setIdeaProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDetailsModal, setShowDetailsModal] = useState(false); // modal state

  // Fetch assigned project only for "My Project" section
  useEffect(() => {
    if (section !== "dashboard") return;

    const fetchAssignedProject = async () => {
      setLoading(true);
      setError("");
      try {
        const project = await getMyAssignedProject();
        const idea = await getMyIdeaProject();
        setAssignedProject(project);
        setIdeaProject(idea);
      } catch (err) {
        console.error("Error fetching assigned project:", err);
        setError("Failed to load project data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedProject();
  }, [section]);

  const renderSection = () => {
    switch (section) {
      case "dashboard":
        if (loading) return <p>Loading project data...</p>;
        if (error) return <p className="text-red-500">{error}</p>;

        return (
          <>
            <StudentDashboardCards
              assignStatus={assignedProject}
              ideaStatus={ideaProject}
              onIdeaClick={() => setShowDetailsModal(true)} // open modal
            />
            {showDetailsModal && ideaProject && (
              <ProjectDetails
                project={ideaProject}
                onClose={() => setShowDetailsModal(false)} // close modal
              />
            )}
          </>
        );

      case "projectIdea":
        return <ProjectIdeaForm />;

      case "projectBank":
        return <ProjectBankForm />;

      case "mentorList":
        return <MentorList />;

      case "messages":
        return <StudentMessage />;

      case "documentation":
        return <Documentation />;

      case "form3":
        return <Form3Student />;

      default:
        return <p>Invalid section</p>;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SideMenu activeMenu={section} setSection={setSection} />
      <div className="flex-1 p-6">{renderSection()}</div>
    </div>
  );
};

export default StudentDashboard;
