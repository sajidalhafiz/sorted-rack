import React from "react";
import { Routes, Route } from "react-router-dom";
import StockProvider from "./contexts/StockContext";
import {
  Layout,
  LoginForm,
  PageNotFound,
  Dashboard,
  Allitems,
  Request,
  AddUser,
  ListUser,
  EditUser,
  ListStock,
  AddStock,
  EditSystemDetails,
  // ReportIssues
} from "./Pages";

import AssignItem from "./Pages/AssignItems";
import { getUserDetails } from "./service";
import RequestDevice from "./Pages/RequestDevice";
import MyRequest from "./Pages/MyRequests/indext";
import AllRequests from "./Pages/AllRequests";
import CreateTicket from "./Pages/Ticket/Create";
import TicketList from "./Pages/Ticket/List";
import Messsage from "./Pages/Ticket/Message";
import AssignedTickets from "./Pages/AssignedTickets";

function App() {
  const { role } = getUserDetails();

  return (
    <StockProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          {role === "superadmin" && (
            <>
              <Route index element={<Dashboard />} />
              <Route path="stock" element={<ListStock />} />
              <Route path="stock/add" element={<AddStock />} />
              <Route path="stock/edit/:id" element={<EditSystemDetails />} />
              <Route path="allitems" element={<Allitems />} />
              {/* <Route path="allRequests" element={<AllRequests />} /> */}
              <Route path="user/add" element={<AddUser />} />
              <Route path="user" element={<ListUser />} />
              <Route path="user/edit/:id" element={<EditUser />} />
              <Route path="assigned/" element={<AssignItem />} />
              <Route path="ticket" element={<TicketList />} />
              {/* <Route path="ticket/createTicket" element={<CreateTicket />} /> */}
              <Route path="ticket/addMessage/:id" element={<Messsage />} />
              <Route path="assignedTicket" element={<AssignedTickets />} />
            </>
          )}

          {role === "admin" && (
            <>
               <Route index element={<Dashboard />} />
               <Route path="user" element={<ListUser />} />
               <Route path="ticket" element={<TicketList />} />
               <Route path="assignedTicket" element={<AssignedTickets />} />
            </>
          )}
          {role === "user" && (
            <>
              {/* <Route path="deviceRequest" element={<RequestDevice />} /> */}
              {/* <Route path="myRequest" element={<MyRequest />} /> */}
              {/* <Route path="ticket" element={<TicketList />} /> */}
              <Route index element={<TicketList />} />
              <Route path="ticket/createTicket" element={<CreateTicket />} />
              <Route path="ticket/addMessage/:id" element={<Messsage />} />
            </>
          )}
        </Route>

        <Route path="login" element={<LoginForm />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </StockProvider>
  );
}

export default App;
