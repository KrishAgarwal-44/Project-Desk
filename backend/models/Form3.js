// models/Form3.js
const mongoose = require("mongoose");

const WeekSchema = new mongoose.Schema({
  weekNumber: { type: Number, required: true },
  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },
  functionality: { type: String, default: "" },
  progress: { type: Number, min: 0, max: 100, default: 0 },
  taskDetails: { type: String, default: "" },
  mentorMarks: { type: Number, min: 0, max: 10, default: null },
});

const Form3Schema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "projectType",
      required: true,
    },
    projectType: {
      type: String,
      enum: ["ProjectIdea", "AssignedProject"],
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    weeks: [WeekSchema],
    weeksCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

Form3Schema.index({ projectId: 1, studentId: 1 }, { unique: true });

Form3Schema.pre("save", function (next) {
  this.weeksCount = this.weeks.length;
  next();
});

module.exports = mongoose.model("Form3", Form3Schema);