import React from "react";
import { Link } from "react-router-dom";
import { LogoutButton, LanguageSwitcher, Logo } from "./HeaderComponents";
import { useTranslation } from "react-i18next";

const Header = () => {
  const user = localStorage.getItem("token");
  const { t } = useTranslation();

  return (
    <header className="bg-gray-300 z-10 shadow-lg w-full border-b-2">
      <div className="flex items-center justify-between p-4 align-middle md:px-8 md:py-2">
        <Logo />

        <nav className={`hidden items-center w-full justify-center ${user ? 'ml-[72px]' : 'mr-16'} gap-8 p-4 mx-auto text-center md:flex`}>
          {user ? (
            <Link to="/dashboard" className="font-bold">
              <button>{t("LinkChats")}</button>
            </Link>
          ) : (
            <Link to="/" className="font-bold">
              <button className="cursor-not-allowed text-white/40">
                {t("LinkChats")}
              </button>
            </Link>
          )}
          <Link to="/about" className="font-bold">
            <button>{t("LinkAbout")}</button>
          </Link>
        </nav>

        <div className="flex items-center gap-8">
          {user ? <LogoutButton /> : null}
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
};

export default Header;
