import React from "react";
import { Link } from "react-router-dom";
import { LogoutButton, LanguageSwitcher, Logo } from "./HeaderComponents";
import { useTranslation } from "react-i18next";

const Header = () => {
  const user = localStorage.getItem("token");
  const { t } = useTranslation();

  return (
    <header className="border-b-4 bg-white shadow-lg">
      <div className="flex items-center justify-between p-4 align-middle md:px-4 md:py-2">
        <Logo />

        <nav className="hidden items-center justify-center gap-4 p-4 md:flex">
          {user ? (
            <Link to="/dashboard">
              <button
                className="rounded-full bg-blue-300 px-4 py-1 text-white
       transition-all hover:bg-blue-400 hover:text-white"
              >
                {t("LinkChats")}
              </button>
            </Link>
          ) : (
            <Link to="/">
              <button
                className="cursor-not-allowed rounded-full bg-blue-300/50 px-4 py-1
       text-white transition-all hover:bg-blue-400/50 hover:text-white"
              >
                {t("LinkChats")}
              </button>
            </Link>
          )}
          <Link to="/about">
            <button
              className="rounded-full bg-blue-300 px-4 py-1 text-white
       transition-all hover:bg-blue-400 hover:text-white"
            >
              {t("LinkAbout")}
            </button>
          </Link>
        </nav>

        <div className="flex items-center justify-between gap-4">
          {user ? <LogoutButton /> : <div className="w-20"></div>}
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
};

export default Header;
