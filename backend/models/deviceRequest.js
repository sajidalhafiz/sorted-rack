const mongoose = require("mongoose");

const deviceRequestSchema = new mongoose.Schema(
  {
    branch: {
      type: String,
      required: [true, "Please provide a branch name"],
      enum: ["Goa", "Dhaka", "Sylhet"],
      default: "Goa",
    },
    priority: {
      type: String,
      required: [true, "Please provide a priority level"],
      enum: {
        values: ["low", "medium", "high"],
        message: "{VALUE} is not supported",
      },
      default: "low",
    },
    requestUserId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    issueStatement: {
      type: String,
      trim: true,
    },
    requestDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["pending", "approved", "rejected"],
        message: "{VALUE} is not supported",
      },
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DeviceRequest", deviceRequestSchema);
