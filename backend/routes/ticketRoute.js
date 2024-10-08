const express = require("express");
const router = express.Router();

const {
  createTicket,
  getAllTicket,
} = require("../controllers/ticketController");

const {
  authenticateUser,
  authorizeRoles,
} = require("../middleware/authentication");

router
  .route("/")
  .get(authenticateUser, getAllTicket)
  .post(
    [authenticateUser, authorizeRoles("superadmin", "admin", "user")],
    createTicket
  );


module.exports = router;