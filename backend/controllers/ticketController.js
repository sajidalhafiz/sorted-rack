const Ticket = require("../models/ticket");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { checkPermission } = require("../utility");

const getAllTickets = async (req, res) => {
  let result = Ticket.find({}).populate('createdBy', 'fname lname');

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const tickets = await result;

  // console.log(tickets)

  res.status(StatusCodes.OK).json({ tickets, nbhits: tickets.length });
};

const getSingleTicket = async (req, res) => {
  const { id: ticketId } = req.params;
  const ticket = await Ticket.findOne({ _id: ticketId })
    .populate('createdBy', 'fname lname email branch')
    .populate({
      path: 'message.authorId',
      select: 'fname lname email branch'
    });

  if (!ticket) {
    throw new CustomError.NotFoundError(`No ticket found with id ${ticketId}`);
  }

  checkPermission(req.user, ticket.createdBy);
  res.status(StatusCodes.OK).json({ ticket });
};

const getCurrentUserTickets = async (req, res) => {
  try {
    const userTickets = await Ticket.find({
      createdBy: req.user.userId,
    }).sort({ createdAt: -1 }); // Sort by creation date, newest first

    if (!userTickets || userTickets.length === 0) {
      throw new CustomError.NotFoundError("No tickets found for this user");
    }

    res.status(StatusCodes.OK).json({ tickets: userTickets, count: userTickets.length });
  } catch (error) {
    if (error instanceof CustomError.NotFoundError) {
      res.status(StatusCodes.NOT_FOUND).json({ msg: error.message });
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Error fetching tickets" });
    }
  }
};

const createTicket = async (req, res) => {
  const {
    branch,
    dueDate,
    ticketDept,
    priority,
    ticketTitle,
    message,
    assignedTo
  } = req.body;

  if (!branch || !dueDate || !ticketDept || !priority || !ticketTitle || !message) {
    throw new CustomError.BadRequestError("Please provide all required fields");
  }

  const ticket = await Ticket.create({
    branch,
    dueDate,
    ticketDept,
    priority,
    ticketTitle,
    message: [{ authorId: req.user.userId, text: message }],
    assignedTo,
    createdBy: req.user.userId
  });

  res.status(StatusCodes.CREATED).json({ ticket });
};

const updateTicket = async (req, res) => {
  const { id: ticketId } = req.params;
  const { branch, dueDate, ticketDept, priority, ticketTitle, status, assignedTo } = req.body;

  const ticket = await Ticket.findOne({ _id: ticketId });

  if (!ticket) {
    throw new CustomError.NotFoundError(`No ticket found with id ${ticketId}`);
  }

  checkPermission(req.user, ticket.createdBy);

  ticket.branch = branch || ticket.branch;
  ticket.dueDate = dueDate || ticket.dueDate;
  ticket.ticketDept = ticketDept || ticket.ticketDept;
  ticket.priority = priority || ticket.priority;
  ticket.ticketTitle = ticketTitle || ticket.ticketTitle;
  ticket.status = status || ticket.status;
  ticket.assignedTo = assignedTo || ticket.assignedTo;

  await ticket.save();

  res.status(StatusCodes.OK).json({ ticket });
};

const deleteTicket = async (req, res) => {
  const { id: ticketId } = req.params;

  const ticket = await Ticket.findOne({ _id: ticketId });

  if (!ticket) {
    throw new CustomError.NotFoundError(`No ticket found with id ${ticketId}`);
  }

  checkPermission(req.user, ticket.createdBy);

  await ticket.deleteOne();

  res.status(StatusCodes.OK).json({ message: "Ticket successfully deleted" });
};

const addMessage = async (req, res) => {
  const { id: ticketId } = req.params;
  const { message } = req.body;

  if (!message) {
    throw new CustomError.BadRequestError("Please provide a message");
  }

  const ticket = await Ticket.findOne({ _id: ticketId });

  if (!ticket) {
    throw new CustomError.NotFoundError(`No ticket found with id ${ticketId}`);
  }

  ticket.message.push({ authorId: req.user.userId, text: message });

  await ticket.save();

  res.status(StatusCodes.OK).json({ ticket });
};

const updateMessage = async (req, res) => {
  const { id: ticketId, messageId } = req.params;
  const { message } = req.body;

  if (!message) {
    throw new CustomError.BadRequestError("Please provide a message");
  }

  const ticket = await Ticket.findOne({ _id: ticketId });

  if (!ticket) {
    throw new CustomError.NotFoundError(`No ticket found with id ${ticketId}`);
  }

  const messageIndex = ticket.message.findIndex(
    (msg) => msg._id.toString() === messageId
  );

  if (messageIndex === -1) {
    throw new CustomError.NotFoundError(`No message found with id ${messageId}`);
  }

  // Check if the user is authorized to update this message
  if (ticket.message[messageIndex].authorId.toString() !== req.user.userId) {
    throw new CustomError.UnauthorizedError("You are not authorized to update this message");
  }

  ticket.message[messageIndex].text = message;

  await ticket.save();

  res.status(StatusCodes.OK).json({ ticket });
};

const deleteAllTickets = async (req, res) => {
  await Ticket.deleteMany({});
  res.status(StatusCodes.OK).json({ message: "All tickets deleted" });
};

const updateTicketStatus = async (req, res) => {
  const { id: ticketId } = req.params;
  const { status } = req.body;

  const ticket = await Ticket.findOneAndUpdate(
    { _id: ticketId },
    { status },
    { new: true, runValidators: true }
  );

  if (!ticket) {
    throw new CustomError.NotFoundError(`No ticket found with id ${ticketId}`);
  }

  res.status(StatusCodes.OK).json({ ticket });
};

const updateTicketPriority = async (req, res) => {
  const { id: ticketId } = req.params;
  const { priority } = req.body;

  const ticket = await Ticket.findOneAndUpdate(
    { _id: ticketId },
    { priority },
    { new: true, runValidators: true }
  );

  if (!ticket) {
    throw new CustomError.NotFoundError(`No ticket found with id ${ticketId}`);
  }

  res.status(StatusCodes.OK).json({ ticket });
};

module.exports = {
  getAllTickets,
  getSingleTicket,
  createTicket,
  updateTicket,
  deleteTicket,
  addMessage,
  updateMessage,
  getCurrentUserTickets,
  deleteAllTickets,
  updateTicketStatus,
  updateTicketPriority,
};