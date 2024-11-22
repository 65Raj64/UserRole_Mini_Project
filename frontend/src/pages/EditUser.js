import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "../App.css";

const UpdateUserPage = () => {
  const location = useLocation();
  const userId = location.state;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    role: "",
    image: null,
  });

  const [roles, setRoles] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rolesResponse = await axios.get(
          "http://localhost:8080/auth/role-list"
        );
        if (rolesResponse.data.success) {
          setRoles(rolesResponse.data.data);
        }

        const userResponse = await axios.get(
          `http://localhost:8080/auth/user-details/${userId}`
        );
        if (userResponse.data.success) {
          const { name, mobile, email, role, image } = userResponse.data.data;
          setFormData({ name, mobile, email, role, image });
        } else {
          setErrorMessage("Failed to fetch user details.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setErrorMessage("Error fetching data.");
      }
    };

    fetchData();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 15 * 1024) {
      setFormData((prevData) => ({
        ...prevData,
        image: file,
      }));
    } else {
      setErrorMessage("Image size exceeds 15 KB!");
    }
  };

  const handleUpdate = async () => {
    if (formData.name && formData.mobile && formData.email && formData.role) {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("mobile", formData.mobile);
      data.append("email", formData.email);
      data.append("role", formData.role);

      if (formData.image instanceof File) {
        data.append("image", formData.image);
      }

      try {
        const response = await axios.put(
          `http://localhost:8080/auth/user-update/${userId}`,
          data,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        if (response.data.success) {
          setSuccessMessage("User updated successfully!");
          setTimeout(() => navigate("/users"), 3000);
        } else {
          setErrorMessage("Failed to update user.");
        }
      } catch (error) {
        console.error("Error updating user:", error);
        setErrorMessage("Error updating user.");
      }
    } else {
      setErrorMessage("All fields are required!");
    }
  };

  return (
    <div className="update-user-container">
      <header className="update-user-header">
        <h2>Update User</h2>
      </header>
      <div className="form-container">
        <label htmlFor="name" className="form-label">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          className="form-input"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Enter name"
        />

        <label htmlFor="mobile" className="form-label">
          Mobile
        </label>
        <input
          type="text"
          id="mobile"
          name="mobile"
          className="form-input"
          value={formData.mobile}
          onChange={handleInputChange}
          placeholder="Enter mobile number"
        />

        <label htmlFor="email" className="form-label">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className="form-input"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Enter email"
        />
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="role" className="form-label">
              Role
            </label>
            <select
              id="role"
              className="form-select small-dropdown"
              //   value={role}
              //   onChange={(e) => setRole(e.target.value)}
            >
              <option value="">Select Role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="status" className="form-label">
              Status
            </label>
            <select
              id="status"
              className="form-select small-dropdown"
              //   value={status}
              //   onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">Select Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
        {/* <label htmlFor="role" className="form-label">
          Role
        </label>
        <select
          id="role"
          name="role"
          className="form-select"
          value={formData.role}
          onChange={handleInputChange}
        >
          <option value="">Select Role</option>
          {roles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.label}
            </option>
          ))}
        </select> */}

        {/* <label htmlFor="image-upload" className="form-label">
          Upload Image
        </label>
        <div className="upload-container">
          {formData.image && !(formData.image instanceof File) ? (
            <img src={formData.image} alt="User" className="uploaded-image" />
          ) : null}
          <input
            type="file"
            id="image-upload"
            className="form-file-input"
            onChange={handleImageUpload}
          />
          <small>Maximum allowed file size is 15 KB</small>
        </div> */}
        <label htmlFor="image-upload" className="form-label">
          Upload Image
        </label>
        <div className="upload-container">
          {formData.image && !(formData.image instanceof File) ? (
            <img src={formData.image} alt="User" className="uploaded-image" />
          ) : null}
          <input
            type="file"
            id="image-upload"
            className="form-file-input"
            onChange={handleImageUpload}
          />
          <small>Maximum allowed file size is 15 KB</small>
        </div>
        <div className="form-buttons">
          <button className="cancel-btn" onClick={() => navigate("/users")}>
            Cancel
          </button>
          <button className="save-btn" onClick={handleUpdate}>
            Update
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

export default UpdateUserPage;
