const DeviceRequest = require("../models/deviceRequest");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

const createDeviceRequest = async (req, res) => {
//   req.body.requestUserId = req.user.userId; 
//   if (req.user.role === "admin") {
//     req.body.branch = req.user.branch;
//   }
  const deviceRequest = await DeviceRequest.create(req.body);
  res.status(StatusCodes.CREATED).json({ deviceRequest });
};

const getAllDeviceRequests = async (req, res) => {
  let deviceRequests;
  if (req.user.role === "superadmin") {
    deviceRequests = await DeviceRequest.find({});
  }
  if (req.user.role === "admin") {
    let { branch } = req.user;
    deviceRequests = await DeviceRequest.find({ branch });
  }
  res.status(StatusCodes.OK).json({ deviceRequests, count: deviceRequests.length });
};

const getSingleDeviceRequest = async (req, res) => {
  const { id: requestId } = req.params;
  const deviceRequest = await DeviceRequest.findOne({ _id: requestId });

  if (!deviceRequest) {
    throw new CustomError.NotFoundError(`No request found with id ${requestId}`);
  }

  res.status(StatusCodes.OK).json({ deviceRequest });
};

const updateDeviceRequest = async (req, res) => {
  const { id: requestId } = req.params;
  const deviceRequest = await DeviceRequest.findOneAndUpdate(
    { _id: requestId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!deviceRequest) {
    throw new CustomError.NotFoundError(`No request found with id ${requestId}`);
  }

  res.status(StatusCodes.OK).json({ deviceRequest });
};

const deleteDeviceRequest = async (req, res) => {
  const { id: requestId } = req.params;
  const deviceRequest = await DeviceRequest.findOne({ _id: requestId });

  if (!deviceRequest) {
    throw new CustomError.NotFoundError(`No request found with id ${requestId}`);
  }

  await deviceRequest.deleteOne();
  res.status(StatusCodes.OK).json({ msg: 'Request removed successfully' });
};

const deleteAllDeviceRequests = async (req, res) => {
  await DeviceRequest.deleteMany({});
  res.status(StatusCodes.OK).json({ msg: 'All requests deleted' });
};

module.exports = {
  createDeviceRequest,
  getAllDeviceRequests,
  getSingleDeviceRequest,
  updateDeviceRequest,
  deleteDeviceRequest,
  deleteAllDeviceRequests,
};
