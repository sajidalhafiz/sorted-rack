const express = require("express");
const router = express.Router();

const {
  createDeviceRequest,
  getAllDeviceRequests,
  getSingleDeviceRequest,
  updateDeviceRequest,
  deleteDeviceRequest,
  deleteAllDeviceRequests,
} = require("../controllers/deviceRequestController");

const {
  authenticateUser,
  authorizeRoles,
} = require("../middleware/authentication");

router
  .route("/")
  .get(authenticateUser, getAllDeviceRequests)
  .post(
    [authenticateUser, authorizeRoles("superadmin", "admin", "user")],
    createDeviceRequest
  );

router
  .route("/deleteAllDeviceRequests")
  .delete(
    [authenticateUser, authorizeRoles("superadmin", "admin")],
    deleteAllDeviceRequests
  );

router
  .route("/:id")
  .get(
    [authenticateUser, authorizeRoles("superadmin", "admin", "user")],
    getSingleDeviceRequest
  )
  .patch(
    [authenticateUser, authorizeRoles("superadmin", "admin")],
    updateDeviceRequest
  )
  .delete(
    [authenticateUser, authorizeRoles("superadmin", "admin")],
    deleteDeviceRequest
  );

module.exports = router;
