import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import { axiosSecure } from "../../../api/axios";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { getUserDetails } from "../../../service";
// import { useParams } from "react-router-dom";

const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const { role } = getUserDetails();
//   const { id: ticketId } = useParams();

  useEffect(() => {
    fetchTickets();
  }, [role]);

  const fetchTickets = async () => {
    try {
      let endpoint = "/ticket";
      if (role !== "superadmin") {
        endpoint = "/ticket/currentUserTicket"; 
      }

      const response = await axiosSecure.get(endpoint, {
        headers: {
          Authorization: `Bearer ${
            localStorage.userDetails &&
            JSON.parse(localStorage.userDetails).token
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
      {role === "user" && (
        <div className="col-2">
          <Link to="/ticket/createTicket" replace className="btn btn-primary">
            Create Ticket
          </Link>
        </div>
      )}
      <Container className="mt-5">
        <h2>Tickets</h2>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Ticket Title</th>
              {role !== "user" && <th>Branch</th>}
              <th>Due Date</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Tag</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket._id}>
                <td>{ticket.ticketTitle}</td>
                {role !== "user" && <td>{ticket.branch}</td>}
                <td>{new Date(ticket.dueDate).toLocaleDateString()}</td>
                <td
                  className={`fw-bold ${
                    ticket.priority === "High"
                      ? "text-danger"
                      : ticket.priority === "Medium"
                      ? "text-warning"
                      : "text-info-emphasis"
                  }`}
                >
                  {ticket.priority}
                </td>
                <td>{ticket.status}</td>
                <td>{ticket.tag}</td>
                <td className="text-center">
                  <OverlayTrigger
                    key={ticket._id}
                    placement="bottom"
                    overlay={
                      <Tooltip id={`tooltip-${ticket._id}`}>Message</Tooltip>
                    }
                  >
                    <Link to={`/ticket/addMessage/${ticket._id}`} replace>
                      Message
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
