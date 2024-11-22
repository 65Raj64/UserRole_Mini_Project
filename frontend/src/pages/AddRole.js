import React, { useState } from "react";
import "../App.css";
import axios from "axios";

const AddRolePage = () => {
  const [roleName, setRoleName] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSave = async () => {
    if (roleName.trim()) {
      try {
        await axios.post(
          "http://localhost:8080/auth/add-role",
          { name: roleName },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        setSuccessMessage(`Role "${roleName}" saved successfully!`);
        setRoleName("");
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (error) {
        console.error("Error saving role:", error);
        setErrorMessage("Failed to save the role. Please try again.");
        setTimeout(() => setErrorMessage(""), 3000);
      }
    } else {
      alert("Role Name is required!");
    }
  };

  const handleCancel = () => {
    setRoleName("");
  };

  return (
    <div className="add-role-container">
      <header className="add-role-header">
        <h2>Add Role</h2>
      </header>
      <div className="form-container">
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
        <div className="form-buttons">
          <button className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
          <button className="save-btn" onClick={handleSave}>
            Save
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

export default AddRolePage;
