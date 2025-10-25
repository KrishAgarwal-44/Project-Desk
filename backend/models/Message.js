const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Head",
      required: true,
    },
    // Roles the message is sent to: ["mentor"], ["student"], or ["mentor","student"]
    receiverRoles: {
      type: [String],
      enum: ["student", "mentor"],
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
