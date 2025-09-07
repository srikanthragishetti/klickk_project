
import React from "react";
import { Navigate } from "react-router-dom";

// ProtectedRoute component to guard routes
export default function ProtectedRoute({ user, children }) {
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
