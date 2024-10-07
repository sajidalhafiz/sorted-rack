const { StatusCodes } = require("http-status-codes");
const assignedProduct = require("../models/assignedProduct");
const DeviceIssue = require("../models/deviceIssue");
const User = require("../models/user");

const createDeviceIssue = async (req, res) => {
    const { userId, productId, assignedById, status, issueStatement, adminResponse } = req.body;

    try {
        await DeviceIssue.create({
            user: userId,
            product: productId,
            assignedBy: assignedById,
            issueStatement: issueStatement,
            adminResponse: adminResponse,
        });
        // TODO: set a tag: issue, for assignedProduct  

    } catch (error) {
        res.send(error.message);
    }
    res.status(StatusCodes.CREATED).json({ msg: "Issue created" });

}

const getAllDeviceIssue = async (req, res) => {
    const response = await DeviceIssue.find({ status: "processing" });
    console.log(response);
    res.status(StatusCodes.OK).json({ deviceIssues: response });
}

module.exports = {
    createDeviceIssue,
    getAllDeviceIssue
}