import React from "react";
import logo from "../assets/logo.png";

const Footer = () => {
  return (
    <footer className="text-center text-white/0 md:text-white md:flex mx-auto font-bold">
      <img src={logo} alt="logo" className="w-48 md:w-64 absolute left-2 bottom-2 md:left-10 md:bottom-10 
      z-[-1] grayscale" />
      <p className="text-black/0 md:text-white md:text-sm p-2 lg:p-4 text-center">
        US &copy; 2069{" "}
        <a href="https://www.dove.me">dove.me - simple chat app.</a>
      </p>
    </footer>
  );
};

export default Footer;
