const mongoose = require("mongoose");

const assignedProjectSchema = new mongoose.Schema({
  student: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Student", 
    required: true 
  },
  projectId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProjectBank",
    required: true 
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  technology: { type: String, required: true },

  // ✅ Mentor selected by student at submission
  selectedMentor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Mentor", 
    required: true 
  },

 // ✅ Mentor who finally approved (filled when approved)
  approvedMentor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Mentor", 
    default: null 
  },

  teamMembers: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Student" }
  ],
  teamLead: {
    id: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Student", 
      required: true 
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
  },

  academicYear: { type: String, required: true },
  branch : { type: String, required: true },
  section : { type: String, required: true },
  group : { type: String, required: true },

  status: {
    type: String,
    enum: ["pending", "approve", "reject"],
    default: "pending",
  },
}, { timestamps: true });

module.exports = mongoose.model("AssignedProject", assignedProjectSchema);

