import React, { useState, useEffect } from "react";
import { axiosSecure } from "../../api/axios";
import laptopIcon from "../../assests/icons/laptop-svgrepo-com.svg";
import systemIcon from "../../assests/icons/cpu-svgrepo-com.svg";
import ticketIcon from "../../assests/icons/ticket2-svgrepo-com.svg";
import { getUserDetails } from "../../service";

const Dashboard = () => {
  const [dashboardStats, setDashboardStats] = useState({});
  const [ticketStats, setTicketStats] = useState({});
  const { role } = getUserDetails();

  useEffect(() => {
    fetchProductStats();
    fetchTicketStats();
  }, []);

  const fetchProductStats = async () => {
    try {
      const response = await axiosSecure.get("/product", {
        headers: {
          Authorization: `Bearer ${localStorage.userDetails && JSON.parse(localStorage.userDetails).token}`,
        },
      });
      if (response?.data?.products) {
        const { products } = response.data;

        const unAssignedSystemCount = products.filter(
          (product) => product.productCategory === "System" && product.tag === "notassigned"
        ).length;
        const assignedSystemCount = products.filter(
          (product) => product.productCategory === "System" && product.tag === "assigned"
        ).length;

        const unAssignedAccessoriesCount = products.filter(
          (product) => product.productCategory === "Accessories" && product.tag === "notassigned"
        ).length;

        const assignedAccessoriesCount = products.filter(
          (product) => product.productCategory === "Accessories" && product.tag === "assigned"
        ).length;

        setDashboardStats([
          {
            deviceCategory: "System",
            availableDevicesCount: unAssignedSystemCount,
            assignedDevicesCount: assignedSystemCount,
          },
          {
            deviceCategory: "Accessories",
            availableDevicesCount: unAssignedAccessoriesCount,
            assignedDevicesCount: assignedAccessoriesCount,
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching product stats:", error);
    }
  };

  const fetchTicketStats = async () => {
    try {
      const response = await axiosSecure.get("/ticket", {
        headers: {
          Authorization: `Bearer ${localStorage.userDetails && JSON.parse(localStorage.userDetails).token}`,
        },
      });
      if (response?.data?.tickets) {
        const { tickets } = response.data;

        const totalTickets = tickets.length;
        const assignedTickets = tickets.filter(ticket => ticket.tag === "assigned").length;
        const unassignedTickets = tickets.filter(ticket => ticket.tag === "notassigned").length;

        setTicketStats({
          totalTickets,
          assignedTickets,
          unassignedTickets,
        });
      }
    } catch (error) {
      console.error("Error fetching ticket stats:", error);
    }
  };

  return (
    <div className="stock-main-body container">
      <h2 className="py-3 border-bottom border-2 fw-bold">DASHBOARD</h2>
      {role !== "user" ? <div className="row">
        {dashboardStats.length > 0 &&
          dashboardStats.map((stock, index) => (
            <div className="col-xl-3 col-lg-3 col-md-6" key={index}>
              <div className="single-stock rounded-4 shadow p-4">
                <div className="p-3 border border-2 rounded-3 bg-body-secondary w-50 text-center">
                  {stock.deviceCategory === "System" ? <img src={laptopIcon} alt="system" width="80px" /> : <img src={systemIcon} alt="accessories" width="80px" />}
                </div>
                <div className="p-1 border-bottom">
                  <h3 className="py-3">{stock.deviceCategory}</h3>
                  <p>Available: {stock.availableDevicesCount}</p>
                  <p>Assigned: {stock.assignedDevicesCount}</p>
                </div>
                <div className="total-stock d-flex justify-content-between align-items-center">
                  <p className="text-uppercase">Total</p>
                  <h1 className="fw-normal">{stock.availableDevicesCount + stock.assignedDevicesCount}</h1>
                </div>
              </div>
            </div>
          ))}
        <div className="col-xl-3 col-lg-3 col-md-6">
          <div className="single-stock rounded-4 shadow p-4">
            <div className="p-3 border border-2 rounded-3 bg-body-secondary w-50 text-center">
              <img src={ticketIcon} alt="tickets" width="80px" />
            </div>
            <div className="p-1 border-bottom">
              <h3 className="py-3">Tickets</h3>
              <p>
                Unassigned: {ticketStats.unassignedTickets || 0}
              </p>
              <p>
                Assigned: {ticketStats.assignedTickets || 0}
              </p>
            </div>
            <div className="total-stock d-flex justify-content-between align-items-center">
                <p className="text-uppercase">Total</p>
                <h1 className="fw-normal">{ticketStats.totalTickets || 0}</h1>
            </div>
          </div>
        </div>
      </div> : 
      <div>
        Coming Soon...
      </div>}
    </div>
  );
};

export default Dashboard;