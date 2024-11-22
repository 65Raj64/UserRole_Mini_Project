import React from "react";
import { Link } from "react-router-dom";
import "../../src/sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="logo">
        <h2>Digitalflake</h2>
      </div>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/roles">Roles</Link>
          </li>
          <li>
            <Link to="/userlist">Users</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
