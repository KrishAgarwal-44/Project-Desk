//src: backend/routes/headRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const { verifyToken, checkRole } = require("../middleware/authMiddleware");
const {
  uploadProjectBankExcel,
  uploadStudentList,
  uploadMentorList,
  uploadHeadDocument,
  getHeadDocuments,
  deleteHeadDocument,
  downloadHeadDocument,
  getAvailableYears,
  getProjectsByYear,
  getPendingIdeasForHead,
  reviewIdeaByHead,
  getReviewedIdeasForHead,
  getAcceptedIdeasForInterview,
  scheduleInterview,
  getAllInterviews,
  reviewInterview,
  sendMessage,
  getMessages,
  createForm3ForAllProjects
} = require("../controllers/headController");
const upload = multer({ dest: "uploads/" });

// ✅ Middleware for head access
router.use(verifyToken, checkRole(["head"]));

// year
router.get("/projects", verifyToken, checkRole(["head"]), getProjectsByYear);
router.get("/years", verifyToken, checkRole(["head"]), getAvailableYears);

// File Uploads
router.post("/upload-project-bank",upload.single("file"),uploadProjectBankExcel);
router.post("/upload-student-list", upload.single("file"), uploadStudentList);
router.post("/upload-mentor-list", upload.single("file"), uploadMentorList);
router.post("/upload-document", upload.single("file"), uploadHeadDocument);

// Document management
router.get("/documents", getHeadDocuments);
router.delete("/documents/:id", deleteHeadDocument);
router.get("/documents/download/:id", downloadHeadDocument);

// Idea management
router.get("/pending-ideas", getPendingIdeasForHead);
router.put("/idea-review/:id", reviewIdeaByHead);
router.get("/idea-reviewed", getReviewedIdeasForHead);
router.get("/idea-accepted", getAcceptedIdeasForInterview);
// Interview management
router.put("/idea-interview/:id", scheduleInterview);
router.get("/idea-scheduled-interviews", getAllInterviews);
router.put("/idea-review-interview/:id", reviewInterview);


// Message management
router.post("/message/send", sendMessage);
router.get("/message/get", getMessages);

//Form 3
router.post("/form3/create", createForm3ForAllProjects);

module.exports = router;
