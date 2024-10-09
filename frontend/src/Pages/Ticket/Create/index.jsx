import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import FloatingLabel from "react-bootstrap/FloatingLabel";

import "./createTicket.scss";
import { axiosSecure } from "../../../api/axios";
import * as yup from "yup";
import { Toaster } from "../../../component/Toaster/Toaster";

const schema = yup.object().shape({
  branch: yup.string().required("Branch is required"),
  dueDate: yup.date().required("Due Date is required"),
  ticketDept: yup.string().required("Ticket Department is required"),
  priority: yup.string().required("Priority is required"),
  ticketTitle: yup.string().required("Ticket Title is required"),
  message: yup.string().required("Message is required"),
});

const handleOnSubmit = (values) =>
  
  axiosSecure.post(
    "/ticket/createTicket",
    {
      branch: values.branch,
      dueDate: values.dueDate,
      ticketDept: values.ticketDept,
      priority: values.priority,
      ticketTitle: values.ticketTitle,
      message: values.message
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.userDetails && JSON.parse(localStorage.userDetails).token
          }`,
      },
    }
  );

const CreateTicket = () => {
  const [showAddToaster, setShowAddToaster] = useState(false);
  const [showErrorToaster, setShowErrorToaster] = useState(false);
  const [error, setError] = useState("");
  

  return (
    <div className="flex-grow-1">
      <Formik
        validationSchema={schema}
        initialValues={{
          branch: "",
          dueDate: "",
          ticketDept: "",
          priority: "",
          ticketTitle: "",
          message: "",
          // assignedTo: "",
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          try {
            console.log(values);

            const response = await handleOnSubmit(values);
            console.log(response);
            
            if (response.status === 201) {
              setShowAddToaster(true);
              resetForm();
            }
          } catch (errorMsg) {
            setError(errorMsg.response.data.msg);
            setShowErrorToaster(true);
          }
          setSubmitting(false);
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleSubmit,
          isSubmitting,
        }) => (
          <Form onSubmit={handleSubmit}>
            <Container className="add-ticket-page d-flex flex-column justify-content-center">
              <h2 className="mb-4">Create Ticket</h2>
              <Row>
                <Col md={6} lg={6} xl={6}>
                  <FloatingLabel controlId="floatingBranch" label="Branch" className="mb-3">
                    <Form.Select
                      className="form-select"
                      type="text"
                      name="branch"
                      aria-label="Select a branch"
                      isInvalid={!!touched.branch && !!errors.branch}
                      value={values.branch}
                      onChange={handleChange}
                    >
                      <option value="" disabled hidden>
                      </option>
                      <option value="Dhaka">Dhaka</option>
                      <option value="Goa">Goa</option>
                      <option value="Sylhet">Sylhet</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">{errors.branch}</Form.Control.Feedback>
                  </FloatingLabel>
                </Col>
                <Col md={6}>
                  <FloatingLabel controlId="floatingDueDate" label="Due Date" className="mb-3">
                    <Form.Control
                      type="date"
                      placeholder="Due Date"
                      name="dueDate"
                      value={values.dueDate}
                      onChange={handleChange}
                      isInvalid={touched.dueDate && !!errors.dueDate}
                    />
                    <Form.Control.Feedback type="invalid">{errors.dueDate}</Form.Control.Feedback>
                  </FloatingLabel>
                </Col>
                <Col md={6}>
                  <FloatingLabel controlId="floatingTicketDept" label="Ticket Department" className="mb-3">
                    <Form.Select
                      name="ticketDept"
                      value={values.ticketDept}
                      onChange={handleChange}
                      isInvalid={touched.ticketDept && !!errors.ticketDept}
                    >
                      <option value="" disabled hidden>
                      </option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Support">Support</option>
                      <option value="Repair">Repair</option>
                      <option value="Resource">Resource</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">{errors.ticketDept}</Form.Control.Feedback>
                  </FloatingLabel>
                </Col>
                <Col md={6}>
                  <FloatingLabel controlId="floatingPriority" label="Priority" className="mb-3">
                    <Form.Select
                      name="priority"
                      value={values.priority}
                      onChange={handleChange}
                      isInvalid={touched.priority && !!errors.priority}
                    >
                      <option value="">Select Priority</option>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">{errors.priority}</Form.Control.Feedback>
                  </FloatingLabel>
                </Col>
                <Col md={12}>
                  <FloatingLabel controlId="floatingTicketTitle" label="Ticket Title" className="mb-3">
                    <Form.Control
                      type="text"
                      placeholder="Ticket Title"
                      name="ticketTitle"
                      value={values.ticketTitle}
                      onChange={handleChange}
                      isInvalid={touched.ticketTitle && !!errors.ticketTitle}
                    />
                    <Form.Control.Feedback type="invalid">{errors.ticketTitle}</Form.Control.Feedback>
                  </FloatingLabel>
                </Col>
                <Col md={12}>
                  <FloatingLabel controlId="floatingMessage" label="Message" className="mb-3">
                    <Form.Control
                      as="textarea"
                      placeholder="Message"
                      name="message"
                      value={values.message}
                      onChange={handleChange}
                      isInvalid={touched.message && !!errors.message}
                      style={{ height: '100px' }}
                    />
                    <Form.Control.Feedback type="invalid">{errors.message}</Form.Control.Feedback>
                  </FloatingLabel>
                </Col>
                {/* <Col md={12}>
                  <FloatingLabel controlId="floatingAssignedTo" label="Assigned To" className="mb-3">
                    <Form.Control
                      type="text"
                      placeholder="Assigned To"
                      name="assignedTo"
                      value={values.assignedTo}
                      onChange={handleChange}
                      isInvalid={touched.assignedTo && !!errors.assignedTo}
                    />
                    <Form.Control.Feedback type="invalid">{errors.assignedTo}</Form.Control.Feedback>
                  </FloatingLabel>
                </Col> */}
              </Row>
              <Button type="submit" disabled={isSubmitting} className="mt-3">
                Create Ticket
              </Button>
            </Container>
          </Form>
        )}
      </Formik>

      <Toaster
        title="Ticket created successfully"
        bg="success"
        showToaster={showAddToaster}
        setShowToaster={setShowAddToaster}
        to="ticket/createTicket"
      />
      <Toaster
        title={error}
        bg="danger"
        showToaster={showErrorToaster}
        setShowToaster={setShowErrorToaster}
        to="ticket/createTicket"
      />
    </div>
  );
};

export default CreateTicket;