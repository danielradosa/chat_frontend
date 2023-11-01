import React from "react";
import { Link } from "react-router-dom";

const Logo = () => {
  const user = localStorage.getItem("token");

  return (
    <>
      <h1 className="text-3xl p-4 items-center">
        <Link to={user ? "/dashboard" : "/"}>
          <span className="font-bold text-[#8251ED]">dove</span>.me
        </Link>
      </h1>
    </>
  );
};

export default Logo;
