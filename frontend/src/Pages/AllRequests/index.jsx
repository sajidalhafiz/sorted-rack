import React, { useEffect, useState, useMemo } from "react";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { Link } from "react-router-dom";
import Col from "react-bootstrap/Col";
import { axiosSecure } from "../../../src/api/axios";
import useAxios from "../../../src/Hooks/useAxios";
import "./allRequest.scss";
import PaginationComponent from "../../../src/component/Pagination/Pagination";

const AllRequests = () => {
  //   const [response, error, loading, axiosFetch] = useAxios();
  const [issues, setIssues] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;


  const getAllIssues = async () => {
    const response = await axiosSecure.get("/deviceRequest", {
      headers: {
        Authorization: `Bearer ${
          localStorage.userDetails && JSON.parse(localStorage.userDetails).token
        }`,
      },
    });

    setIssues(response?.data?.deviceRequest);
    setTotalItems(response?.data?.count);
    console.log(totalItems);
    console.log(response?.data?.deviceRequests);
  };

  useEffect(() => {
    getAllIssues();
  }, [issues]);

  return (
    <Container className="flex-grow-1">
      <div className="d-flex align-items-center justify-content-between">
        <div className="col-8">
          <h2 className="py-3">All Requests</h2>
        </div>

        {/* <div style={{ width: "100px" }} className="col-1">
          <Link to="/user/add" replace className="btn btn-primary">
            Add User
          </Link>
        </div> */}
      </div>
      {/* {loading && (
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      {!loading && error && <p classname="error-msg">{error}</p>} */}

      {totalItems && (
        <div className="user-table">
          <Table striped hover>
            <thead>
              <tr>
                {/* <th>Name</th> */}
                <th>Branch</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Issue</th>
                {/* <th className="text-center">Chat</th>
                <th className="text-center">Action</th> */}
              </tr>
            </thead>
            <tbody className="table-group-divider">
             
                <tr >
                  <td>Sylhet</td>
                  <td>Processing</td>
                  <td>Low</td>
                  <td>Testing...</td>
                </tr>
             
            </tbody>
          </Table>
        </div>
      )}
      <div className="d-flex justify-content-end relative bottom-20 me-3">
        <PaginationComponent
          total={totalItems}
          itemsPerPage={ITEMS_PER_PAGE}
          currentPage={currentPage}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </Container>
  );
};
export default AllRequests;
