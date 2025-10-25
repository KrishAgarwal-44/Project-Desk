import api from "../utils/axios";

export const getMentorProject = async () => {
  try {
    const res = await api.get("/mentor/project"); // no projectId needed
    return res.data;
  } catch (err) {
    console.error("Error fetching mentor project:", err);
    throw err.response?.data || err;
  }
};

// Approve or reject the project
export const reviewAssignedProject = async (action) => {
  try {
    const res = await api.put("/mentor/project/review", { action });
    return res.data;
  } catch (err) {
    console.error("Error reviewing project:", err);
    throw err.response?.data || err;
  }
};

export const getDocuments = async () => {
  const res = await api.get("/mentor/documents");
  return res.data;
};

export const downloadDocument = async (id, fileName) => {
  const res = await api.get(`/mentor/documents/download/${id}`, {
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

export const getAssignedForms = async () => {
  try {
    const res = await api.get("/mentor/forms3");
    return res.data.forms || [];
  } catch (err) {
    console.error("Error fetching assigned Form3 submissions:", err);
    throw err.response?.data || err;
  }
}

export const updateMentorMarks = async (formId, weekNumber, mentorMarks) => {
  try {
    const payload = { formId, weekNumber, mentorMarks };
    const res = await api.put("/mentor/forms3/week", payload);
    return res.data;
  } catch (err) {
    console.error("Error updating mentor marks:", err);
    throw err.response?.data || err;
  }
};

export const getMentorIdeaProjects = async () => {
  try {
    const res = await api.get("/mentor/idea-projects");
    return res.data;
  } catch (err) {
    console.error("Error fetching mentor idea projects:", err);
    throw err.response?.data || err;
  }
};

export const reviewIdeaProject = async (id, action, feedback) => {
  try {
    const res = await api.patch(`/mentor/idea-projects/${id}/review`, {
      action,
      feedback,
    });
    return res.data;
  } catch (err) {
    console.error("Error reviewing idea project:", err);
    throw err.response?.data || err;
  }
};