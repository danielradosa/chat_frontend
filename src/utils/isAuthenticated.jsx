import React from "react";
import { Outlet, Navigate } from "react-router-dom";

const useAuth = () => {
    const user = localStorage.getItem("token");
  
    if (user) {
      return true;
    } else {
      return false;
    }
};

const IsAuthenticated = () => {
    const auth = useAuth();
  
    return auth ? <Outlet /> : <Navigate to="/" />;
};

export default IsAuthenticated;
