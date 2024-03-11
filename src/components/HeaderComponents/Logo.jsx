import React from "react";
import { Link } from "react-router-dom";

const Logo = () => {
  const user = localStorage.getItem("token");

  return (
    <div>
      <h1 className="hidden md:block md:text-3xl items-center">
        <Link to={user ? "/dashboard" : "/"}>
          <span className="font-bold">dove</span>.me
        </Link>
      </h1>
    </div>
  );
};

export default Logo;
