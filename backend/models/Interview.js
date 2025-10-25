const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema({
  idea: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProjectIdea",
    required: true,
  },
  date: {
    type: String, // Or use Date type if time is included
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt
});

module.exports= mongoose.model("Interview", interviewSchema);

