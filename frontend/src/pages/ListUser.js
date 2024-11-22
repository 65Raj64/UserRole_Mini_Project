import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "react-bootstrap";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Swal from "sweetalert2";
const token = localStorage.getItem("authToken");

const RolesPage = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [listData, setListData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    getUserRoles();
  }, []);
  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getUserRoles = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/auth/list-userrole",
        { headers }
      );
      console.log("Fetched data:", response?.data?.data);
      setListData(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching user roles:", error);
    }
  };
  // const filteredRoles = roles.filter((role) =>
  //   role.name.toLowerCase().includes(searchTerm.toLowerCase())
  // );
  const handleDelete = async (roleId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this action!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      buttonsStyling: false,
      customClass: {
        confirmButton: "your-confirm-button-class",
        cancelButton: "your-cancel-button-class",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(
            `http://localhost:8080/auth/user-delete/${roleId}`
          );

          if (response?.data?.success) {
            Swal.fire(
              "Deleted!",
              "UserRole has been deleted successfully.",
              "success"
            );

            setSuccessMessage("UserRole deleted successfully.");

            setRoles((prevRoles) =>
              prevRoles.filter((role) => role._id !== roleId)
            );
          } else {
            Swal.fire("Failed!", "Failed to delete the role.", "error");
            setError("Failed to delete the role.");
          }
        } catch (error) {
          console.error("Error deleting role:", error);
          Swal.fire(
            "Error!",
            "An error occurred while deleting the role.",
            "error"
          );
          setError("Error occurred while deleting the role. Please try again.");
        } finally {
          setTimeout(() => {
            setError(null);
            setSuccessMessage(null);
          }, 3000);
        }
      }
    });
  };
  return (
    <div className="roles-container">
      <header className="roles-header">
        <h2>UserRole</h2>
        <div className="search-and-add">
          <input
            type="text"
            placeholder="Search..."
            className="search-bar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Link to="/adduser" className="add-new-btn">
            Add UserRole
          </Link>
        </div>
      </header>
      <table className="roles-table">
        <thead>
          <tr>
            <th>Sr. No.</th>
            <th>Name</th>
            <th>Mobile</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {listData.length > 0 ? (
            listData.map((role, index) => (
              <tr key={role._id || index}>
                <td>{index + 1}</td>
                <td>{role.name}</td>
                <td>{role.mobile}</td>
                <td>{role.email}</td>
                <td>{role.role}</td>
                <td
                  className={
                    role.isActive ? "status-active" : "status-inactive"
                  }
                >
                  {role.isActive ? "Active" : "Inactive"}
                </td>
                <td className="actions">
                  <Link to={"/edit-user"} state={role._id}>
                    <Button variant="primary" className="edit-btn">
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="danger"
                    className="delete-btn"
                    onClick={() => handleDelete(role._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} align="center">
                No roles available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RolesPage;
