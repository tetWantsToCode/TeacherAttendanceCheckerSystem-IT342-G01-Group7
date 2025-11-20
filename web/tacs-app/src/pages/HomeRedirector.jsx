import React from "react";
import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../utils/auth-utils";

export default function HomeRedirector() {
  const user = getCurrentUser();
  if (user?.role === "ADMIN") return <Navigate to="/admin" replace />;
  if (user?.role === "TEACHER") return <Navigate to="/teacher" replace />;
  if (user?.role === "STUDENT") return <Navigate to="/student" replace />;
  return <Navigate to="/login" replace />;
}