import React from "react";
import { Link } from "react-router-dom";

const Logo = () => {
  const user = localStorage.getItem("token");

  return (
    <>
      <h1 className="text-3xl p-4 items-center text-violet-800">
        <Link to={user ? "/dashboard" : "/"}>
          <span className="font-bold text-white">dove</span>.me
        </Link>
      </h1>
    </>
  );
};

export default Logo;
