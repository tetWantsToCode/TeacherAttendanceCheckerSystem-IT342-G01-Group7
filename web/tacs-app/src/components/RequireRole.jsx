import React from "react";
import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../utils/auth-utils";

export default function RequireRole({ role, children }) {
  const user = getCurrentUser();
  if (!user) return <Navigate to="/login" />;
  if (user.role !== role) return <Navigate to="/unauthorized" />;
  return children;
}