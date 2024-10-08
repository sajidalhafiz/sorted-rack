import { Button } from "bootstrap";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { Col, Container, FloatingLabel, Row } from "react-bootstrap";
import { Toaster } from "../../../component/Toaster/Toaster";
import { axiosSecure } from "../../../api/axios";



const CreateTicket = () => {
  const [showAddToaster, setShowAddToaster] = useState(false);
  const [showErrorToaster, setShowErrorToaster] = useState(false);
  const [error, setError] = useState("");

  const handleOnSubmit = (values) => 
    axiosSecure.post(
        "/ticket",
        {
            // branch: values.branch,
            // dueDate: values.,
            // ticketDept: values.,
            // priority: values.,
            // status: values.,
            // ticketTitle: values.,
            // message: values.,
            // tag: values.,
            // createdBy: values.,
            // assignedTo: values.,
        }
    ); 

 

  return (
    <div className="flex-grow-1">
      
      
    </div>
  );
};

export default CreateTicket;
