import React, { useState, useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import axios from "axios";
import { VALIDATE_TOKEN } from "./routes";

const IsAuthenticated = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Set loading to true initially
  const token = localStorage.getItem("token");

  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await axios.post(VALIDATE_TOKEN, {
          token: token
        });
        setIsAuthenticated(response.data.valid);
      } catch (error) {
        console.error("Token validation error:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false); // Set loading to false after token validation completes
      }
    };

    if (token) {
      validateToken();
    } else {
      setIsAuthenticated(false);
      setLoading(false); // Set loading to false if no token is present
    }
  }, [token]);

  return loading ? null : isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default IsAuthenticated;