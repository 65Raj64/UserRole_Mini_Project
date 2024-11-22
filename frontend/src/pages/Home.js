import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleError, handleSuccess } from "../utils";
const HomePage = () => {
  // const navigate = useNavigate();

  // const handleLogout = () => {
  //   localStorage.removeItem("authToken");

  //   navigate("/login");
  // };
  const [loggedInUser, setLoggedInUser] = useState("");
  const [products, setProducts] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    setLoggedInUser(localStorage.getItem("loggedInUser"));
  }, []);

  const handleLogout = (e) => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    handleSuccess("User Loggedout");
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  return (
    <div className="page-content">
      <h1>Welcome to Digitalflake Admin</h1>
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default HomePage;
