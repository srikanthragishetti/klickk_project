// frontend/src/components/Register.jsx
import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

// Registration component
export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  // Handle form submission
  const submit = async (e) => {// 
    e.preventDefault();
    setMsg("");
    try {
      await api.post("/auth/register", { email, password });
      setMsg("Registered successfully. Redirecting to login...");
      setTimeout(() => navigate("/login"), 300);
    } catch (err) {
      setMsg(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="card">
      <h3>Register</h3>
      <form onSubmit={submit}>
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button type="submit">Create Account</button>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  );
}
