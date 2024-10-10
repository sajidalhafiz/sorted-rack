const express = require("express");
const router = express.Router();

const {
  createAssignedTicket,
  getAllAssignedTickets,
  getSingleAssignedTicket,
  getCurrentUserAssignedTickets,
  removeAssignedTicket,
  deleteAllAssignedTickets,
} = require("../controllers/assignedTicketController");

const {
  authenticateUser,
  authorizeRoles,
} = require("../middleware/authentication");


router
  .route("/")
  .post(
    [authenticateUser, authorizeRoles("superadmin", "admin")],
    createAssignedTicket
  )
  .get(
    [authenticateUser, authorizeRoles("superadmin", "admin")],
    getAllAssignedTickets
  );


router
  .route("/myAssignedTickets")
  .get(authenticateUser, getCurrentUserAssignedTickets);


router
  .route("/deleteAllAssignedTickets")
  .delete(
    [authenticateUser, authorizeRoles("superadmin")],
    deleteAllAssignedTickets
  );

// Get a single assigned ticket, update (remove) an assigned ticket
router
  .route("/:id")
  .get(
    [authenticateUser, authorizeRoles("superadmin", "admin")],
    getSingleAssignedTicket
  )
  .patch(
    [authenticateUser, authorizeRoles("superadmin", "admin")],
    removeAssignedTicket
  );

module.exports = router;