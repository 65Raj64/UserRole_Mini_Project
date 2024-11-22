import React, { useState, useEffect } from "react";
import "../App.css";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const UpdateRolePage = () => {
  const navigate = useNavigate();
  const [roleName, setRoleName] = useState("");
  const [status, setStatus] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const location = useLocation();
  const editId = location.state;

  useEffect(() => {
    const fetchRoleDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/auth/role-details/${editId}`
        );
        if (response.data.success) {
          setRoleName(response.data.data.name);
          setStatus(response.data.data.status);
        } else {
          console.error("Failed to fetch role details:", response.data.message);
          setErrorMessage("Failed to fetch role details.");
        }
      } catch (error) {
        console.error("Error fetching role details:", error);
        setErrorMessage("Error fetching role details.");
      }
    };

    fetchRoleDetails();
  }, [editId]);

  const handleUpdate = async () => {
    if (roleName.trim() && status) {
      try {
        await axios.put(
          `http://localhost:8080/auth/role-update/${editId}`,
          { name: roleName, status },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        setSuccessMessage(`Role "${roleName}" updated successfully!`);
        setTimeout(() => navigate("/roles"), 3000);
      } catch (error) {
        console.error("Error updating role:", error);
        setErrorMessage("Failed to update the role. Please try again.");
      }
    } else {
      alert("Role Name and Status are required!");
    }
  };

  const handleCancel = () => {
    navigate("/roles");
  };

  return (
    <div className="update-role-container">
      <header className="update-role-header">
        <h2>Update Role</h2>
      </header>
      <div className="form-container">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="roleName" className="form-label">
              Role Name
            </label>
            <input
              type="text"
              id="roleName"
              className="form-select small-dropdown"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              placeholder="Enter role name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="status" className="form-label">
              Status
            </label>
            <select
              id="status"
              className="form-select small-dropdown"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">Select Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="form-buttons">
          <button className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
          <button className="save-btn" onClick={handleUpdate}>
            Update
          </button>
        </div>

        {successMessage && (
          <div className="alert alert-success mt-3">{successMessage}</div>
        )}
        {errorMessage && (
          <div className="alert alert-danger mt-3">{errorMessage}</div>
        )}
      </div>
    </div>
  );
};

export default UpdateRolePage;
