import React, { useState, useEffect, useRef, useMemo } from "react";
import Container from "react-bootstrap/Container";
import { axiosSecure } from "../../../api/axios";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import { OverlayTrigger, Tooltip, Modal, Button, Form } from "react-bootstrap";
import { getUserDetails } from "../../../service";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import Col from "react-bootstrap/Col";
import PaginationComponent from "../../../component/Pagination/Pagination";
import "../../Users/List/listUser.scss";
import messageIcon from "../../../assests/icons/dialog-svgrepo-com.svg";
import assignIcon from "../../../assests/icons/user-plus-rounded-svgrepo-com.svg";
import deleteIcon from "../../../assests/icons/trash-bin-minimalistic-svgrepo-com.svg";
import detailsIcon from "../../../assests/icons/square-top-down-svgrepo-com.svg";

const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [adminUsers, setAdminUsers] = useState([]);
  const [selectedAdminEmail, setSelectedAdminEmail] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const { role } = getUserDetails();
  const ITEMS_PER_PAGE = 5;


  const handleDeleteTicket = async (ticketId) => {
    if (window.confirm("Are you sure you want to delete this ticket?")) {
      try {
        await axiosSecure.delete(`/ticket/deleteTicket/${ticketId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.userDetails &&
              JSON.parse(localStorage.userDetails).token
              }`,
          },
        });
        fetchTickets(); // Refresh the ticket list
      } catch (error) {
        console.error("Error deleting ticket:", error);
      }
    }
  };


  useEffect(() => {
    fetchTickets();
    console.log(tickets)
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
          Authorization: `Bearer ${localStorage.userDetails &&
            JSON.parse(localStorage.userDetails).token
            }`,
        },
      });
      setTickets(response?.data?.tickets);

      setTotalItems(response?.data?.tickets.length);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  const fetchAdminUsers = async () => {
    try {
      const response = await axiosSecure.get("/user", {
        headers: {
          Authorization: `Bearer ${localStorage.userDetails &&
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

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const filtered = useMemo(() => {
    let filteredResult = tickets.sort((a, b) =>
      a.ticketTitle.localeCompare(b.ticketTitle)
    );

    if (search) {
      filteredResult = filteredResult.filter(
        (ticket) =>
          ticket.ticketTitle.toLowerCase().includes(search.toLowerCase()) ||
          ticket.branch.toLowerCase().includes(search.toLowerCase())
      );
    }

    setTotalItems(filteredResult.length);

    return filteredResult.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
    );
  }, [currentPage, tickets, search]);

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
            Authorization: `Bearer ${localStorage.userDetails &&
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
      <div className="flex-grow-1 mt-3 h-100 w-100 px-4">
        <div className="d-flex align-items-center justify-content-between border-bottom border-2">
          <div className="">
            <h2 className="py-3 text-uppercase fw-bolder">Ticket List</h2>
          </div>
          <div className="d-flex">
            <Form.Group
              as={Col}
              md="3"
              className="pe-3 w-auto"
              controlId="validationCustom01"
            >
              <Form.Control
                onChange={handleSearch}
                type="text"
                placeholder="Search with first name"
              />
            </Form.Group>
            {role === "user" && (
              <div className="">
                <Link to="/ticket/createTicket" replace className="btn btn-primary">
                  Create Ticket
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* <div className="d-flex align-items-center justify-content-between">
          <h2 className="py-3 text-uppercase fw-bolder">Tickets</h2>
          <Form.Group as={Form.Col} md="3" className="pe-3">
            <Form.Control
              onChange={handleSearch}
              type="text"
              placeholder="Search tickets..."
            />
          </Form.Group>
        </div> */}
        <Table striped bordered hover bsPrefix="custom-table">
          <thead>
            <tr>
              <th>Ticket Title</th>
              {role !== "user" && (
                <>
                  <th>Created By</th>
                  <th>Branch</th>
                </>
              )}
              <th>Due Date</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Tag</th>
              <th className="text-start">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((ticket) => (
              <tr key={ticket._id}>
                <td>
                  {ticket.ticketTitle}
                </td>
                {role !== "user" && (
                  <>
                    <td>{ticket.createdBy.fname + " " + ticket.createdBy.lname}</td>
                    <td>{ticket.branch}</td>
                  </>
                )}
                <td>{new Date(ticket.dueDate).toLocaleDateString()}</td>
                <td>
                  <span className={`fw-bold ${ticket.priority === "High"
                    ? "text-danger bg-danger-subtle p-2 rounded-2"
                    : ticket.priority === "Medium"
                      ? "text-warning bg-warning-subtle p-2 rounded-2"
                      : "text-info-emphasis bg-dark-subtle p-2 rounded-2"
                    }`}>
                    {ticket.priority}
                  </span>
                </td>
                <td>{ticket.status}</td>
                <td>{ticket.tag}</td>
                <td className="d-flex gap-2 justify-content-start">
                  <Link to={`/ticket/details/${ticket._id}`} title="View Details">
                    <img className="bg-info p-1 rounded-3" src={detailsIcon} alt="details" width="32px" />
                  </Link>
                  {role !== "superadmin" && <Link to={`/ticket/addMessage/${ticket._id}`} title="Message" replace>
                    <img className="bg-success p-1 rounded-3" src={messageIcon} alt="message" width="32px" />
                  </Link>}
                  {role === "superadmin" && ticket.tag === "notassigned" && (
                    <span
                      title="Assign"
                      role="button"
                      onClick={() => handleAssignmentModal(ticket._id)}
                    >
                      <img className="bg-primary p-1 rounded-3" src={assignIcon} alt="assign" width="32px" />
                    </span>
                  )}
                  {role === "superadmin" && ticket.status === "Closed" && (
                    <span
                      title="Delete"
                      role="button"
                      onClick={() => handleDeleteTicket(ticket._id)}
                    >
                      <img className="bg-danger p-1 rounded-3" src={deleteIcon} alt="delete" width="32px" />
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div className="d-flex justify-content-end relative bottom-20 me-3">
          <PaginationComponent
            total={totalItems}
            itemsPerPage={ITEMS_PER_PAGE}
            currentPage={currentPage}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>

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
