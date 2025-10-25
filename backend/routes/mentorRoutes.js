const express = require("express");
const router = express.Router();
const { verifyToken, checkRole } = require("../middleware/authMiddleware");
const {
  getMentorProject,
  reviewAssignedProject,
  getDocuments,
  downloadDocument,
  updateForm3MentorMarks,
  getAssignedForms,
  getMentorIdeaProjects,
  reviewIdeaProject
} = require("../controllers/mentorController");

router.use(verifyToken, checkRole(["mentor"]));

// project bank
router.get("/project", getMentorProject);
router.put("/project/review", reviewAssignedProject);
router.get("/documents", getDocuments);
router.get("/documents/download/:id", downloadDocument);

// Form3 
router.get("/forms3", verifyToken,  getAssignedForms);
router.put("/forms3/week", verifyToken,  updateForm3MentorMarks);

// ===== Idea Projects =====
router.get("/idea-projects", verifyToken, getMentorIdeaProjects);
router.patch("/idea-projects/:id/review", verifyToken, reviewIdeaProject);

module.exports = router;
