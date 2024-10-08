import React, { useState } from "react";
import { Formik } from "formik";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import "./requestDevice.scss";
import { axiosSecure } from "../../../src/api/axios";
import * as yup from "yup";
import { Toaster } from "../../../src/component/Toaster/Toaster";

const schema = yup.object().shape({
  branch: yup.string().required("Branch is required"),
  priority: yup.string().required("Priority is required"),
  issueStatement: yup.string().required("Issue is required"),
});

const handleOnSubmit = (values) => axiosSecure.post(
    "/deviceRequest",
    {
      branch: values.branch,
      priority: values.priority,
      issueStatement: values.issueStatement,
      requestUserId: JSON.parse(localStorage.userDetails).userId,
    },
    {
      headers: {
        Authorization: `Bearer ${
          localStorage.userDetails && JSON.parse(localStorage.userDetails).token
        }`,
      },
    }
  );

const RequestDevice = () => {
  const [showAddToaster, setShowAddToaster] = useState(false);
  const [showErrorToaster, setShowErrorToaster] = useState(false);
  const [error, setError] = useState("");

  return (
    <div className="flex-grow-1">
      <Formik
        validationSchema={schema}
        initialValues={{
          branch: "",
          priority: "",
          issueStatement: "",
        }}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const response = await handleOnSubmit(values);
            if (response.status === 201) {
              setShowAddToaster(true);
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
            <Container className="add-user-page d-flex flex-column justify-content-center">
              <h2 className=" mb-4 ">Request Device</h2>
              <h5 className="fw-bold mb-3">Request Details</h5>
              <Row>
                <Col md={6} lg={6} xl={6}>
                  <FloatingLabel>
                    <Form.Select
                      className="form-select"
                      type="text"
                      name="priority"
                      aria-label="Select a priority"
                      isInvalid={!!touched.priority && !!errors.priority}
                      value={values.priority}
                      onChange={handleChange}
                    >
                      <option value="" disabled hidden>
                        Select
                      </option>
                      <option value="lowDhaka">low</option>
                      <option value="medium">medium</option>
                      <option value="high">high</option>
                    </Form.Select>
                    <label htmlFor="floatingSelect">Select a priority</label>
                    <div className="invalid-feedback">
                      {touched.priority && errors.priority}
                    </div>
                  </FloatingLabel>
                </Col>

                <Col md={6} lg={6} xl={6}>
                  <FloatingLabel>
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
                        Select
                      </option>
                      <option value="Dhaka">Dhaka</option>
                      <option value="Goa">Goa</option>
                      <option value="Sylhet">Sylhet</option>
                    </Form.Select>
                    <label htmlFor="floatingSelect">Select a branch</label>
                    <div className="invalid-feedback">
                      {touched.branch && errors.branch}
                    </div>
                  </FloatingLabel>
                </Col>

                <Col md={6} lg={6} xl={6}>
                  <FloatingLabel
                    controlId="floatingusername"
                    label="issueStatement"
                    className="mb-3"
                  >
                    <Form.Control
                      type="text"
                      placeholder="What's your issue"
                      name="issueStatement"
                      onChange={handleChange}
                      value={values["issueStatement"]}
                      isInvalid={
                        touched.issueStatement && !!errors.issueStatement
                      }
                    />
                    <div className="invalid-feedback">
                      {errors.issueStatement &&
                        touched.issueStatement &&
                        errors.issueStatement}
                    </div>
                  </FloatingLabel>
                </Col>
              </Row>
              <Row></Row>
              <Col md={12} lg={12} xl={12} className="mt-4 mb-4 ">
                <Button type="submit" disabled={isSubmitting}>
                  SUBMIT REQUEST
                </Button>
              </Col>
            </Container>
          </Form>
        )}
      </Formik>
      <Toaster
        title="Request added successfully"
        bg="success"
        showToaster={showAddToaster}
        setShowToaster={setShowAddToaster}
        to="deviceRequest"
      ></Toaster>
      <Toaster
        title={error}
        bg="danger"
        showToaster={showErrorToaster}
        setShowToaster={setShowErrorToaster}
        to="deviceRequest"
      ></Toaster>
    </div>
  );
};

export default RequestDevice;
