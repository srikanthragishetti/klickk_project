
import React, { useEffect, useState } from "react";
import api from "../api";

// Dashboard component
export default function Dashboard({ user }) {
  const [protectedMsg, setProtectedMsg] = useState("");

  useEffect(() => {
    api.get("/auth/protected")
      .then(res => setProtectedMsg(res.data.message))
      .catch(() => setProtectedMsg("Could not load protected content"));
  }, []);

  return (
    <div className="card">
      <h3>Dashboard</h3>
      <p>Logged in as: <b>{user?.email}</b></p>
      <p>{protectedMsg}</p>
    </div>
  );
}
