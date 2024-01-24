import React from "react";
import { Link } from "react-router-dom";
import { LogoutButton, LanguageSwitcher, Logo } from "./HeaderComponents";
import { useTranslation } from "react-i18next";

const Header = () => {
  const user = localStorage.getItem("token");
  const { t } = useTranslation();

  return (
    <header className="bg-white border-b-4">
      <div className="p-4 hidden md:flex items-center justify-between w-full">
        <Logo />

        <nav className="hidden md:flex gap-4">
          {user ? (
            <Link to="/dashboard">
              <button
                className="text-white bg-blue-300 px-4 py-1 rounded-full
       transition-all hover:bg-blue-400 hover:text-white"
              >
                {t("LinkChats")}
              </button>
            </Link>
          ) : (
            <Link to="/">
              <button
                className="text-white bg-blue-300/50 px-4 py-1 rounded-full
       transition-all hover:bg-blue-400/50 hover:text-white cursor-not-allowed"
              >
                {t("LinkChats")}
              </button>
            </Link>
          )}
          <Link to="/about">
            <button
              className="text-white bg-blue-300 px-4 py-1 rounded-full
       transition-all hover:bg-blue-400 hover:text-white"
            >
              {t("LinkAbout")}
            </button>
          </Link>
        </nav>

        <div className="flex justify-between items-center gap-4">
          {user ? (
            <LogoutButton />
          ) : (
            <div className="w-20"></div>
          )}
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
};

export default Header;
