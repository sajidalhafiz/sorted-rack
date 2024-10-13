import React, { useRef, useState, useEffect, useMemo } from "react";
import { BsGear } from 'react-icons/bs';
import { BiCheckCircle } from "react-icons/bi";
import { Form, Table, Toast, Container, Dropdown, Col } from "react-bootstrap";
import { axiosSecure } from "../../api/axios";
import PaginationComponent from "../../component/Pagination/Pagination";
import Columns from "../../constants/AssigmentColumns.json";
import unassignIcon from "../../assests/icons/user-minus-rounded-svgrepo-com.svg";
import addIcon from "../../assests/icons/add-circle-svgrepo-com.svg";

const AssignItem = () => {
  const [columns, setColumns] = useState(Columns);
  const [assignedDeviceUserList, setAssignedDeviceUserList] = useState([]);
  const [search, setSearch] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const [showToaster, setShowToaster] = useState(false);

  const getAssignedDeviceDetails = async () => {
    const response = await axiosSecure.get("/assignedProduct", {
      headers: {
        Authorization: `Bearer ${localStorage.userDetails && JSON.parse(localStorage.userDetails).token}`,
      },
    });

    setAssignedDeviceUserList(response?.data?.assignedDevices);
  };

  const getDate = (date) => {
    const newDate = new Date(date);
    const dt = newDate.getUTCDate();
    const month = newDate.getUTCMonth() + 1 === 13 ? 12 : newDate.getUTCMonth() + 1;
    const year = newDate.getUTCFullYear();
    return `${dt}-${month}-${year}`;
  };

  const handleUnassignment = async (assignedDeviceDocId) => {
    try {
      const response = await axiosSecure.patch(
        `assignedProduct/${assignedDeviceDocId}`,
        {
          product: assignedDeviceDocId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.userDetails && JSON.parse(localStorage.userDetails).token}`,
          },
        }
      );
      if (response?.status === 200) {
        setShowToaster(true);
        getAssignedDeviceDetails();
      }
    } catch (err) {
      alert(err);
    }
  };

  useEffect(() => {
    getAssignedDeviceDetails();
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const filtered = useMemo(() => {
    let filteredResult = assignedDeviceUserList;
    setTotalItems(filteredResult?.length);
    console.log(filteredResult)
    if (search) {
      filteredResult = filteredResult.filter((result) => result.firstName.toLowerCase().includes(search.toLowerCase()));
    }
    return filteredResult?.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
    );
  }, [currentPage, assignedDeviceUserList, search]);

  const handlerCheckbox = (e) => {
    const checkboxStatus = e.target.checked;
    const name = e.target.name;
    const updatedColumns = columns.length > 0 && columns.map((column) => {
      if (column.name === name) {
        column.show = !column.show;
      }
      return column;
    });
    setColumns(updatedColumns);
    setTimeout(() => (document.querySelectorAll(`input[name=${name}]`)[0].checked = checkboxStatus), 500);
  };

  return (
    <div className="flex-grow-1 my-3 h-100 w-100 px-4">
      <div className="d-flex align-items-center justify-content-between border-bottom border-2">
        <div className="col-9">
          <h2 className=" py-3 text-uppercase fw-bolder">Assigned Devices</h2>
        </div>
        <Form.Group as={Col} md="3" className="pe-3" controlId="validationCustom01">
          <Form.Control onChange={handleSearch} type="text" placeholder="Search devices by first name" />
        </Form.Group>
      </div>

      <div className="d-flex justify-content-end mt-2">
        <Dropdown>
          <Dropdown.Toggle variant="primary" id="dropdown-basic" className="table-column-btn">
            <img src={addIcon} alt="unassign" width="32px" />
          </Dropdown.Toggle>
          <Dropdown.Menu className="table-column-filter">
            {columns.slice(8).map((column, index) => (
              <Dropdown.Item key={index}>
                <input type="checkbox" name={column.name} onChange={handlerCheckbox} checked={column.show} />
                <label>&nbsp;{column.fieldName}</label>
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>

      <Toast
        className="toaster-position"
        onClose={() => setShowToaster(!showToaster)}
        show={showToaster}
        delay={2000}
        autohide
      >
        <Toast.Header>
          <div className="info-container">
            <BiCheckCircle className="info-icon" />
            &nbsp;
          </div>
          <div className="toaster-title">
            <strong className="me-auto">Unassignment Successfull</strong>
          </div>
        </Toast.Header>
      </Toast>

      {filtered?.length > 0 ? (
        <div className="user-table overflow-x-auto mt-4">
          <Table striped hover responsive bsPrefix="custom-table" >
            <thead>
              <tr>
                {columns.length > 0 && columns.map(({ id, fieldName, name, show }) => (
                  <th id={name} className={`${show ? "show" : "hide"} `} key={id}>
                    {fieldName}
                  </th>
                ))}

                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="table-group-divider">
              {filtered.map((item, index) => {
                return (
                  <tr key={index}>
                    {columns.length > 0 && columns.map(({ name, show }) => (
                      <td id={name} className={`${show ? "show" : "hide"} `}>
                        {item[name] || "---"}
                      </td>
                    ))}
                    <td id="actions" className="text-center">
                      <span
                        title="Un-Assign"
                        role="button"
                        onClick={() => handleUnassignment(item._id)}
                      >
                        <img className="bg-danger p-1 rounded-3" src={unassignIcon} alt="assign" width="32px" />
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      ) : (
        <h4 className="ms-3 mt-3">no devices found....</h4>
      )}
      <div className="d-flex justify-content-end me-3">
        <PaginationComponent
          total={totalItems}
          itemsPerPage={ITEMS_PER_PAGE}
          currentPage={currentPage}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};

export default AssignItem;
