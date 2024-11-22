import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import { handleError, handleSuccess } from "../utils";

const Login = () => {
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = loginInfo;
    if (!email || !password) {
      return handleError("Email and password are required");
    }

    try {
      const url = `http://localhost:8080/auth/login`;
      const response = await axios.post(url, loginInfo, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const { success, message, jwtToken, name, error } = response.data;

      if (success) {
        handleSuccess(message);
        localStorage.setItem("token", jwtToken);
        localStorage.setItem("loggedInUser", name);
        setTimeout(() => {
          navigate("/home");
        }, 1000);
      } else if (error) {
        const details = error?.details[0]?.message || "An error occurred";
        handleError(details);
      } else {
        handleError(message);
      }
    } catch (err) {
      handleError(err.response?.data?.message || "Internal server error");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="logo-section">
          <h1>digitalflake</h1>
          <p>Welcome to Digitalflake Admin</p>
        </div>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email ID</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={loginInfo.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={loginInfo.password}
                onChange={handleChange}
                required
              />
              <span className="toggle-password">&#128065;</span>
            </div>
          </div>
          <div className="forgot-password">
            <Link to="/reset-password">Forgot Password?</Link>
          </div>
          <button type="submit" className="login-button">
            Log In
          </button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Login;
