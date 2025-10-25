import React, { useState } from "react";
import SideMenu from "../../components/SideMenu";
import Documentation from "./Documentation";
import AssignedProject from "./AssignedProject";
import MentorMessage from "./MentorMessage";
import Form3Mentor from "./Form3Mentor";
import IdeaProject from "./IdeaProject";

const MentorDashboard = () => {
  const [section, setSection] = useState("dashboard"); // default

  const renderSection = () => {
    switch (section) {
      case "dashboard":
        return (
          <div>
            <h1 className="text-2xl font-bold mb-4">Mentor Dashboard</h1>
            <p className="text-gray-600">Welcome to your dashboard. Use the side menu to navigate.</p>
          </div>
        );

      case "mentorIdeas": // project ideas section
        return <IdeaProject/>;

      case "mentorBankProjects": // assigned project / project bank
        return <AssignedProject />;

      case "documents":
        return <Documentation />;

      case "messages":
        return <MentorMessage />;

      case "form3Mentor":
        return <Form3Mentor/>;

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

export default MentorDashboard;

