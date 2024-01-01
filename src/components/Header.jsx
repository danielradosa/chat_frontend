import React from "react";
import { Link } from "react-router-dom";
import { LogoutButton, LanguageSwitcher, Logo } from "./HeaderComponents";

const Header = () => {
  const user = localStorage.getItem("token");

  return (
    <header className="bg-violet-500">
      <div className="flex items-center justify-between align-middle">
        <Logo />

        <nav className="hidden md:flex justify-center p-4 items-center gap-4">
          { user ?
            <Link to="/dashboard">
              <button className="bg-violet-800 text-white px-4 py-1 rounded-full">
                Chats
              </button>
            </Link>
            : null
          }
          <Link to="/about">
            <button className="bg-violet-800 text-white px-4 py-1 rounded-full">
              About
            </button>
          </Link>
        </nav>

        <div className="flex justify-center align-middle items-center p-4">
          {user ? <LogoutButton /> : <div className="mr-4 px-4 py-1 rounded-full transition-all"></div>}
          <LanguageSwitcher />
        </div>
      </div>

      <div className="flex">
        <div className="w-full bg-gradient-to-r from-violet-500 to-white"></div>
        <div className="border-b-4 border-white border-dashed w-full"></div>
      </div>
    </header>
  );
};

export default Header;
