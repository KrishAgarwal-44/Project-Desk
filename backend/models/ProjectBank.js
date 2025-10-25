const mongoose = require("mongoose");

const projectBankSchema = new mongoose.Schema({
  projectId: { type: String, required: true },
  title: { type: String, required: true },
  technology: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  academicYear: { type: String, required: true },
}, { timestamps: true });

// Make combination of projectId + academicYear unique
projectBankSchema.index({ projectId: 1, academicYear: 1 }, { unique: true });

module.exports = mongoose.model("ProjectBank", projectBankSchema);
