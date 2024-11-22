import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";
import { Form, Button } from "react-bootstrap";
const AddUserPage = () => {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState(""); // State for Status
  const [roles, setRoles] = useState([]);
  const [image, setImage] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/auth/role-list"
        );
        if (response.data.success) {
          setRoles(response.data.data);
        } else {
          console.error("Failed to fetch roles");
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchRoles();
  }, []);

  const handleSave = async () => {
    if (
      name.trim() &&
      mobile.trim() &&
      email.trim() &&
      role.trim() &&
      status.trim()
    ) {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("mobile", mobile);
      formData.append("email", email);
      formData.append("role", role);
      formData.append("status", status);

      if (image) {
        formData.append("image", image);
      }

      try {
        const response = await axios.post(
          "http://localhost:8080/auth/add-userrole",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        if (response.data.success) {
          setSuccessMessage("User saved successfully!");
          setName("");
          setMobile("");
          setEmail("");
          setRole("");
          setStatus("");
          setImage(null);
          setTimeout(() => setSuccessMessage(""), 3000);
        } else {
          setErrorMessage("Failed to save user!");
        }
      } catch (error) {
        setErrorMessage("Error saving user!");
        console.error("Error:", error);
      }
    } else {
      setErrorMessage("All fields are required!");
    }
  };

  const handleCancel = () => {
    setName("");
    setMobile("");
    setEmail("");
    setRole("");
    setStatus("");
    setImage(null);
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.size <= 15 * 1024) {
      setImage(file);
    } else {
      setErrorMessage("Image size exceeds 15 KB!");
    }
  };

  return (
    <div className="add-user-container">
      <header className="add-user-header">
        <h2>Add User</h2>
      </header>
      <div className="form-container">
        <label htmlFor="name" className="form-label">
          Name
        </label>
        <input
          type="text"
          id="name"
          className="form-input small-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter name"
        />

        <label htmlFor="mobile" className="form-label">
          Mobile
        </label>
        <input
          type="text"
          id="mobile"
          className="form-input small-input"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          placeholder="Enter mobile number"
        />

        <label htmlFor="email" className="form-label">
          Email ID
        </label>
        <input
          type="email"
          id="email"
          className="form-input small-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email ID"
        />

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="role" className="form-label">
              Role
            </label>
            <select
              id="role"
              className="form-select small-dropdown"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="">Select Role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>

          {/* <div className="form-group">
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
          </div> */}
        </div>
        <Form.Group>
          <Form.Label>Images</Form.Label>
          <Form.Control
            type="file"
            multiple
            onChange={handleImageUpload}
            className="form-control-sm"
            style={{ width: "30%" }}
          />
        </Form.Group>

        {/* <label htmlFor="image-upload" className="form-label">
          Upload Image
        </label>
        <div className="upload-container">
          {image ? (
            <img
              src={URL.createObjectURL(image)}
              alt="User"
              className="uploaded-image"
            />
          ) : (
            <div className="image-placeholder">Upload Image</div>
          )}
          <input
            type="file"
            id="image-upload"
            className="form-file-input"
            onChange={handleImageUpload}
          />
          <small>Maximum allowed file size is 15 KB</small>
        </div> */}

        <div className="form-buttons">
          <button className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
          <button className="save-btn" onClick={handleSave}>
            Save
          </button>
        </div>

        {errorMessage && (
          <div className="alert alert-danger mt-3">{errorMessage}</div>
        )}
        {successMessage && (
          <div className="alert alert-success mt-3">{successMessage}</div>
        )}
      </div>
    </div>
  );
};

export default AddUserPage;
