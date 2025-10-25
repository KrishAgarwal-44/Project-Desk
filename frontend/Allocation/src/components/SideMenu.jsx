// src/components/SideMenu.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const SideMenu = ({ activeMenu, setSection }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen p-4">
      {/* User Info */}
      <div className="mb-6">
        <h2 className="text-lg font-bold">{user?.name || "User"}</h2>
        <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
      </div>

      {/* Menu Items */}
      <div className="flex flex-col gap-2">
        {/* Head-specific */}
        {user?.role === "head" && (
          <>
            <button
              onClick={() => setSection("dashboard")}
              className={`px-4 py-2 rounded ${
                activeMenu === "dashboard"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              Dashboard
            </button>

            <button
              onClick={() => setSection("reviewProjects")}
              className={`px-4 py-2 rounded ${
                activeMenu === "reviewProjects"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              Review Projects
            </button>

            <button
              onClick={() => setSection("uploads")}
              className={`px-4 py-2 rounded ${
                activeMenu === "uploads"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              Uploads
            </button>

            <button
              onClick={() => setSection("messages")}
              className={`px-4 py-2 rounded ${
                activeMenu === "messages"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              Messages
            </button>

            <button
              onClick={() => setSection("documents")}
              className={`px-4 py-2 rounded ${
                activeMenu === "documents"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              Documents
            </button>

            <button
              onClick={() => setSection("form3")}
              className={`px-4 py-2 rounded ${
                activeMenu === "form3Management"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100"
              }`}
              >
                Form3
              </button>
          </>
        )}

        {/* Student-specific */}
        {user?.role === "student" && (
          <>
            <button
              onClick={() => setSection("dashboard")}
              className={`px-4 py-2 rounded ${
                activeMenu === "dashboard"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              My Project
            </button>

            <button
              onClick={() => setSection("projectIdea")}
              className={`px-4 py-2 rounded ${
                activeMenu === "projectIdea"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              Project Idea
            </button>
            <button
              onClick={() => setSection("projectBank")}
              className={`px-4 py-2 rounded ${
                activeMenu === "projectBank"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              Project Bank
            </button>
            <button
              onClick={() => setSection("mentorList")}
              className={`px-4 py-2 rounded ${
                activeMenu === "mentorList"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              Mentor List
            </button>
             <button
              onClick={() => setSection("documentation")}
              className={`px-4 py-2 rounded ${
                activeMenu === "documentation"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              Documentation
            </button>

             {/* ✅ Form3 access button */}
 <button
      onClick={() => setSection("form3")}
      className={`px-4 py-2 rounded ${
        activeMenu === "form3"
          ? "bg-blue-600 text-white"
          : "hover:bg-gray-100"
      }`}
    >
      Form3
    </button>
          </>
        )}

        {/* Mentor-specific */}
        {user?.role === "mentor" && (
          <>
            <button
              onClick={() => setSection("dashboard")}
              className={`px-4 py-2 rounded ${
                activeMenu === "dashboard"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              Dashboard
            </button>

            <button
              onClick={() => setSection("mentorIdeaProjects")}
              className={`px-4 py-2 rounded ${
                activeMenu === "mentorIdeaProjects"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              Project Ideas
            </button>
            <button
              onClick={() => setSection("mentorBankProjects")}
              className={`px-4 py-2 rounded ${
                activeMenu === "mentorBankProjects"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              Project Bank
            </button>
            <button
              onClick={() => setSection("messages")}
              className={`px-4 py-2 rounded ${
                activeMenu === "messages"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              Messages
            </button>
            <button
              onClick={() => setSection("documents")}
              className={`px-4 py-2 rounded ${
                activeMenu === "documents"  
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              Documents
            </button>

                {/* ✅ Form3 access button */}
                <button
                  onClick={() => setSection("form3m")}
                  className={`px-4 py-2 rounded ${
                    activeMenu === "form3m"
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  Form3
                </button>



          </>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="px-4 py-2 mt-4 rounded bg-red-500 text-white hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default SideMenu;
