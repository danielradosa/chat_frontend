import React, { useState, useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import axios from "axios";
import { VALIDATE_TOKEN } from "./routes";

const IsAuthenticated = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await axios.post(VALIDATE_TOKEN, {
          token: token
        });
        setLoading(false);
        setIsAuthenticated(response.data.valid);
      } catch (error) {
        console.error("Token validation error:", error);
        setIsAuthenticated(false);
        setLoading(false);
      }
    };

    if (token) {
      validateToken();
    } else {
      setIsAuthenticated(false);
      setLoading(false);
    }
  }, [token]);

  if (loading) {
    return null;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default IsAuthenticated;
