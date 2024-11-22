// import { Navigate, Route, Routes } from "react-router-dom";
// import "./App.css";
// import Login from "./pages/Login";
// import Signup from "./pages/Signup";
// import Home from "./pages/Home";
// import { useState } from "react";
// import RefrshHandler from "./RefrshHandler";
// import Roles from "./pages/Roles";
// import AddRole from "./pages/AddRole";
// import ListUser from "./pages/ListUser";
// import AddUser from "./pages/AddUser";
// import Sidebar from "./pages/sidebar";
// import EditRole from "./pages/EditRole";
// import EditUser from "./pages/EditUser";
// function App() {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   const PrivateRoute = ({ element }) => {
//     return isAuthenticated ? element : <Navigate to="/login" />;
//   };

//   return (
//     <div className="app-container">
//       <Sidebar />
//       <RefrshHandler setIsAuthenticated={setIsAuthenticated} />
//       <div className="main-content">
//         <Routes>
//           <Route path="/" element={<Navigate to="/login" />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<Signup />} />
//           <Route path="/roles" element={<Roles />} />
//           <Route path="/home" element={<PrivateRoute element={<Home />} />} />
//           <Route path="/addrole" element={<AddRole />} />
//           <Route path="/userlist" element={<ListUser />} />
//           <Route path="/adduser" element={<AddUser />} />
//           <Route path="/edit-role" element={<EditRole />} />
//           <Route path="/edit-user" element={<EditUser />} />
//         </Routes>
//       </div>
//     </div>
//   );
// }

// export default App;
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import { useState } from "react";
import RefrshHandler from "./RefrshHandler";
import Roles from "./pages/Roles";
import AddRole from "./pages/AddRole";
import ListUser from "./pages/ListUser";
import AddUser from "./pages/AddUser";
import Sidebar from "./pages/sidebar";
import EditRole from "./pages/EditRole";
import EditUser from "./pages/EditUser";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation(); // Get the current route

  // Define routes where the sidebar should be hidden
  const hideSidebarRoutes = ["/login", "/signup"];

  // Check if the current route matches any in `hideSidebarRoutes`
  const shouldHideSidebar = hideSidebarRoutes.includes(location.pathname);

  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" />;
  };

  return (
    <div className="app-container">
      {/* Conditionally render the sidebar */}
      {!shouldHideSidebar && <Sidebar />}
      <RefrshHandler setIsAuthenticated={setIsAuthenticated} />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/roles" element={<Roles />} />
          <Route path="/home" element={<PrivateRoute element={<Home />} />} />
          <Route path="/addrole" element={<AddRole />} />
          <Route path="/userlist" element={<ListUser />} />
          <Route path="/adduser" element={<AddUser />} />
          <Route path="/edit-role" element={<EditRole />} />
          <Route path="/edit-user" element={<EditUser />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
