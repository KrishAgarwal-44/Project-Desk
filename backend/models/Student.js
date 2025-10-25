const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true }, // Student Name
    rollno: { type: String, required: true, unique: true }, // RTU Roll No.
    section: { type: String, required: true },
    group: { type: String },
    email: { type: String, required: true, unique: true },
    branch: { type: String, required: true },
    mobile: { type: String, required: true },
    academicYear: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
