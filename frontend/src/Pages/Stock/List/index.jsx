import React, { useEffect, useState, useRef, useContext, useMemo } from "react";
import Spinner from "react-bootstrap/Spinner";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Button from "react-bootstrap/Button";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { MdAssignmentInd } from "react-icons/md";
import { Link } from "react-router-dom";
import { axiosSecure } from "../../../api/axios";
import useAxios from "../../../Hooks/useAxios";
import Modal from "react-bootstrap/Modal";
import { Typeahead } from "react-bootstrap-typeahead";
import { convertDate } from "../../../Utility/utility";
import { StockContext } from "../../../contexts/StockContext";
import PaginationComponent from "../../../component/Pagination/Pagination";
import { Col, Form, OverlayTrigger } from "react-bootstrap";
import { Toaster } from "../../../component/Toaster/Toaster";
import editIcon from "../../../assests/icons/pen-2-svgrepo-com.svg";
import deleteIcon from "../../../assests/icons/trash-bin-minimalistic-svgrepo-com.svg";
import assignIcon from "../../../assests/icons/user-plus-rounded-svgrepo-com.svg";
import { Tooltip } from "bootstrap";

const deleteStock = (stockItemId) =>
  axiosSecure.delete(`/product/${stockItemId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.userDetails && JSON.parse(localStorage.userDetails).token
        }`,
    },
  });

const ListStock = () => {
  const [showToaster, setShowToaster] = useState(false);
  const { deviceCategory, setDeviceCategory } = useContext(StockContext);
  const [response, error, loading, axiosFetch] = useAxios();
  const [devicesDetails, setDevicesDetails] = useState([]);
  const [search, setSearch] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [showRemoveDeviceModal, setShowRemoveDeviceModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const userList = useRef([]);
  const [emailList, setEmailList] = useState([]);
  const [selectedUserEmail, setSelectedUserEmail] = useState([]);
  const [selectedStockId, setSelectedStockId] = useState(null);
  const [showLoader, setShowLoader] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;
  const removeDeviceIdRef = useRef(null);

  const handleAssignmentModal = () =>
    setShowAssignmentModal(!showAssignmentModal);
  const handleRemoveDeviceModal = () => {
    setShowRemoveDeviceModal(!showRemoveDeviceModal);
    setCurrentPage(1);
  };

  const handleRemoveDevice = () => {
    setShowLoader(true);
    (async () => {
      const response = await deleteStock(removeDeviceIdRef.current);
      response && setShowLoader(false);
      handleRemoveDeviceModal();
      setRefresh(!refresh);
      setShowToaster(true);
    })();
  };

  const getAllStockDetails = () =>
    axiosFetch({
      axiosInstance: axiosSecure,
      method: "GET",
      url: "/product",
      requestConfig: [
        {
          headers: {
            Authorization: `Bearer ${localStorage.userDetails &&
              JSON.parse(localStorage.userDetails).token
              }`,
          },
        },
      ],
    });

  const getAllUsers = async () => {
    const { data } = await axiosSecure.get("/user", {
      headers: {
        Authorization: `Bearer ${localStorage.userDetails && JSON.parse(localStorage.userDetails).token
          }`,
      },
    });
    userList.current = data.user.filter(
      // (usr) => usr.branch === "Goa" && usr.status === "active"
      (usr) =>
        usr.branch === JSON.parse(localStorage.userDetails).branch &&
        usr.status === "active" // selecting user by branch is now dynamic as current user
    );
    const usersEmail = userList.current.map((user) => user.email);
    setEmailList(usersEmail);
  };

  const handleUserSelection = (stockId) => {
    setSelectedUserEmail([]);
    setSelectedStockId(stockId);
    handleAssignmentModal();
  };

  const handleUserStockAssignment = async () => {
    const selectedUserId = userList.current.find(
      (user) => user.email === selectedUserEmail[0]
    )._id;

    setShowLoader(true);
    await axiosSecure.post(
      "/assignedProduct",
      {
        branch: JSON.parse(localStorage.userDetails).branch,
        user: selectedUserId,
        product: selectedStockId,
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
    setRefresh(!refresh);
    handleAssignmentModal();
  };

  const handleProductCategorySelect = (evt) => {
    getAllStockDetails();
    setDeviceCategory(evt);
    setCurrentPage(1);
  };

  useEffect(() => {
    if (response?.products?.length > 0) {
      const filteredResponse = response?.products?.filter(
        (product) =>
          product.tag === "notassigned" &&
          product.productCategory === deviceCategory
      );
      setDevicesDetails(filteredResponse);
    }
  }, [response]);

  const filtered = useMemo(() => {
    let filteredResult = devicesDetails;
    setTotalItems(devicesDetails?.length);

    if (search) {
      if (deviceCategory === "System") {
        filteredResult = filteredResult.filter((result) =>
          result.systemName.toLowerCase().includes(search.toLowerCase())
        );
      } else {
        filteredResult = filteredResult.filter((result) =>
          result.accessoriesName.toLowerCase().includes(search.toLowerCase())
        );
      }
    }
    return filteredResult?.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
    );
  }, [currentPage, response, search]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const showDeviceDetails = () =>
    deviceCategory === "System" ? (
      <Table className="mt-4" striped hover bsPrefix="custom-table">
        <thead>
          <tr>
            <th className="stock-brand">System Brand</th>
            <th className="stock-model">System Model</th>
            <th className="stock-name">System Name</th>
            <th className="stock-os">OS</th>
            <th className="stock-cpu">CPU</th>
            <th className="stock-ram">RAM</th>
            <th className="stock-storage">Storage Type</th>
            <th className="stock-capacity">Storage Capacity</th>
            <th className="stock-mac">MAC Address</th>
            <th className="stock-key">Product Key</th>
            <th className="stock-serial">Serial Number</th>
            <th className="stock-date">Purchase Date</th>
            <th className="stock-warranty">Warranty Period</th>
            <th className="text-start table-action">Action</th>
          </tr>
        </thead>
        <tbody className="table-group-divider">
          {filtered.map((item, index) => (
            <tr key={index}>
              <td className="stock-brand"> {item?.systemBrand} </td>
              <td className="stock-model"> {item.systemModel} </td>
              <td className="stock-name"> {item.systemName} </td>
              <td className="stock-os"> {item.os} </td>
              <td className="stock-cpu"> {item.cpu} </td>
              <td className="stock-ram"> {item.ram} </td>
              <td className="stock-storage"> {item.storageType} </td>
              <td className="stock-capacity"> {item.storageCapacity} </td>
              <td className="stock-mac"> {item.macAddress} </td>
              <td className="stock-key"> {item.productKey} </td>
              <td className="stock-serial"> {item.serialNumber} </td>
              <td className="stock-date">
                {" "}
                {convertDate(item.dateOfPurchase || "")}{" "}
              </td>
              <td className="stock-warranty"> {item.warrantyPeriod} </td>
              <td className="d-flex justify-content-start gap-2">
                <Link to={`/stock/edit/${item._id}`} title="Edit" replace>
                  <img className="bg-warning p-1 rounded-3" src={editIcon} alt="edit" width="32px" />
                </Link>
                <span role="button" title="Delete" onClick={() => {
                  handleRemoveDeviceModal();
                  removeDeviceIdRef.current = item._id;
                }}
                >
                  <img className="bg-danger p-1 rounded-3" src={deleteIcon} alt="delete" width="32px" />
                </span>
                <span role="button" title="Assign" onClick={() => handleUserSelection(item._id)} >
                  <img className="bg-primary p-1 rounded-3" src={assignIcon} alt="assign" width="32px" />
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    ) : (
      <Table className="mt-4" striped hover bsPrefix="custom-table">
        <thead>
          <tr>
            <th>Accessories Type</th>
            <th>Accessories Name</th>
            <th>Date Of Purchase</th>
            <th>Serial Number</th>
            <th>Branch</th>
            <th>Warranty</th>
            <th className="text-start">Action</th>
          </tr>
        </thead>
        <tbody className="table-group-divider">
          {filtered.map((item, index) => (
            <tr key={index}>
              <td> {item?.productType} </td>
              <td> {item?.accessoriesName} </td>
              <td> {convertDate(item.dateOfPurchase || "")} </td>
              <td> {item.serialNumber} </td>
              <td> {item.branch} </td>
              <td> {item.warrantyPeriod} </td>
              <td className="d-flex justify-content-start gap-2">
                <Link to={`/stock/edit/${item._id}`} title="Edit" replace>
                  {/* <BiEdit /> */}
                  <img className="bg-warning p-1 rounded-3" src={editIcon} alt="edit" width="32px" />
                </Link>
                <span role="button" title="Delete" onClick={() => {
                  handleRemoveDeviceModal();
                  removeDeviceIdRef.current = item._id;
                }}>
                  <img className="bg-danger p-1 rounded-3" src={deleteIcon} alt="delete" width="32px" />
                </span>
                <span id="assign" role="button" title="Assign" onClick={() => handleUserSelection(item._id)}>
                  <img className="bg-primary p-1 rounded-3" src={assignIcon} alt="assign" width="32px" />
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );

  useEffect(() => {
    getAllStockDetails();
    getAllUsers();
  }, [refresh, deviceCategory]);

  return (
    <div className="flex-grow-1 mt-3 h-100 w-100 px-4">
      <div className="d-flex align-items-center justify-content-between">
        <Modal
          show={showRemoveDeviceModal}
          onHide={handleRemoveDeviceModal}
          className={showLoader ? "on-loading" : ""}
        >
          {!showLoader ? (
            <>
              <Modal.Header closeButton>
                <Modal.Title>Are you sure?</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                Do you really want to delete these records? This process cannot
                be undone.
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleRemoveDeviceModal}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleRemoveDevice}
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

        <Modal show={showAssignmentModal} onHide={handleAssignmentModal}>
          <Modal.Header closeButton>
            <Modal.Title>Please select the user</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Typeahead
              id="basic-example"
              onChange={setSelectedUserEmail}
              options={emailList}
              placeholder="Choose user email.."
              selected={selectedUserEmail}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleAssignmentModal}>
              Cancel
            </Button>
            <Button
              variant="primary"
              disabled={showLoader}
              onClick={handleUserStockAssignment}
            >
              {showLoader ? "Assigning..." : "Assign"}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>

      <div className="row border-bottom border-2">
        <div className="col-6">
          <h2 className="py-3 text-uppercase fw-bolder">Stock Listing</h2>
        </div>

        <div className="col-6 d-flex justify-content-end">
          <Form.Group
            as={Col}
            md="4"
            className="me-3"
            controlId="validationCustom01"
          >
            <Form.Control
              onChange={handleSearch}
              type="text"
              placeholder={`Search ${deviceCategory} by Name`}
            />
          </Form.Group>
          {
            <DropdownButton
              id="dropdown-basic-button"
              className="me-3"
              title={deviceCategory}
              onSelect={handleProductCategorySelect}
            >
              <Dropdown.Item eventKey="System">System</Dropdown.Item>
              <Dropdown.Item eventKey="Accessories">Accessories</Dropdown.Item>
            </DropdownButton>
          }
          <Link to="/stock/add">
            <Button variant="primary mb-2 float-right">
              Add {deviceCategory}
            </Button>
          </Link>
        </div>
      </div>

      <div style={{ width: "100%", overflow: "auto" }}>
        {showDeviceDetails()}
      </div>
      {loading && (
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      {!loading && error && <p className="error-msg">{error}</p>}
      <div className="d-flex justify-content-end me-3 mt-3">
        <PaginationComponent
          total={devicesDetails?.length}
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
        to="stock"
      ></Toaster>
    </div>
  );
};

export default ListStock;
