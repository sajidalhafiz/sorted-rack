const express = require("express");
const router = express.Router();

const {
    createDeviceIssue,
    getAllDeviceIssue
} = require("../controllers/deviceIssueController");

router.route("/").post(
    createDeviceIssue
).get(
    getAllDeviceIssue
);

module.exports = router;