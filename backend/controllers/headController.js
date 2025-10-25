//src/controllers/headcontroller.js
const ProjectIdea = require("../models/ProjectIdea");
const Document = require("../models/Document");
const path = require("path");
const Interview = require("../models/Interview");
const XLSX = require('xlsx');
const fs = require("fs");
const Mentor = require("../models/Mentor");
const ProjectBank = require("../models/ProjectBank");
const AssignedProject = require("../models/AssignedProject");
const Student = require("../models/Student");
const Message = require("../models/Message");
const bcrypt = require("bcryptjs");

// ✅ Get all available academic years
const getAvailableYears = async (req, res) => {
  try {
    const ideaYears = await ProjectIdea.distinct("academicYear");
    const assignedYears = await AssignedProject.distinct("academicYear");

    const years = [...new Set([...ideaYears, ...assignedYears])]; // merge + dedupe

    res.json(years);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch academic years" });
  }
}; 

const getProjectsByYear = async (req, res) => {
  try {
    const { year } = req.query;
    if (!year) {
      return res.status(400).json({ message: "Academic year is required" });
    }

    // Fetch Project Bank projects
    const projects = await ProjectBank.find({ academicYear: year });

    // Fetch Project Ideas
    const ideas = await ProjectIdea.find({ academicYear: year })
      .populate("teamMembers", "name email rollno")
      .populate("mentor", "name email");

    res.status(200).json({
      year,
      projects,
      ideas,
    });
  } catch (err) {
    console.error("Error fetching projects/ideas by year:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 📌 Upload Student Excel
const uploadStudentList = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Read Excel file
    const workbook = XLSX.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);

    const defaultPassword = "Student@123";
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const studentsToInsert = data.map((item) => ({
      name: item.name,
      rollno: item.rollno,
      section: item.section,
      group: item.group || "",
      email: item.email,
      branch: item.branch,
      mobile: item.mobile,
      academicYear: item.academicYear,
      password: hashedPassword, // Add default hashed password
    }));

    for (const student of studentsToInsert) {
      await Student.findOneAndUpdate(
        { rollno: student.rollno, academicYear: student.academicYear },
        student,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    // Delete uploaded file
    fs.unlinkSync(req.file.path);

    res.status(200).json({
      message: `Student list uploaded successfully. Default password is '${defaultPassword}'`,
      count: studentsToInsert.length,
    });
  } catch (error) {
    console.error("Student List Upload Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Head uploads mentor list from Excel
const uploadMentorList = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Read Excel file
    const workbook = XLSX.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);

    const defaultPassword = "Mentor@123";
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const mentorsToInsert = data.map((item) => ({
      name: item.Name || item.name,
      email: item.Email || item.email,
      designation: item.Designation || item.designation,
      expertise: item.Expertise || item.expertise,
      mobile: item.Mobile || item.mobile,
      password: hashedPassword, // Add default hashed password
    }));

    for (const mentor of mentorsToInsert) {
      await Mentor.findOneAndUpdate(
        { email: mentor.email }, // unique per year
        mentor,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    fs.unlinkSync(req.file.path); // Delete uploaded file

    res.status(200).json({
      message: `Mentor list uploaded successfully. Default password is '${defaultPassword}'`,
      count: mentorsToInsert.length,
    });
  } catch (error) {
    console.error("Mentor List Upload Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const uploadProjectBankExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Read Excel file
    const workbook = XLSX.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);

    if (!data || data.length === 0) {
      return res.status(400).json({ message: "Excel file is empty" });
    }

    const projectsToInsert = data.map((row) => ({
      projectId: row.projectId,
      title: row.title,
      description: row.description,
      technology: row.technology,
      category: row.category,
      academicYear: row.academicYear,
    }));

    let insertedCount = 0;
    let skippedCount = 0;

    for (const project of projectsToInsert) {
      if (!project.projectId || !project.title || !project.description || !project.technology || !project.category || !project.academicYear) {
        skippedCount++;
        continue;
      }

      await ProjectBank.findOneAndUpdate(
        { projectId: project.projectId, academicYear: project.academicYear },
        project,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      insertedCount++;
    }

    // Delete uploaded file
    fs.unlinkSync(req.file.path);

    res.status(200).json({
      message: `Project bank uploaded successfully.`,
      inserted: insertedCount,
      skipped: skippedCount,
    });
  } catch (error) {
    console.error("Project Bank Upload Error:", error);
    res.status(500).json({ message: "Server error while uploading project bank" });
  }
};

// 📌 Upload Document (Head only)
const uploadHeadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { title } = req.body; // Head should send a title

    if (!title) {
      return res.status(400).json({ message: "Document title is required" });
    }

    const doc = new Document({
      title: title,
      fileName: req.file.originalname, // original file name
      filePath: req.file.path,         // path in uploads/
      uploadedBy: req.user._id,        // Ensure ObjectId consistency
    });

    await doc.save();

    res.status(200).json({ message: "Document uploaded successfully", document: doc });
  } catch (error) {
    console.error("Upload Document Error:", error);
    res.status(500).json({ message: "Server error while uploading document", error });
  }
};

// 📌 Get All Documents uploaded by Head
const getHeadDocuments = async (req, res) => {
  try {
    const docs = await Document.find({ uploadedBy: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(docs);
  } catch (error) {
    console.error("Get Documents Error:", error);
    res.status(500).json({ message: "Server error while fetching documents" });
  }
};

// 📌 Download Document
const downloadHeadDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    // Send the file to client
    res.download(path.resolve(doc.filePath), doc.fileName);
  } catch (error) {
    console.error("Download Document Error:", error);
    res.status(500).json({ message: "Server error while downloading document" });
  }
};

// 📌 Delete Document
const deleteHeadDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    // Remove file from filesystem
    if (fs.existsSync(doc.filePath)) {
      fs.unlinkSync(doc.filePath);
    }

    await doc.deleteOne();
    res.status(200).json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error("Delete Document Error:", error);
    res.status(500).json({ message: "Server error while deleting document" });
  }
};

// ✅ Get all pending project ideas for Head
const getPendingIdeasForHead = async (req, res) => {
  try {
    const { academicYear } = req.query;
    const filter = academicYear ? { status: "pending", academicYear } : { status: "pending" };

    const pendingIdeas = await ProjectIdea.find(filter)
      .populate("teamMembers", "name email rollno")
      .populate("mentor", "name email");
    res.status(200).json(pendingIdeas);
  } catch (error) {
    console.error("Error fetching pending ideas:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Approve/Reject Idea
const reviewIdeaByHead = async (req, res) => {
  const { id } = req.params;
  const { action, reason } = req.body;

  try {
    const idea = await ProjectIdea.findById(id);

    if (!idea) {
      return res.status(404).json({ message: "Project idea not found" });
    }

    if (idea.status !== "pending" && idea.status !== "interview_passed") {
      return res
        .status(400)
        .json({ message: `Cannot review idea with status: ${idea.status}` });
    }

    if (action === "reject") {
      idea.status = "rejected_by_head";
      idea.headRemarks = reason;
    } else if (action === "approve") {
      idea.status = "approved_by_head";
    } else {
      return res
        .status(400)
        .json({ message: "Invalid action. Use 'approve' or 'reject'." });
    }

    await idea.save();
    res.status(200).json({
      message: `Project idea ${action}d by head`,
      idea,
    });
  } catch (error) {
    console.error("Error reviewing idea by head:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get All Reviewed Ideas (both approved & rejected)
const getReviewedIdeasForHead = async (req, res) => {
  try {
    const { academicYear } = req.query;

    const filter = academicYear
      ? { status: { $in: ["approved_by_head", "rejected_by_head"] }, academicYear }
      : { status: { $in: ["approved_by_head", "rejected_by_head"] } };

    const reviewedIdeas = await ProjectIdea.find(filter)
      .populate("teamMembers", "name email rollno")
      .populate("mentor", "name email");

    res.status(200).json(reviewedIdeas);
  } catch (error) {
    console.error("Error fetching reviewed ideas:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const getAcceptedIdeasForInterview = async (req, res) => {
  try {
    // Fetch ideas with status 'approved_by_head'
    const ideas = await ProjectIdea.find({ status: "approved_by_head" })
      .populate("teamLead.id", "name email") // populate team lead info
      .select("title teamLead description");  // select only necessary fields

    if (!ideas || ideas.length === 0) {
      return res.status(404).json({ message: "No accepted ideas found" });
    }

    res.status(200).json(ideas);
  } catch (error) {
    console.error("Error fetching accepted ideas:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const scheduleInterview = async (req, res) => {
  const { id } = req.params;
  const { date, time, location, notes } = req.body; // expects flat object

  if (!date || !time || !location) {
    return res.status(400).json({ message: "Incomplete interview details" });
  }

  try {
    const idea = await ProjectIdea.findById(id);
    if (!idea) return res.status(404).json({ message: "Project idea not found" });

    idea.status = "interview_scheduled";
    await idea.save();

    const interview = await Interview.create({ idea: id, date, time, location, notes });

    res.status(200).json({ message: "Interview scheduled successfully", interview });
  } catch (error) {
    console.error("Error scheduling interview:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Review Interview (pass or fail)
const reviewInterview = async (req, res) => {
  const { id } = req.params;
  const { action } = req.body; // ignore feedback for now

  try {
    const idea = await ProjectIdea.findById(id);
    if (!idea) return res.status(404).json({ message: "Project idea not found" });

    if (idea.status !== "interview_scheduled") {
      return res
        .status(400)
        .json({ message: `Cannot review idea with status: ${idea.status}` });
    }

    if (action === "pass") idea.status = "interview_passed";
    else if (action === "fail") idea.status = "interview_failed";
    else return res.status(400).json({ message: "Invalid action. Use 'pass' or 'fail'." });

    // Skip validation so it doesn't fail if mentor is missing
    await idea.save({ validateBeforeSave: false });

    res.status(200).json({ message: `Interview ${action}ed successfully`, idea });
  } catch (err) {
    console.error("Error reviewing interview:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get all ideas with scheduled, passed, or failed interviews (optionally by academicYear)
const getAllInterviews = async (req, res) => {
  try {
    const { academicYear } = req.query;

    const filter = { status: { $in: ["interview_scheduled", "interview_passed", "interview_failed"] } };
    if (academicYear) filter.academicYear = academicYear;

    const ideas = await ProjectIdea.find(filter)
      .populate("teamMembers", "name email rollno")
      .populate("mentor", "name email");

    if (!ideas || ideas.length === 0) {
      return res.status(404).json({ message: "No interviews found" });
    }

    res.status(200).json(ideas);
  } catch (error) {
    console.error("Error fetching interviews:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { content, receiverRoles } = req.body;

    // Validate input
    if (!content || !receiverRoles || receiverRoles.length === 0) {
      return res.status(400).json({ message: "Invalid message data" });
    }

    // Create message object
    const message = {
      content,
      sender: req.user.id,
      receiverRoles,
      createdAt: new Date(),
    };

    // Save message to database (pseudo-code)
    await Message.create(message);

    res.status(201).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Error sending message:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};


const getMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role; // "head", "mentor", "student"

    let query = {};

    if (userRole === "head") {
      // Head sees all messages they sent
      query = { sender: userId };
    } else {
      // Students or Mentors see messages sent to their role
      query = { receiverRoles: { $in: [userRole] } };
    }

    const messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .populate("sender", "name email");

    res.json({ success: true, data: messages });
  } catch (err) {
    console.error("Get messages error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const createForm3ForAllProjects = async (req, res) => {
  try {
    const { weeks } = req.body;

    if (!weeks || weeks.length === 0) {
      return res.status(400).json({ message: "Weeks (dates) are required" });
    }

    const formsCreated = [];

    // --------- 1️⃣ Handle ProjectIdea ---------
    const projectIdeas = await ProjectIdea.find().populate("teamMembers teamLead");

    for (const project of projectIdeas) {
      const allStudents = [];

      // Add team members
      if (project.teamMembers && project.teamMembers.length > 0) {
        allStudents.push(...project.teamMembers);
      }

      // Add team lead if not already included
      if (project.teamLead && !allStudents.find(s => s._id.equals(project.teamLead._id))) {
        allStudents.push(project.teamLead);
      }

      for (const student of allStudents) {
        if (!student || !student._id) continue; // skip invalid

        const exists = await Form3.findOne({ projectId: project._id, studentId: student._id });
        if (exists) continue;

        const form3 = new Form3({
          projectId: project._id,
          projectType: "ProjectIdea",
          studentId: student._id,
          weeks: weeks.map((w, i) => ({
            weekNumber: w.weekNumber || i + 1,
            fromDate: w.fromDate,
            toDate: w.toDate,
          })),
        });

        await form3.save();
        formsCreated.push(form3);
      }
    }

    // --------- 2️⃣ Handle AssignedProject ---------
    const assignedProjects = await AssignedProject.find().populate("teamMembers teamLead");

    for (const project of assignedProjects) {
      const allStudents = [];

      if (project.teamMembers && project.teamMembers.length > 0) {
        allStudents.push(...project.teamMembers);
      }

      if (project.teamLead && !allStudents.find(s => s._id.equals(project.teamLead._id))) {
        allStudents.push(project.teamLead);
      }

      for (const student of allStudents) {
        if (!student || !student._id) continue;

        const exists = await Form3.findOne({ projectId: project._id, studentId: student._id });
        if (exists) continue;

        const form3 = new Form3({
          projectId: project._id,
          projectType: "AssignedProject",
          studentId: student._id,
          weeks: weeks.map((w, i) => ({
            weekNumber: w.weekNumber || i + 1,
            fromDate: w.fromDate,
            toDate: w.toDate,
          })),
        });

        await form3.save();
        formsCreated.push(form3);
      }
    }

    return res.status(201).json({
      message: `✅ Form3 created for ${formsCreated.length} students`,
      forms: formsCreated,
    });
  } catch (err) {
    console.error("Error creating Form3:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  getProjectsByYear,
  getAvailableYears,
  uploadStudentList,
  uploadMentorList,
  uploadProjectBankExcel,
  uploadHeadDocument,
  getHeadDocuments,
  downloadHeadDocument,
  deleteHeadDocument,
  getPendingIdeasForHead,
  reviewIdeaByHead,
  getReviewedIdeasForHead,
  getAcceptedIdeasForInterview,
  scheduleInterview,
  getAllInterviews,
  reviewInterview,
  sendMessage,
  getMessages,
  createForm3ForAllProjects,
};

