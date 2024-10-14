import React from "react";
import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { SidebarContext } from "../../../contexts/SidebarContext";
import logo from "../../../assests/images/sorted-rack-logo.svg";

import "./Sidebar.scss";
import { getUserDetails, logout } from "../../../service";
import { useNavigate } from "react-router-dom";
import dashboardIcon from "../../../assests/icons/widget-5-svgrepo-com.svg";
import usersIcon from "../../../assests/icons/users-group-two-rounded-svgrepo-com.svg";
import usersIdIcon from "../../../assests/icons/user-id-svgrepo-com.svg";
import stokIcon from "../../../assests/icons/layers-svgrepo-com.svg";
import ticketIcon from "../../../assests/icons/ticket-svgrepo-com.svg";
import monitorIcon from "../../../assests/icons/monitor-svgrepo-com.svg";
import logoutIcon from "../../../assests/icons/logout-2-svgrepo-com.svg";
import userIcon from "../../../assests/icons/user-rounded-svgrepo-com.svg";
import settingsIcon from "../../../assests/icons/settings-svgrepo-com.svg";
import { Dropdown, Image } from "react-bootstrap";

const Sidebar = () => {
  const { activeMenu, setActiveMenu } = useContext(SidebarContext);
  const { role, email } = getUserDetails();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login", { replace: true });
    logout();
  };

  const superadmin_navLinks = (
    <>
      <li className="nav-item">
        <NavLink
          end={true}
          to="/"
          className={({ isActive }) =>
            `nav-link text-white ${isActive ? "active" : undefined}`
          }
        >
          <div className="d-flex align-items-center">
            <img alt="Sorted Rack" src={dashboardIcon} width="28px" />
            <span className="ps-2">Dashboard</span>
          </div>
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/user"
          className={({ isActive }) =>
            `nav-link text-white ${isActive ? "active" : undefined}`
          }
        >
          <div className="d-flex align-items-center">
            <img alt="Sorted Rack" src={usersIcon} width="28px" />
            <span className="ps-2">User</span>
          </div>
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/stock"
          className={({ isActive }) =>
            `nav-link text-white ${isActive ? "active" : undefined}`
          }
        >
          <div className="d-flex align-items-center">
            <img alt="Sorted Rack" src={stokIcon} width="28px" />
            <span className="ps-2">Stock</span>
          </div>
        </NavLink>
      </li>

      <li>
        <NavLink
          to="/ticket"
          className={({ isActive }) =>
            `nav-link text-white ${isActive ? "active" : undefined}`
          }
        >
          <div className="d-flex align-items-center">
            <img alt="Sorted Rack" src={ticketIcon} width="28px" />
            <span className="ps-2">Ticket List</span>
          </div>
        </NavLink>
      </li>

      <li>
        <NavLink
          to="/assigned"
          className={({ isActive }) =>
            `nav-link text-white ${isActive ? "active" : undefined}`
          }
        >
          <div className="d-flex align-items-center">
            <img alt="Sorted Rack" src={monitorIcon} width="28px" />
            <span className="ps-2">Assigned Devices</span>
          </div>
        </NavLink>
      </li>

      <li>
        <NavLink
          to="/assignedTicket"
          className={({ isActive }) =>
            `nav-link text-white ${isActive ? "active" : undefined}`
          }
        >
          <div className="d-flex align-items-center">
            <img alt="Sorted Rack" src={usersIdIcon} width="28px" />
            <span className="ps-2">Assigned Tickets</span>
          </div>
        </NavLink>
      </li>
    </>
  );

  const admin_navLinks = (
    <>
      <li className="nav-item">
        <NavLink
          end={true}
          to="/"
          className={({ isActive }) =>
            `nav-link text-white ${isActive ? "active" : undefined}`
          }
        >
          <div className="d-flex align-items-center">
            <img alt="Sorted Rack" src={dashboardIcon} width="28px" />
            <span className="ps-2">Dashboard</span>
          </div>
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/user"
          className={({ isActive }) =>
            `nav-link text-white ${isActive ? "active" : undefined}`
          }
        >
          <div className="d-flex align-items-center">
            <img alt="Sorted Rack" src={usersIcon} width="28px" />
            <span className="ps-2">Admin</span>
          </div>
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/assignedTicket"
          className={({ isActive }) =>
            `nav-link text-white ${isActive ? "active" : undefined}`
          }
        >
          <div className="d-flex align-items-center">
            <img alt="Sorted Rack" src={ticketIcon} width="28px" />
            <span className="ps-2">Assigned Tickets</span>
          </div>
        </NavLink>
      </li>
    </>
  );

  const user_navLinks = (
    <>
      <li>
        <NavLink
          to="/ticket"
          className={({ isActive }) =>
            `nav-link text-white ${isActive ? "active" : undefined}`
          }
        >
          <div className="d-flex align-items-center">
            <img alt="Sorted Rack" src={ticketIcon} width="28px" />
            <span className="ps-2">Ticket List</span>
          </div>
        </NavLink>
      </li>

    </>
  );

  return (
    <div
      className={
        activeMenu ? "sidebar d-flex bg-dark hide" : "sidebar d-flex bg-dark"
      }
    >
      <div className="d-flex flex-column flex-shrink-0 px-3 text-white w-100">
        <a
          href="/"
          className="d-flex align-items-center pt-3 mb-3 mb-md-0 me-md-auto text-white text-decoration-none"
        >
          <img alt="Sorted Rack" src={logo} width="140px" />
        </a>

        <hr />

        <nav className="h-100vh">
          <ul className="nav nav-pills flex-column gap-2 mb-auto">
            {role === "superadmin"
              ? superadmin_navLinks
              : role === "admin"
                ? admin_navLinks
                : user_navLinks}
          </ul>
        </nav>

        <hr />
        {/* <div className="dropdown">
          <p
            className="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
            id="dropdownUser1"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <img
              src="https://github.com/mdo.png"
              alt=""
              width="32"
              height="32"
              className="rounded-circle me-2"
            />
            <strong>{email}</strong>
          </p>
          <ul
            className="dropdown-menu dropdown-menu-dark text-small shadow"
            aria-labelledby="dropdownUser1"
          >
            
            <li className="d-flex align-items-center dropdown-item">
              <img alt="Sorted Rack" src={settingsIcon} width="24px" />
              <NavLink to="/settings" className="ps-2 text-decoration-none text-white text-opacity-75">Settings</NavLink>
            </li>
            <li className="d-flex align-items-center dropdown-item">
              <img alt="Sorted Rack" src={userIcon} width="24px" />
              <NavLink to="/profile" className="ps-2 text-decoration-none text-white text-opacity-75">Profile</NavLink>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li className="d-flex align-items-center dropdown-item">
              <img alt="Sorted Rack" src={logoutIcon} width="24px" />
              <span
                onClick={handleLogout}
                className="ps-2"
              >
                Logout
              </span>
            </li>
          </ul>
        </div> */}
        <Dropdown>
          <Dropdown.Toggle variant="dark" id="dropdown-basic" className="d-flex align-items-center w-100 bg-transparent border-0">
            <Image
              src="https://github.com/mdo.png"
              alt=""
              width="32"
              height="32"
              roundedCircle
              className="me-2"
            />
            <strong>{email}</strong>
          </Dropdown.Toggle>

          <Dropdown.Menu variant="dark">
            <Dropdown.Item as={NavLink} to="/settings" className="d-flex align-items-center">
              <img alt="Sorted Rack" src={settingsIcon} width="24px" />
              <span className="ps-2">Settings</span>
            </Dropdown.Item>
            <Dropdown.Item as={NavLink} to="/profile" className="d-flex align-items-center">
              <img alt="Sorted Rack" src={userIcon} width="24px" />
              <span className="ps-2">Profile</span>
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleLogout} className="d-flex align-items-center">
              <img alt="Sorted Rack" src={logoutIcon} width="24px" />
              <span className="ps-2">Logout</span>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
};

export default Sidebar;
