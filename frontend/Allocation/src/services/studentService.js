//studentservice.js
import api from "../utils/axios";

// Get all projects from project bank
export const getProjectBankList = async () => {
  try {
    const res = await api.get("/student/project-bank");
    return res.data.projects || [];
  } catch (error) {
    console.error("Error fetching project bank list:", error);
    return [];
  }
};

// Submit project selection from bank
export const submitProjectBankForm = async (formData) => {
  try {
    const payload = {
      student: localStorage.getItem("studentId"),
      projectId: formData.projectId,
      title: formData.title,
      description: formData.description,
      technology: formData.technology,
      selectedMentor: formData.selectedMentor, // Mentor ID
      teamMembers: formData.teamMembers || [],
      teamLead: {
        id: localStorage.getItem("studentId"),
        name: localStorage.getItem("studentName"),
        email: localStorage.getItem("studentEmail"),
      },
      academicYear: localStorage.getItem("academicYear"),
      branch: localStorage.getItem("branch"),
      section: localStorage.getItem("section"),
      group: localStorage.getItem("group"),
    };

    const res = await api.post("/student/submit-bank", payload);
    return res.data.data; 
  } catch (error) {
    console.error("Error submitting project bank form:", error);
    throw new Error(
      error.response?.data?.message || "Failed to submit project bank form"
    );
  }
};
// Submit project idea form
export const submitProjectIdeaForm = async (formData) => {
  try {
    const payload = {
      title: formData.title,
      description: formData.description,
      technology: formData.technology,
      teamMembers: formData.teamMembers || [],
    };

    // ✅ Only add mentor if provided
    if (formData.mentor) {
      payload.mentor = formData.mentor;
    }

    const res = await api.post("/student/submit-idea", payload);
    return res.data.data; // projectIdea from backend
  } catch (error) {
    console.error("Error submitting project idea:", error);
    throw new Error(
      error.response?.data?.message || "Failed to submit project idea"
    );
  }
};

// export const selectIdeaMentor = async (ideaId, mentorId) => {
//   // assuming you use axios instance `api` with base '/api' or similar
//   const res = await api.put(`/student/idea-project/${ideaId}/mentor`, { mentorId });
//   return res.data;
// };

// Get my idea project
export const getMyIdeaProject = async () => {
  try {
    const res = await api.get("/student/idea-project");
    return res.data.projectIdea;
  } catch (error) {
    console.error("Error fetching idea project:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch idea project"
    );
  }
};

// Get student's assigned project only
export const getMyAssignedProject = async () => {
  try {
    const res = await api.get("/student/assigned-project");
    return res.data.project;
  } catch (error) {
    console.error("Error fetching assigned project:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch assigned project"
    );
  }
};

export const getMentorList = async () => {
  try {
    const res = await api.get("/student/mentors"); // API endpoint
    // ensure it's an array
    if (Array.isArray(res.data)) {
      return res.data;
    } else if (res.data && Array.isArray(res.data.mentors)) {
      return res.data.mentors; // in case backend wraps data
    } else {
      console.warn("Unexpected mentor data:", res.data);
      return [];
    }
  } catch (err) {
    console.error("Error fetching mentors:", err);
    return [];
  }
};

export const getDocuments = async () => {
  const res = await api.get("/student/documents");
  return res.data;
};

export const downloadDocument = async (id, fileName) => {
  const res = await api.get(`/student/documents/download/${id}`, {
    responseType: "blob",
  });

  // trigger download
  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export const getMyForm3 = async () => {
  const res = await api.get("/student/form3");
  return res.data;
};

export const updateForm3Week = async (form3Id, weekNumber, weekData) => {
  const response = await api.put(`/student/form3/${form3Id}/week/${weekNumber}`, weekData);
  return response.data;
};

export const assignMentorToProject = async ({ projectId, mentorId }) => {
  try {
    const res = await api.post("/student/submit-idea", { projectId, mentor: mentorId });
    return res.data.data; // updated project
  } catch (error) {
    console.error("Error assigning mentor:", error);
    throw new Error(error.response?.data?.message || "Failed to assign mentor");
  }
};


