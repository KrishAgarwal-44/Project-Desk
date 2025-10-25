// models/Document.js
const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  title: { type: String, required: true }, // e.g. "Form 1"
  filePath: { type: String, required: true }, // path in uploads/documents/
  fileName: { type: String, required: true }, // original name
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Head" },
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Document", documentSchema);
