// src/pages/student/ProjectIdeaForm.jsx
import React, { useEffect, useState } from "react";
import { submitProjectIdeaForm } from "../../services/studentService";
import {
  getAvailableMentors,
  getAvailableStudents,
} from "../../services/commonService";

const ProjectIdeaForm = ({ status }) => {
  const [mentors, setMentors] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    technology: "",
    mentor: "",
    teamMembers: [],
    academicYear: "", // same as BankForm
  });

  // Load mentors + students
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mentorList, members] = await Promise.all([
          getAvailableMentors(),
          getAvailableStudents(),
        ]);
        setMentors(mentorList || []);
        setTeamMembers(members || []);

        // ✅ Academic year always pulled from localStorage (same as BankForm)
        setFormData((prev) => ({
          ...prev,
          academicYear: localStorage.getItem("academicYear") || "",
        }));
      } catch (err) {
        console.error("Form load error:", err);
        setError("Failed to load form data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
      console.log("Submitting idea payload:", formData);

      // Don’t send academicYear, backend auto-fills it
      const { academicYear, ...payload } = formData;

      const res = await submitProjectIdeaForm(payload);

      setSuccess("Project Idea submitted successfully!");

      // ✅ Reset but preserve backend academicYear
      setFormData((prev) => ({
        ...prev,
        title: "",
        description: "",
        technology: "",
        mentor: null,
        teamMembers: [],
        academicYear: res.data?.academicYear || prev.academicYear,
      }));
    } catch (err) {
      console.error("Error submitting project idea:", err);
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

      {/* Title */}
      <label className="block mt-4">Title:</label>
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />

      {/* Description */}
      <label className="block mt-4">Description:</label>
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />

      {/* Technology */}
      <label className="block mt-4">Technology:</label>
      <input
        type="text"
        name="technology"
        value={formData.technology}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />

      {/* Academic Year – readonly (same as BankForm) */}
      <label className="block mt-4">Academic Year:</label>
      <input type="text" value={formData.academicYear} readOnly className="w-full p-2 border rounded bg-gray-100" />

      <label className="block mt-4">Branch:</label>
      <input type="text" name="branch" value={localStorage.getItem("branch") || ""} readOnly className="w-full p-2 border rounded bg-gray-100" />

       <label className="block mt-4">Section:</label>
      <input type="text" name="section" value={localStorage.getItem("section") || ""} readOnly className="w-full p-2 border rounded bg-gray-100" />

      <label className="block mt-4">Group:</label>
      <input type="text" name="group" value={localStorage.getItem("group") || ""} readOnly className="w-full p-2 border rounded bg-gray-100" />
       

      {/* Team members */}
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
              {s.name} ({s.rollno || s._id})
            </option>
          ))
        ) : (
          <option disabled>No team members available</option>
        )}
      </select>

      {/* Mentor – only enabled if interview passed */}
      <label className="block mt-4">Select Mentor:</label>
      <select
        name="mentor"
        value={formData.mentor}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        disabled={status !== "interview_passed"}
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

      <button
        type="submit"
        className="mt-6 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Submit Project Idea
      </button>
    </form>
  );
};

export default ProjectIdeaForm;
