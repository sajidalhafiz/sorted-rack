const Ticket = require("../models/ticket");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

const createTicket = async (req, res) => {
    
  const ticket = await Ticket.create(req.body);
  res.status(StatusCodes.CREATED).json({ ticket });
};

const getAllTicket = async (req, res) => {
    let tickets;
    if (req.user.role === "superadmin") {
      tickets = await Ticket.find({});
    }
    if (req.user.role === "admin") {
      let { branch } = req.user;
      tickets = await Ticket.find({ branch });
    }
    res.status(StatusCodes.OK).json({ tickets, count: tickets.length });
  };

  module.exports = {
    createTicket,
    getAllTicket,
  }