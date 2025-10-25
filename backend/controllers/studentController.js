const AssignedProject = require("../models/AssignedProject");
const ProjectBank = require("../models/ProjectBank");
const ProjectIdea = require("../models/ProjectIdea");
const Mentor = require("../models/Mentor");
const Document = require("../models/Document");
const path = require("path");

const submitProjectIdeaForm = async (req, res) => {
  try {
    const { projectId, title, description, technology, teamMembers, mentor } = req.body;
    const userId = req.user._id || req.user.id;

    if (projectId && mentor) {
      // ✅ Update mentor only
      const project = await ProjectIdea.findById(projectId);
      if (!project) return res.status(404).json({ success: false, message: "Project not found" });

      project.mentor = mentor;
      await project.save();

      return res.status(200).json({
        success: true,
        message: "Mentor updated successfully",
        data: project,
      });
    }

    // Validate fields for new project idea
    if (!title || !description || !technology || !teamMembers) {
      return res.status(400).json({
        success: false,
        message: "Title, description, technology, and team members are required",
      });
    }

    // Prevent duplicate submission
    const existingIdea = await ProjectIdea.findOne({
      $or: [{ "teamLead.id": userId }, { teamMembers: userId }],
    });
    const existingAssigned = await AssignedProject.findOne({
      $or: [{ student: userId }, { teamMembers: userId }],
    });

    if (existingIdea || existingAssigned) {
      return res.status(403).json({
        success: false,
        message: "You are already part of a submitted project (Idea or Bank)",
      });
    }

    const newIdea = new ProjectIdea({
      title,
      description,
      technology,
      teamMembers,
      teamLead: {
        id: userId,
        name: req.user.name,
        email: req.user.email,
      },
      academicYear: req.user.academicYear,
      branch: req.user.branch,
      section: req.user.section,
      group: req.user.group,
      status: "pending",
      mentor: mentor || null,
    });

    await newIdea.save();

    res.status(201).json({
      success: true,
      message: "Project Idea submitted successfully",
      data: newIdea,
    });
  } catch (error) {
    console.error("Submit Project Idea Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit project idea",
      error: error.message,
    });
  }
};

// ✅ Submit project from Project Bank
const submitProjectBankForm = async (req, res) => {
  try {
    const { projectId, title, description, technology, selectedMentor, teamMembers } = req.body;
    const userId = req.user._id || req.user.id;

    const existingIdea = await ProjectIdea.findOne({
      $or: [{ "teamLead.id": userId }, { team: userId }],
    });
    const existingAssigned = await AssignedProject.findOne({
      $or: [{ student: userId }, { teamMembers: userId }],
    });

    if (existingIdea || existingAssigned) {
      return res.status(403).json({
        success: false,
        message: "You are already part of a submitted project (Idea or Bank)",
      });
    }

    const newAssigned = new AssignedProject({
      student: userId,
      projectId,
      title,
      description,
      technology,
      selectedMentor, // 👈 Mentor ID save here
      teamMembers,
      teamLead: {
        id: userId,
        name: req.user.name,
        email: req.user.email,
      },
      academicYear: req.user.academicYear,
      branch: req.user.branch,
      section: req.user.section,
      group: req.user.group,
    });

    await newAssigned.save();

    res.status(201).json({
      success: true,
      message: "Project Bank form submitted successfully",
      data: newAssigned,
    });
  } catch (error) {
    console.error("Submit Project Bank Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit project bank form",
      error: error.message,
    });
  }
};

const getMyIdeaProject = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const projectIdea = await ProjectIdea.findOne({
      $or: [{ "teamLead.id": userId }, { teamMembers: userId }],
    })
      .populate("mentor", "name email") // if mentor is assigned
      .populate("teamMembers", "name email rollno") // populate team members
      .populate("teamLead.id", "name email"); // populate lead student info

    if (!projectIdea) {
      return res.status(200).json({success: true,projectIdea: null,message: "No project idea submitted yet",});
    }

    res.status(200).json({success: true,projectIdea,});
  } catch (error) {
    console.error("Get My Idea Project Error:", error);
    res.status(500).json({success: false,message: "Server error",});
  }
};

// const selectIdeaMentor = async (req, res) => {
//   try {
//     const ideaId = req.params.id;
//     const { mentorId } = req.body; // mentor id selected by student
//     const userId = req.user._id || req.user.id;

//     // Ensure this project belongs to the student (lead or team member)
//     const project = await ProjectIdea.findOne({
//       _id: ideaId,
//       $or: [{ "teamLead.id": userId }, { teamMembers: userId }],
//     });

//     if (!project) {
//       return res.status(404).json({ success: false, message: "Project not found" });
//     }

//     if (project.status !== "interview_passed") {
//       return res.status(400).json({
//         success: false,
//         message: "You can only select a mentor after passing the interview",
//       });
//     }

//     project.mentor = mentorId;
//     await project.save();

//     // populate mentor info before returning
//     await project.populate("mentor", "name email");

//     res.status(200).json({ success: true, message: "Mentor selected", data: project });
//   } catch (error) {
//     console.error("Select Idea Mentor Error:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// ✅ Get student's assigned project only
const getMyAssignedProject = async (req, res) => {
  try {
    const userId = req.user.id;

    const project = await AssignedProject.findOne({
      $or: [{ student: userId }, { teamMembers: userId }],
    })
      .populate("selectedMentor", "name email")
      .populate("approvedMentor", "name email")
      .populate("teamMembers", "name email rollno")
      .populate("student", "name email");

    if (!project) {
      return res.status(200).json({ 
        success: true, 
        project: null, 
        message: "No assigned project yet" 
      });
    }

    res.status(200).json({ success: true, project });
  } catch (error) {
    console.error("Get My Assigned Project Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// ✅ Get project bank filtered by academicYear
const getProjectBankList = async (req, res) => {
  try {
    const projects = await ProjectBank.find({ academicYear: req.user.academicYear }).sort({ title: 1 });
    res.status(200).json({ success: true, projects });
  } catch (error) {
    console.error("Get Project Bank Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getMentorList = async (req, res) => {
  try {
    const mentors = await Mentor.find().select("-password"); // exclude password
    res.json({ mentors }); // ✅ wrapped in object
  } catch (err) {
    console.error("Error fetching mentors:", err);
    res.status(500).json({ message: "Failed to load mentor list" });
  }
};

// 📌 Get all documents for students
const getDocuments = async (req, res) => {
  try {
    // Students can see all documents
    const docs = await Document.find().sort({ createdAt: -1 });
    res.status(200).json(docs);
  } catch (error) {
    console.error("Get Documents Error:", error);
    res.status(500).json({ message: "Server error while fetching documents" });
  }
};

// 📌 Download a document by ID for students
const downloadDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    // Send the file
    res.download(path.resolve(doc.filePath), doc.fileName);
  } catch (error) {
    console.error("Download Document Error:", error);
    res.status(500).json({ message: "Server error while downloading document" });
  }
};

const getMyForm3 = async (req, res) => {
  try {
    const studentId = req.user.id;
    console.log("Fetching Form3 for studentId:", studentId);

    const form3 = await Form3.findOne({ studentId }).populate("projectId");

    console.log("Fetched form3:", form3);

    if (!form3) return res.status(404).json({ message: "No Form3 found for you yet." });

        // Ensure each week has mentorMarks field
        form3.weeks = form3.weeks.map(week => ({
          ...week.toObject(),       // convert mongoose doc to plain object
          mentorMarks: week.mentorMarks ?? null
        }));
    

    res.json(form3);
  } catch (err) {
    console.error("Error in getMyForm3:", err);
    res.status(500).json({ message: "Error fetching Form3", error: err.message });
  }
};

const updateForm3Week = async (req, res) => {
  try {
    const { form3Id, weekNumber } = req.params;
    const { functionality, progress, taskDetails } = req.body;

    // Find Form3 by ID
    const form = await Form3.findById(form3Id);
    if (!form) return res.status(404).json({ message: "Form3 not found" });

    // Find the correct week
    const weekIndex = form.weeks.findIndex(w => w.weekNumber === parseInt(weekNumber));
    if (weekIndex === -1) return res.status(404).json({ message: "Week not found" });

    // Update fields
    form.weeks[weekIndex].functionality = functionality ?? form.weeks[weekIndex].functionality;
    form.weeks[weekIndex].progress = progress ?? form.weeks[weekIndex].progress;
    form.weeks[weekIndex].taskDetails = taskDetails ?? form.weeks[weekIndex].taskDetails;

    // Optional: Add a flag to indicate submission for mentor review
    form.weeks[weekIndex].submitted = true;

    await form.save();

    res.json({ message: `Week ${weekNumber} updated and submitted for mentor review`, week: form.weeks[weekIndex] });
  } catch (err) {
    console.error("Error updating week:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  submitProjectIdeaForm,
  submitProjectBankForm,
  getMyIdeaProject,
  //selectIdeaMentor,
  getMyAssignedProject,
  getProjectBankList,
  getMentorList,
  getDocuments,
  downloadDocument,
  getMyForm3,
  updateForm3Week,
};
