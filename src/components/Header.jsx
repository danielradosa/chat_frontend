import React from "react";
import { Link } from "react-router-dom";
import { LogoutButton, LanguageSwitcher, Logo } from "./HeaderComponents";
import { useTranslation } from "react-i18next";

const Header = () => {
  const user = localStorage.getItem("token");
  const { t } = useTranslation();

  const profileId = localStorage.getItem("userId");

  return (
    <header className="bg-gray-300 z-10 shadow-lg w-full">
      <div className="flex items-center justify-between px-8 py-4 align-middle md:px-8 md:py-2">
        <Logo />

        <nav
          className={`items-center w-full md:justify-center ${
            user ? "md:ml-[60px]" : "md:mr-16"
          } md:gap-8 gap-5 md:p-4 mx-auto text-center md:flex flex`}
        >
          {user ? (
            <>
              <Link to="/dashboard" className="font-bold">
                <button>{t("LinkChats")}</button>
              </Link>
              <Link to={`/profile/${profileId}`} className="font-bold">
                <button>{t("LinkProfile")}</button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/" className="font-bold text-gray-100">
                <button className="line-through cursor-not-allowed">{t("LinkChats")}</button>
              </Link>
              <Link to="/" className="font-bold text-gray-100">
                <button className="line-through cursor-not-allowed">{t("LinkProfile")}</button>
              </Link>
            </>
          )}
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
