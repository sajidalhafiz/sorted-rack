const express = require("express");
const router = express.Router();

const {
  getAllTickets,
  getSingleTicket,
  createTicket,
  updateTicket,
  deleteTicket,
  addMessage,
  updateMessage
} = require("../controllers/ticketController");

const {
  authenticateUser,
  authorizeRoles,
} = require("../middleware/authentication");

// Get all tickets
router
  .route("/")
  .get(authenticateUser, getAllTickets);

// Create a new ticket
router
  .route("/createTicket")
  .post(authenticateUser, createTicket);

// Get a single ticket
router
  .route("/getSingleTicket/:id")
  .get(authenticateUser, getSingleTicket);

// Update a ticket
router
  .route("/updateTicket/:id")
  .patch(authenticateUser, updateTicket);

// Delete a ticket
router
  .route("/deleteTicket/:id")
  .delete(authenticateUser, deleteTicket);

// Add a message to a ticket
router
  .route("/addMessage/:id")
  .post(authenticateUser, addMessage);

// Update a specific message in a ticket
router
  .route("/updateMessage/:id/:messageId")
  .patch(authenticateUser, updateMessage);

module.exports = router;