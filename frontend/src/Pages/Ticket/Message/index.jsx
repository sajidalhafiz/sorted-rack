import React, { useState, useEffect } from "react";
import { axiosSecure } from "../../../api/axios";
import { useParams } from "react-router-dom";
import plainIcon from "../../../assests/icons/plain-svgrepo-com.svg";
import { getUserDetails } from "../../../service";

const Message = () => {
  const { id: ticketId } = useParams();
  // console.log(ticketId);
  const { userId } = getUserDetails();
  const [refreshKey, setRefreshKey] = useState(0);
  const [message, setMessage] = useState("");
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axiosSecure.post(
        `/ticket/addMessage/${ticketId}`,
        { message },
        {
          headers: {
            Authorization: `Bearer ${localStorage.userDetails &&
              JSON.parse(localStorage.userDetails).token
              }`,
          },
        }
      );

      setTicket(response.data.ticket);
      setMessage("");
      setRefreshKey(oldKey => oldKey + 1);
    } catch (err) {
      setError(
        err.response?.data?.msg || "An error occurred while adding the message."
      );
    }
  };

  useEffect(() => {
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

    fetchTicket();
  }, [ticketId, refreshKey]);

  return (
    <>
      <div className="p-4 border" style={{ height: '70vh', overflowY: 'auto' }}>
        {ticket && (
          <div className="bg-dark-subtle p-2 rounded-2 h-100">
            {ticket.message.map((msg, index) => (
              <div
                key={index}
                className={`d-flex ${msg.authorId._id === userId ? 'justify-content-end' : 'justify-content-start'} mb-3`}
              >
                <div
                  className={`rounded-3 p-3 ${msg.authorId._id === userId ? 'bg-dark text-white' : 'bg-light'}`}
                  style={{ maxWidth: '70%' }}
                >
                  <small className={`${msg.authorId._id === userId ? 'text-white-50' : 'text-success'}`}>
                    {msg.authorId.fname} {msg.authorId.lname}
                  </small>
                  <p className="mb-0 mt-1">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="p-4">
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="d-flex justify-content-between">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Message"
              required
              className="form-control ps-4 rounded-3 me-2"
            />
            <button
              type="submit"
              className="btn btn-primary"
            >
              <img className="bg-primary p-1 rounded-3" src={plainIcon} alt="plain" width="32px" />
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Message;
