import React, { useState, useEffect, useRef } from "react";
import Container from "react-bootstrap/Container";
import { axiosSecure } from "../../../api/axios";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import { OverlayTrigger, Tooltip, Modal, Button, Form } from "react-bootstrap";
import { getUserDetails } from "../../../service";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";

const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [adminUsers, setAdminUsers] = useState([]);
  const [selectedAdminEmail, setSelectedAdminEmail] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const { role } = getUserDetails();

  useEffect(() => {
    fetchTickets();
    if (role === "superadmin") {
      fetchAdminUsers();
    }
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

  const fetchAdminUsers = async () => {
    try {
      const response = await axiosSecure.get("/user", {
        headers: {
          Authorization: `Bearer ${
            localStorage.userDetails &&
            JSON.parse(localStorage.userDetails).token
          }`,
        },
      });
      const admins = response.data.user.filter(
        (user) => user.role === "admin" && user.status === "active"
      );
      setAdminUsers(admins);
    } catch (error) {
      console.error("Error fetching admin users:", error);
    }
  };

  const handleAssignmentModal = (ticketId) => {
    setSelectedTicketId(ticketId);
    setSelectedAdminEmail([]);
    setShowAssignmentModal(true);
  };

  const handleCloseAssignmentModal = () => {
    setShowAssignmentModal(false);
  };

  const handleTicketAssignment = async () => {
    if (selectedAdminEmail.length === 0) return;

    setShowLoader(true);
    try {
      const selectedAdmin = adminUsers.find(
        (admin) => admin.email === selectedAdminEmail[0]
      );
      await axiosSecure.post(
        "/assignedTicket",
        {
          branch: selectedAdmin.branch,
          user: selectedAdmin._id,
          ticket: selectedTicketId,
        },
        {
          headers: {
            Authorization: `Bearer ${
              localStorage.userDetails &&
              JSON.parse(localStorage.userDetails).token
            }`,
          },
        }
      );
      setShowLoader(false);
      handleCloseAssignmentModal();
      fetchTickets(); // Refresh the ticket list
    } catch (error) {
      console.error("Error assigning ticket:", error);
      setShowLoader(false);
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
                  {role === "superadmin" && ticket.tag === "notassigned" && (
                    <Button
                      variant="link"
                      onClick={() => handleAssignmentModal(ticket._id)}
                    >
                      Assign
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>

      <Modal show={showAssignmentModal} onHide={handleCloseAssignmentModal}>
        <Modal.Header closeButton>
          <Modal.Title>Assign Ticket to Admin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Typeahead
            id="admin-select"
            onChange={setSelectedAdminEmail}
            options={adminUsers.map((admin) => admin.email)}
            placeholder="Choose admin email.."
            selected={selectedAdminEmail}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAssignmentModal}>
            Cancel
          </Button>
          <Button
            variant="primary"
            disabled={showLoader}
            onClick={handleTicketAssignment}
          >
            {showLoader ? "Assigning..." : "Assign"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TicketList;
