const AssignedTicket = require("../models/assignedTicket");
const User = require("../models/user");
const Ticket = require("../models/ticket");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const checkPermission = require("../utility/checkPermission");

const createAssignedTicket = async (req, res) => {
  const { branch, user: userId, ticket: ticketId } = req.body;
  if (!branch || !userId || !ticketId) {
    throw new CustomError.BadRequestError("Please provide branch, userId, and ticketId");
  }

  const verifyUser = await User.findOne({ _id: userId });
  if (!verifyUser) {
    throw new CustomError.NotFoundError(`No user found with id ${userId}`);
  }

  if (verifyUser.branch !== branch) {
    throw new CustomError.BadRequestError("User needs to be from the same branch");
  }
  if (verifyUser.role === "superadmin" && req.user.role === "admin") {
    throw new CustomError.UnauthorizedError("Not authorized to proceed with this task");
  }
  if (verifyUser.status !== "active") {
    throw new CustomError.BadRequestError("User is not active");
  }
  if (verifyUser.role === "admin" && req.user.role === "admin") {
    throw new CustomError.UnauthorizedError("Not authorized to proceed with this task");
  }

  const ticket = await Ticket.findOne({ _id: ticketId });
  if (!ticket) {
    throw new CustomError.NotFoundError(`No ticket exists`);
  }
  if (ticket.tag !== "notassigned") {
    throw new CustomError.BadRequestError("Ticket already assigned");
  }

  const checkActiveDocExists = await AssignedTicket.findOne({
    ticket: ticketId,
    status: "active",
  });
  if (checkActiveDocExists) {
    throw new CustomError.BadRequestError(`Ticket already assigned`);
  }

  try {
    await AssignedTicket.create({
      branch,
      user: userId,
      ticket: ticketId,
      assignedBy: req.user.userId,
      priority: ticket.priority,
      ticketDept: ticket.ticketDept,
    });
    await Ticket.findOneAndUpdate(
      { _id: ticketId },
      {
        tag: "assigned",
      }
    );
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    return;
  }
  res.status(StatusCodes.CREATED).json({ msg: "Ticket assigned successfully" });
};

const getAllAssignedTickets = async (req, res) => {
  let query = { status: "active" };
  if (req.user.role === "admin") {
    query.branch = req.user.branch;
  }

  const response = await AssignedTicket.find(query)
    .populate({ path: "user", select: "email fname lname username" })
    .populate({
      path: "ticket",
      select: "ticketTitle ticketDept priority status createdAt dueDate",
    })
    .populate({ path: "assignedBy", select: "email" });

  const finalResponse = response.map((item) => ({
    _id: item._id,
    firstName: item.user.fname,
    lastName: item.user.lname,
    email: item.user.email,
    username: item.user.username,
    branch: item.branch,
    ticketTitle: item.ticket.ticketTitle,
    ticketDept: item.ticket.ticketDept,
    priority: item.ticket.priority,
    status: item.ticket.status,
    createdAt: item.ticket.createdAt,
    dueDate: item.ticket.dueDate,
    assignedBy: item.assignedBy.email,
    assignedAt: item.createdAt,
  }));

  res.status(StatusCodes.OK).json({ assignedTickets: finalResponse });
};

const getSingleAssignedTicket = async (req, res) => {
  const { id: assignedTicketId } = req.params;

  let query = { _id: assignedTicketId };
  if (req.user.role === "admin") {
    query.branch = req.user.branch;
  }

  const singleAssignedTicket = await AssignedTicket.findOne(query)
    .populate({ path: "user", select: "email fname lname username" })
    .populate({
      path: "ticket",
      select: "ticketTitle ticketDept priority status createdAt dueDate message",
    })
    .populate({ path: "assignedBy", select: "email" });

  if (!singleAssignedTicket) {
    throw new CustomError.NotFoundError(`No document found with id ${assignedTicketId}`);
  }
  res.status(StatusCodes.OK).json({ assignedTicket: singleAssignedTicket });
};

const getCurrentUserAssignedTickets = async (req, res) => {
  const myList = await AssignedTicket.find({
    user: req.user.userId,
    status: "active",
  }).populate({
    path: "ticket",
    select: "ticketTitle ticketDept priority status createdAt dueDate",
  });

  if (!myList || myList.length === 0) {
    throw new CustomError.NotFoundError("No tickets assigned");
  }

  res.status(StatusCodes.OK).json({ myList });
};

const removeAssignedTicket = async (req, res) => {
  const { id: assignedTicketId } = req.params;

  const assignedTicket = await AssignedTicket.findOne({
    _id: assignedTicketId,
  });

  if (!assignedTicket) {
    throw new CustomError.NotFoundError(`No document found with id ${assignedTicketId}`);
  }

  try {
    const response = await AssignedTicket.findOneAndUpdate(
      { _id: assignedTicketId },
      {
        status: "inactive",
      }
    );

    const { ticket: ticketId } = response;

    await Ticket.findOneAndUpdate(
      { _id: ticketId },
      {
        tag: "notassigned",
      }
    );
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    return;
  }

  res.status(StatusCodes.OK).json({ msg: "Ticket assignment removed" });
};

const deleteAllAssignedTickets = async (req, res) => {
  await AssignedTicket.deleteMany({});
  res.status(StatusCodes.OK).json({ message: "All assigned tickets deleted" });
};

module.exports = {
  createAssignedTicket,
  getAllAssignedTickets,
  getSingleAssignedTicket,
  getCurrentUserAssignedTickets,
  removeAssignedTicket,
  deleteAllAssignedTickets,
};