const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    branch: {
      type: String,
      required: [true, "please provide a branch name"],
      enum: ["Goa", "Dhaka", "Sylhet"],
      default: "Goa",
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    dueDate: {
      type: Date,
      default: Date.now(),
    },
    ticketDept: {
      type: String,
      required: [true, "please select issue department"],
      enum: ["Maintenance", "Support", "Repair", "Resource"],
      default: "Support",
    },
    priority: {
      type: String,
      required: [true, "Please provide a priority level"],
      enum: {
        values: ["Low", "Medium", "High"],
        message: "{VALUE} is not supported",
      },
      default: "Low",
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["Open", "Closed"],
        message: "{VALUE} not supported",
      },
      default: "Open",
    },
    ticketTitle: {
      type: String,
      trim: true,
    },
    message: [
      {
        authorId: {
          type: mongoose.Types.ObjectId,
          ref: "User", // Reference to the user who authored the message
          required: true,
        },
        text: {
          type: String,
          required: true,
          trim: true,
        },
        // default: []
      },
    ],
    tag: {
      type: String,
      required: true,
      enum: {
        values: ["assigned", "notassigned"],
        message: "{VALUE} not supported",
      },
      default: "notassigned",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ticket", ticketSchema);
