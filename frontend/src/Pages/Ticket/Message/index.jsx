import React, { useState, useEffect } from "react";
import { axiosSecure } from "../../../api/axios";
import { useParams } from "react-router-dom";

const Message = () => {
  const { id: ticketId } = useParams();
  console.log(ticketId);
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
            Authorization: `Bearer ${
              localStorage.userDetails &&
              JSON.parse(localStorage.userDetails).token
            }`,
          },
        }
      );

      setTicket(response.data.ticket);
      setMessage("");
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
              Authorization: `Bearer ${
                localStorage.userDetails &&
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
  }, [ticketId]);

  return (
    <>
      <div className="p-4 border">
        {ticket && (
          <div className="">
            <h3>Ticket Messages:</h3>
            {ticket.message.map((msg, index) => (
              <div key={index} className="border shadow-sm hover-shadow p-2 mb-2">
                <p>
                  <strong>Author ID:</strong> {msg.authorId}
                </p>
                <p className="">{msg.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="p-4">
        <h4>Replay</h4>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="position-relative">
            <div className="position-absolute top-50 start-0 translate-middle-y ms-3"></div>
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message"
              required
              className="form-control ps-5"
            />
            <button
              type="submit"
              className="btn btn-primary position-absolute end-0 bottom-0"
            >
              Add Message
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Message;
