import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../App.css";
import axios from "axios";
import { Button } from "react-bootstrap";
import Swal from "sweetalert2";
const RolesPage = () => {
  const [roles, setRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await axios.get("http://localhost:8080/auth/list-role");
      setRoles(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

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
        confirmButton: "your-confirm-button-class", // Add custom CSS for buttons if needed
        cancelButton: "your-cancel-button-class",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(
            `http://localhost:8080/auth/role-delete/${roleId}`
          );

          if (response?.data?.success) {
            Swal.fire(
              "Deleted!",
              "Role has been deleted successfully.",
              "success"
            );

            setSuccessMessage("Role deleted successfully.");

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

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="roles-container">
      <header className="roles-header">
        <h2>Roles</h2>
        <div className="search-and-add">
          <input
            type="text"
            placeholder="Search..."
            className="search-bar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Link to="/addrole" className="add-new-btn">
            Add New
          </Link>
        </div>
      </header>
      <table className="roles-table">
        <thead>
          <tr>
            <th>Sr. No.</th>
            <th>Role Name</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredRoles.length > 0 ? (
            filteredRoles.map((role, index) => (
              <tr key={role._id || index}>
                <td>{index + 1}</td>
                <td>{role.name}</td>
                <td
                  className={
                    role.isActive ? "status-active" : "status-inactive"
                  }
                >
                  {role.isActive ? "Active" : "Inactive"}
                </td>

                <td className="actions">
                  <Link to={"/edit-role"} state={role._id}>
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
