import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import { axiosSecure } from "../../../api/axios";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const TicketList = () => {

    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const response = await axiosSecure.get("/ticket", {
                headers: {
                    Authorization: `Bearer ${localStorage.userDetails && JSON.parse(localStorage.userDetails).token
                        }`,
                },
            });
            setTickets(response.data.tickets);
        } catch (error) {
            console.error("Error fetching tickets:", error);
        }
    };
    return (
        <div>
            <div style={{ width: "100px" }} className="col-1">
                <Link to="/ticket/createTicket" replace className="btn btn-primary">
                    Create Ticket
                </Link>
            </div>
            <Container className="mt-5">
                <h2>Tickets</h2>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Ticket Title</th>
                            <th>Branch</th>
                            <th>Due Date</th>
                            <th>Priority</th>
                            <th>Status</th>
                            <th className="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.map((ticket) => (
                            <tr key={ticket._id}>
                                <td>{ticket.ticketTitle}</td>
                                <td>{ticket.branch}</td>
                                <td>{new Date(ticket.dueDate).toLocaleDateString()}</td>
                                <td>{ticket.priority}</td>
                                <td>{ticket.status}</td>
                                <td className="text-center">
                                    <OverlayTrigger
                                        key={ticket._id}
                                        placement="bottom"
                                        overlay={
                                            <Tooltip id={`tooltip-${ticket._id}`}>Message</Tooltip>
                                        }
                                    >
                                        <Link to={`/ticket/addMessage/${ticket._id}`} replace>
                                            <i className="bi bi-pencil-square"></i>
                                        </Link>
                                    </OverlayTrigger>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
        </div>
    );
};

export default TicketList;