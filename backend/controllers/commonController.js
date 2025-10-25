// controllers/commonController.js
const Student = require("../models/Student");
const ProjectIdea = require("../models/ProjectIdea");
const AssignedProject = require("../models/AssignedProject");
const Mentor = require("../models/Mentor");
const Message = require("../models/Message");

// ✅ Get available students
const getAvailableStudents = async (req, res) => {
  try {
    const { branch, section, group, academicYear } = req.user;

    // Step 1: Fetch all students of same class
    const allStudents = await Student.find({
      branch,
      section,
      group,
      academicYear,
    });

    // Step 2: Fetch existing project idea + assigned projects
    const projectIdeas = await ProjectIdea.find().select("team teamLead");
    const assignedProjects = await AssignedProject.find().select("teamMembers teamLead");

    // Step 3: Collect used student IDs (safe null checks)
    const usedStudentIds = new Set([
      ...projectIdeas.flatMap((p) => {
        const team = Array.isArray(p.team) ? p.team.map((id) => id.toString()) : [];
        const lead = p.teamLead?.id ? [p.teamLead.id.toString()] : [];
        return [...team, ...lead];
      }),
      ...assignedProjects.flatMap((p) => {
        const members = Array.isArray(p.teamMembers)
          ? p.teamMembers.map((id) => id.toString())
          : [];
        const lead = p.teamLead?.id ? [p.teamLead.id.toString()] : [];
        return [...members, ...lead];
      }),
    ]);

    // Step 4: Filter out unavailable students
    const available = allStudents.filter(
      (stu) => !usedStudentIds.has(stu._id.toString())
    );

    res.status(200).json({ success: true, students: available });
  } catch (error) {
    console.error("Error fetching available students:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch available students",
    });
  }
};

// ✅ Get available mentors
const getAvailableMentors = async (req, res) => {
  try {
    const allMentors = await Mentor.find();

    const projectIdeas = await ProjectIdea.find().select("mentor");
    const assignedProjects = await AssignedProject.find().select("mentor");

    const mentorUsage = {};

    projectIdeas.forEach((p) => {
      if (p.mentor) {
        mentorUsage[p.mentor.toString()] =
          (mentorUsage[p.mentor.toString()] || 0) + 1;
      }
    });

    assignedProjects.forEach((p) => {
      if (p.mentor) {
        mentorUsage[p.mentor.toString()] =
          (mentorUsage[p.mentor.toString()] || 0) + 1;
      }
    });

    // Allow mentor max 3 projects
    const available = allMentors.filter((m) => {
      const usage = mentorUsage[m._id.toString()] || 0;
      return usage < 3;
    });

    res.status(200).json({ success: true, mentors: available });
  } catch (error) {
    console.error("Error in getAvailableMentors:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch available mentors",
    });
  }
};

const getMessages = async (req, res) => {
  try {
    const userRole = req.user.role.toLowerCase(); // "head", "mentor", "student"
    let query = {};

    if (userRole === "head") {
      // Head sees all messages
      query = {};
    } else {
      // Mentors or students see messages addressed to their role
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


module.exports = {
  getAvailableStudents,
  getAvailableMentors,
  getMessages,
};

