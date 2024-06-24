import React from "react";
import { Link } from "react-router-dom";
import { LogoutButton, LanguageSwitcher, Logo } from "./HeaderComponents";
import { useTranslation } from "react-i18next";

const Header = () => {
  const user = localStorage.getItem("token");
  const { t } = useTranslation();

  const profileId = localStorage.getItem("userId");

  return (
    <header className="z-10 w-full md:px-2 text-white">
      <div className="flex items-center justify-between px-4 py-4 align-middle md:px-6 md:py-4">
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
          ) : null}
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
