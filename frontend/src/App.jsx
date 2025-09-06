import React, { useEffect, useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import api from "./api";
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

// Navigation bar
function Nav({ user, onLogout }) {
  const navigate = useNavigate();
  const logoutNow = async () => {
    await onLogout();
    navigate("/login");
  };

  return (
    <div className="card">
      <nav>
        <Link to="/">Home</Link>{" "}
        {!user && <Link to="/login">Login</Link>}{" "}
        {!user && <Link to="/register">Register</Link>}{" "}
        {user && <Link to="/dashboard">Dashboard</Link>}{" "}
        {user && <button onClick={logoutNow}>Logout</button>}
      </nav>
    </div>
  );
}

// Main App
export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    api.get("/auth/me").then((res) => {
      if (res.data.loggedIn) setUser(res.data.user);
    });
  }, []);

  // Logout handler
  const logout = async () => {
    try {
      await api.post("/auth/logout");
      setUser(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <Nav user={user} onLogout={logout} />
      <Routes>
        <Route path="/" element={<h2>Welcome {user ? user.email : "to  Klickks User Login"}</h2>} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={
          <ProtectedRoute user={user}>
            <Dashboard user={user} />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  );
}
