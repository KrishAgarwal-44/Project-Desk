// routes/commonRoutes.js
const express = require("express");
const router = express.Router();
const { verifyToken, checkRole } = require("../middleware/authMiddleware");
const { getAvailableStudents,
     getAvailableMentors,
     getMessages,
    } = require("../controllers/commonController");

// ✅ Get available students
router.get("/students", verifyToken, checkRole(["student"]), getAvailableStudents);

// ✅ Get available mentors
router.get("/mentors", verifyToken, checkRole(["student"]), getAvailableMentors);

// ✅ Get messages
router.get("/messages", verifyToken, checkRole(["student", "mentor", "head"]), getMessages);

module.exports = router;
