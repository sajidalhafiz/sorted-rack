import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { axiosSecure } from '../../../api/axios';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import hashIcon from "../../../assests/icons/hashtag-svgrepo-com.svg";
import { getUserDetails } from '../../../service';

const TicketDetails = () => {
    const { id: ticketId } = useParams();
    const { role } = getUserDetails();
    const [ticket, setTicket] = useState(null);
    const [assignedTicket, setAssignedTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reply, setReply] = useState('');

    const fetchTicket = async () => {
        try {
            const response = await axiosSecure.get(
                `/ticket/getSingleTicket/${ticketId}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.userDetails &&
                            JSON.parse(localStorage.userDetails).token
                            }`,
                    },
                }
            );
            setTicket(response.data.ticket);
        } catch (err) {
            setError("Failed to fetch ticket data");
        }
    };

    const getAssignedUser = async () => {
        try {
            const response = await axiosSecure.get(
                `/assignedTicket/${ticketId}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.userDetails &&
                            JSON.parse(localStorage.userDetails).token
                            }`,
                    },
                }
            );
            setAssignedTicket(response.data.assignedTicket);
        } catch (err) {
            console.error("Failed to fetch assigned ticket data", err);

        }
    };

    const updateTicketStatus = async (newStatus) => {
        try {
            const response = await axiosSecure.patch(
                `/ticket/updateTicketStatus/${ticketId}`,
                { status: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.userDetails &&
                            JSON.parse(localStorage.userDetails).token
                            }`,
                    },
                }
            );
            setTicket(response.data.ticket);
        } catch (err) {
            console.error("Failed to update ticket status", err);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await fetchTicket();
            await getAssignedUser();
            setLoading(false);
        };
        fetchData();
    }, [ticketId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!ticket) return <div>No ticket found</div>;

    return (
        <div className="flex-grow-1 p-4">
            <div className="border-bottom border-2 mb-4">
                <h2 className="py-1 text-uppercase fw-bolder">Ticket Details</h2>
            </div>
            <Row>
                <Col md={6}>
                    <Card className="mb-3">
                        <Card.Body className="d-flex align-items-center justify-content-between">
                            <h5>
                                <img src={hashIcon} alt="hash" width="36px" className='me-2 p-2 bg-dark-subtle rounded-3' />
                                {ticket._id.substring(0, 6)}
                            </h5>
                            <p className={`p-2 ${ticket.tag === "assigned" ? "bg-success-subtle rounded-3 text-success" : "bg-danger-subtle rounded-3 text-danger"}`}>{ticket.tag}</p>
                        </Card.Body>
                    </Card>
                    <Card className="mb-3">
                        <Card.Body className='d-flex justify-content-between '>
                            <div>
                                <h6>Created By:</h6>
                                <h4 className='py-1'>{ticket.createdBy.fname} {ticket.createdBy.lname}</h4>
                                <p className='my-0'><strong>Date:</strong> {new Date(ticket.createdAt).toLocaleDateString()}</p>
                                <p className='my-0'><strong>Branch:</strong> {ticket.createdBy.branch}</p>
                            </div>
                            {assignedTicket &&
                                <div className='text-end'>
                                    <h6>Assigned To:</h6>
                                    <h4 className='py-1'>{assignedTicket.user.fname} {assignedTicket.user.lname}</h4>
                                    <p className='my-0'><strong>Email:</strong> {assignedTicket.user.email}</p>
                                    <p className='my-0'><strong>Branch:</strong> {assignedTicket.user.branch}</p>
                                </div>}
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Body>
                            <h6>Ticket Details</h6>
                            <p><strong>Due Date:</strong> {new Date(ticket.dueDate).toLocaleDateString()}</p>
                            <p><strong>Priority:</strong> {ticket.priority}</p>
                            <p><strong>Status:</strong> {ticket.status}</p>
                        </Card.Body>
                    </Card>
                    {role === 'superadmin' && (
                        <Button
                            variant={ticket.status === 'Open' ? 'danger' : 'success'}
                            onClick={() => updateTicketStatus(ticket.status === 'Open' ? 'Closed' : 'Open')}
                            className='my-4'
                        >
                            {ticket.status === 'Open' ? 'Close Ticket' : 'Reopen Ticket'}
                        </Button>
                    )}
                </Col>
                <Col md={6}>
                    <Card>
                        <Card.Body className='d-flex flex-column gap-4'>
                            <div className='border-bottom border-1'>
                                <h4>{ticket.ticketTitle}</h4>
                                <h6><strong>Ticket Department:</strong> {ticket.ticketDept}</h6>
                            </div>
                            <div className='my-2 border-bottom border-1'>
                                <h5>Description</h5>
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                </p>
                            </div>
                            <h5>Messages:</h5>
                            <div className='border border-2 rounded-3 bg-dark-subtle p-2 overflow-scroll' style={{ height: "auto" }}>
                                {ticket.message.map((msg, index) => (
                                    <div key={index} className="border shadow-sm p-2 mb-2 bg-white rounded-2">
                                        <small className='text-secondary'>{msg.authorId.fname} {msg.authorId.lname}</small>
                                        <p className="">{msg.text}</p>
                                    </div>
                                ))}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default TicketDetails;