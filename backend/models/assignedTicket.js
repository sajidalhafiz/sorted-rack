const mongoose = require("mongoose");

const assignedTicketSchema = mongoose.Schema(
  {
    branch: {
      type: String,
      required: [true, "please provide a branch name"],
      enum: ["Goa", "Dhaka", "Sylhet"],
      default: "Goa",
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ticket: {
      type: mongoose.Types.ObjectId,
      ref: "Ticket",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["active", "inactive"],
        message: "{VALUE} not supported",
      },
      default: "active",
    },
    assignedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AssignedTicket", assignedTicketSchema);