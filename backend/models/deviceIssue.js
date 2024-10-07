const mongoose = require("mongoose");

const deviceIssueSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedBy: {
      type: mongoose.Types.ObjectId,
      ref: "AssignedBy",
      required: true,
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["processing", "closed"],
        message: "{VALUE} not supported",
      },
      default: "processing",
    },
    issueStatement: {
      type: String,
      required: [true, "Please provide a description of the issue"],
    },
    adminResponse: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DeviceIssue", deviceIssueSchema);
