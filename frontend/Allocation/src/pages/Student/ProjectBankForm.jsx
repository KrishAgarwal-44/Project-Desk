// src/pages/student/ProjectBankForm.jsx
import React, { useEffect, useState } from "react";
import {
  getProjectBankList,
  submitProjectBankForm,
} from "../../services/studentService";
import {
  getAvailableMentors,
  getAvailableStudents,
} from "../../services/commonService";

const ProjectBankForm = () => {
  const [projects, setProjects] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    projectId: "",
    title: "",
    description: "",
    technology: "",
    selectedMentor: "", // ✅ track selected mentor

    teamMembers: [],
    academicYear: "",
    branch: "",
    section: "",
    group: "",
  });

  // Fetch projects, mentors, and team members
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projList, mentorList, members] = await Promise.all([
          getProjectBankList(),
          getAvailableMentors(),
          getAvailableStudents(),
        ]);

        setProjects(projList || []);
        setMentors(mentorList || []);
        setTeamMembers(members || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load form data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Autofill project details when a project is selected
  useEffect(() => {
    if (!formData.projectId) return;
    const selectedProject = projects.find((p) => p._id === formData.projectId);
    if (selectedProject) {
      setFormData((prev) => ({
        ...prev,
        title: selectedProject.title || "",
        description: selectedProject.description || "",
        technology: selectedProject.technology || "",
        academicYear:
          selectedProject.academicYear ||
          localStorage.getItem("academicYear") ||
          "",
        branch: selectedProject.branch || localStorage.getItem("branch") || "",
        section:
          selectedProject.section || localStorage.getItem("section") || "",
        group: selectedProject.group || localStorage.getItem("group") || "",
      }));
    }
  }, [formData.projectId, projects]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTeamMemberChange = (e) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) selected.push(options[i].value);
    }
    setFormData((prev) => ({ ...prev, teamMembers: selected }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (!formData.projectId) throw new Error("Please select a project.");

      const payload = {
        student: localStorage.getItem("studentId"),
        projectId: formData.projectId,
        title: formData.title,
        description: formData.description,
        technology: formData.technology,
        selectedMentor: formData.selectedMentor, // ✅ send selected mentor

        teamMembers: formData.teamMembers || [],
        teamLead: {
          id: localStorage.getItem("studentId"),
          name: localStorage.getItem("studentName"),
          email: localStorage.getItem("studentEmail"),
        },
        academicYear:
          formData.academicYear || localStorage.getItem("academicYear") || "",
        branch: formData.branch || localStorage.getItem("branch") || "",
        section: formData.section || localStorage.getItem("section") || "",
        group: formData.group || localStorage.getItem("group") || "",
      };

      console.log("Submitting payload:", payload); // debug

      await submitProjectBankForm(payload);

      setSuccess("Project submitted successfully!");
      setFormData({
        projectId: "",
        title: "",
        description: "",
        technology: "",
        selectedMentor: "",

        teamMembers: [],
        academicYear: "",
        branch: "",
        section: "",
        group: "",
      });
    } catch (err) {
      console.error("Error submitting project bank form:", err);
      setError(err.message || "Submission failed");
    }
  };

  if (loading) return <p>Loading form...</p>;

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded shadow-md max-w-3xl mx-auto"
    >
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      {/* Project selection */}
      <label className="block mt-4">Select Project:</label>
      <select
        name="projectId"
        value={formData.projectId}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      >
        <option value="">-- Select a Project --</option>
        {projects.length > 0 ? (
          projects.map((p) => (
            <option key={p._id} value={p._id}>
              {p.title}
            </option>
          ))
        ) : (
          <option disabled>No projects available</option>
        )}
      </select>

      {/* Autofilled fields */}
      {formData.projectId && (
        <>
          <label className="block mt-4">Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            readOnly
            className="w-full p-2 border rounded bg-gray-100"
          />

          <label className="block mt-4">Description:</label>
          <textarea
            name="description"
            value={formData.description}
            readOnly
            className="w-full p-2 border rounded bg-gray-100"
          />

          <label className="block mt-4">Technology:</label>
          <input
            type="text"
            name="technology"
            value={formData.technology}
            readOnly
            className="w-full p-2 border rounded bg-gray-100"
          />

          <label className="block mt-4">Academic Year:</label>
          <input
            type="text"
            name="academicYear"
            value={formData.academicYear}
            readOnly
            className="w-full p-2 border rounded bg-gray-100"
          />

          <label className="block mt-4">Branch:</label>
          <input
            type="text"
            name="branch"
            value={formData.branch}
            readOnly
            className="w-full p-2 border rounded bg-gray-100"
          />

          <label className="block mt-4">Section:</label>
          <input
            type="text"
            name="section"
            value={formData.section}
            readOnly
            className="w-full p-2 border rounded bg-gray-100"
          />

          <label className="block mt-4">Group:</label>
          <input
            type="text"
            name="group"
            value={formData.group}
            readOnly
            className="w-full p-2 border rounded bg-gray-100"
          />
        </>
      )}

      {/* Mentor selection */}
      {/* <label className="block mt-4">Select Mentor:</label>
      <select name="mentorId" value={formData.mentorId} onChange={handleChange} className="w-full p-2 border rounded">
        <option value="">-- Select a Mentor --</option>
        {mentors.length > 0
          ? mentors.map((m) => <option key={m._id} value={m._id}>{m.name}</option>)
          : <option disabled>No mentors available</option>}
      </select> */}
      <label className="block mt-4">Select Mentor:</label>
      <select
        name="selectedMentor"
        value={formData.selectedMentor}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      >
        <option value="">-- Select a Mentor --</option>
        {mentors.length > 0 ? (
          mentors.map((m) => (
            <option key={m._id} value={m._id}>
              {m.name}
            </option>
          ))
        ) : (
          <option disabled>No mentors available</option>
        )}
      </select>

      {/* Team members selection */}
      <label className="block mt-4">Select Team Members:</label>
      <select
        multiple
        value={formData.teamMembers}
        onChange={handleTeamMemberChange}
        className="w-full p-2 border rounded h-32"
      >
        {teamMembers.length > 0 ? (
          teamMembers.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name} ({s.rollno})
            </option>
          ))
        ) : (
          <option disabled>No team members available</option>
        )}
      </select>

      <button
        type="submit"
        className="mt-6 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Submit Project
      </button>
    </form>
  );
};

export default ProjectBankForm;
