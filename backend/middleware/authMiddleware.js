const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
const Mentor = require("../models/Mentor");
const Head = require("../models/Head");

const JWT_SECRET = process.env.JWT_SECRET || "secret123";

// ✅ Verify token
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, JWT_SECRET);

    let user = null;
    let role = decoded.role;

    if (role === "student") {
      user = await Student.findById(decoded.id);
    } else if (role === "mentor") {
      user = await Mentor.findById(decoded.id);
    } else if (role === "head") {
      user = await Head.findById(decoded.id);
    }

    if (!user) return res.status(401).json({ message: "User not found" });

    // Include all required fields for controllers
    req.user = {
      id: user._id,              // use 'id' instead of '_id'
      role,
      name: user.name,
      email: user.email,          // add email
      branch: user.branch,
      section: user.section,
      group: user.group,
      academicYear: user.academicYear,
    };

    next();
  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// ✅ Role-based access check
const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: Access denied" });
    }
    next();
  };
};

module.exports = { verifyToken, checkRole };
