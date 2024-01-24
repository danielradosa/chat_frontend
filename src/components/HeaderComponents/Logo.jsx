import React from "react";
import { Link } from "react-router-dom";

const Logo = () => {
  const user = localStorage.getItem("token");

  return (
    <>
      <h1 className="text-3xl items-center text-black">
        <Link to={user ? "/dashboard" : "/"}>
          <span className="font-bold text-blue-300">dove</span>.me
        </Link>
      </h1>
    </>
  );
};

export default Logo;
