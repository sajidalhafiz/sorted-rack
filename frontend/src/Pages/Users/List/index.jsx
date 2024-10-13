import React, { useEffect, useState, useMemo, useRef } from "react";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { Link } from "react-router-dom";
import Col from "react-bootstrap/Col";
import { axiosSecure } from "../../../api/axios";
import useAxios from "../../../Hooks/useAxios";
import "./listUser.scss";
import PaginationComponent from "../../../component/Pagination/Pagination";
import editIcon from "../../../assests/icons/pen-2-svgrepo-com.svg";
import deleteIcon from "../../../assests/icons/trash-bin-minimalistic-svgrepo-com.svg";
import { Toaster } from "../../../component/Toaster/Toaster";

import { Modal } from 'react-bootstrap';
import { Spinner } from "react-bootstrap";
import { Button } from "react-bootstrap";

const deleteUser = (userId) =>
  axiosSecure.delete(`/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.userDetails && JSON.parse(localStorage.userDetails).token}`,
    },
  });

const ListUser = () => {
  const [showToaster, setShowToaster] = useState(false);
  const [response, error, loading, axiosFetch] = useAxios();
  const [userDetails, setUserDetails] = useState([]);
  const [search, setSearch] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [showRemoveUserModal, setShowRemoveUserModal] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;
  const removeUserIdRef = useRef(null);

  const handleRemoveUserModal = () => {
    setShowRemoveUserModal(!showRemoveUserModal);
    setCurrentPage(1);
  };

  const handleRemoveUser = () => {
    setShowLoader(true);
    (async () => {
      const response = await deleteUser(removeUserIdRef.current);
      response && setShowLoader(false);
      handleRemoveUserModal();
      setRefresh(!refresh);
      setShowToaster(true);
    })();
  };

  const fetchUserDetails = async () => {
    axiosFetch({
      axiosInstance: axiosSecure,
      method: "GET",
      url: "/user",
      requestConfig: [
        {
          headers: {
            Authorization: `Bearer ${localStorage.userDetails &&
              JSON.parse(localStorage.userDetails).token}`,
          },
        },
      ],
    });
  };

  useEffect(() => {
    fetchUserDetails();
  }, [refresh]);

  useEffect(() => {
    if (response?.user) {
      console.log("All users:", response.user);
      setUserDetails(response.user);
      setTotalItems(response.user.length);
    }
  }, [response]);

  const handleStatusToggle = async (user) => {
    await axiosSecure.patch(
      `/user/updateuser/${user._id}`,
      {
        ...user,
        status: user?.status === "active" ? "inactive" : "active",
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.userDetails &&
            JSON.parse(localStorage.userDetails).token
            }`,
        },
      }
    );
    setRefresh(!refresh);
    // fetchUserDetails();
  };
  const filtered = useMemo(() => {
    let filteredResult = response?.user?.sort((a, b) =>
      a.fname.localeCompare(b.fname)
    );

    if (search) {
      filteredResult = filteredResult?.filter(
        (currentItem) =>
          currentItem.fname.toLowerCase().includes(search.toLowerCase()) ||
          currentItem.lname.toLowerCase().includes(search.toLowerCase()) ||
          currentItem.username.toLowerCase().includes(search.toLowerCase()) ||
          currentItem.email.toLowerCase().includes(search.toLowerCase()) ||
          currentItem.branch.toLowerCase().includes(search.toLowerCase()) ||
          currentItem.role.toLowerCase().includes(search.toLowerCase())
      );
    }

    return filteredResult?.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
    );
  }, [currentPage, response, userDetails, search]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };


  return (
    <div className="flex-grow-1 mt-3 h-100 w-100 px-4">
      <div className="d-flex align-items-center justify-content-between border-bottom border-2">
        <Modal
          show={showRemoveUserModal}
          onHide={handleRemoveUserModal}
          className={showLoader ? "on-loading" : ""}
        >
          {!showLoader ? (
            <>
              <Modal.Header closeButton>
                <Modal.Title>Are you sure?</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                Do you really want to delete this user? This process cannot be undone.
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleRemoveUserModal}>
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={handleRemoveUser}
                  disabled={showLoader}
                >
                  {showLoader ? <Spinner animation="grow" /> : "Delete"}
                </Button>
              </Modal.Footer>
            </>
          ) : (
            <Spinner animation="grow" variant="danger" />
          )}
        </Modal>

        <div className="">
          <h2 className="py-3 text-uppercase fw-bolder">User Listing</h2>
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

          <Link to="/user/add" replace className="btn btn-primary">
            Add User
          </Link>
        </div>
      </div>
      {loading && (
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      {!loading && error && <p className="error-msg">{error}</p>}

      {totalItems && (
        <div className="user-table overflow-x-auto mt-4">
          
          <Table className="mt-4" striped hover bsPrefix="custom-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Branch</th>
                <th>Type</th>
                <th className="text-start">Action</th>
              </tr>
            </thead>
            <tbody className="table-group-divider">
              {filtered?.map((item, index) => (
                <tr key={index}>
                  <td className="text-center">
                    <Form.Check
                      type="switch"
                      id={`custom-switch-${item._id}`}
                      defaultChecked={item.status === "active" ? true : false}
                      onClick={() => handleStatusToggle(item)}
                    />
                  </td>
                  <td>{item.fname}</td>
                  <td>{item.lname}</td>
                  <td>{item.email}</td>
                  <td>{item.branch}</td>
                  <td>{item.role}</td>
                  <td className="d-flex gap-2 justify-content-start">
                    <Link to={`/user/edit/${item._id}`} title="Edit" replace>
                      <img className="bg-warning p-1 rounded-3" src={editIcon} alt="edit" width="32px" />
                    </Link>
                    {item.status !== "active" && (
                      <span role="button" title="Delete"
                        onClick={() => {
                          handleRemoveUserModal();
                          removeUserIdRef.current = item._id;
                        }}
                      >
                        <img className="bg-danger p-1 rounded-3" src={deleteIcon} alt="delete" width="32px" />
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
      {loading && (
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      {!loading && error && <p className="error-msg">{error}</p>}
      <div className="d-flex justify-content-end relative bottom-20 me-3">
        <PaginationComponent
          total={response?.user?.length}
          itemsPerPage={ITEMS_PER_PAGE}
          currentPage={currentPage}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
      <Toaster
        title="user deleted successfully"
        bg="danger"
        showToaster={showToaster}
        setShowToaster={setShowToaster}
        to="user"
      ></Toaster>
    </div>
  );
};

export default ListUser;
