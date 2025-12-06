import React from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem("isAdminLoggedIn");

  if (!isAdmin) {
    return <h1>You are not an Admin</h1>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Dashboard</h1>

      <button onClick={() => navigate("/admin/add-book")}>Add Books</button>
      <button onClick={() => navigate("/admin/remove-book")}>Remove Books</button>
      <button onClick={() => navigate("/admin/manage-students")}>Manage Students</button>
      <button onClick={() => navigate("/admin/manage-loans")}>Manage Loans</button>

      <br /><br />

      <button
        onClick={() => {
          localStorage.removeItem("isAdminLoggedIn");
          navigate("/admin/login");
        }}
      >
        Admin Logout
      </button>
    </div>
  );
}

export default AdminDashboard;
