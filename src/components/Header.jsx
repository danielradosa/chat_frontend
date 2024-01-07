import React from "react";
import { Link } from "react-router-dom";
import { LogoutButton, LanguageSwitcher, Logo } from "./HeaderComponents";
import { useTranslation } from "react-i18next";

const Header = () => {
  const user = localStorage.getItem("token");
  const { t } = useTranslation();

  return (
    <header className="bg-violet-500 border-b-4 ">
      <div className="flex items-center justify-between align-middle">
        <Logo />

        <nav className="hidden md:flex justify-center p-4 items-center gap-4">
          { user ?
            <Link to="/dashboard">
              <button className="bg-violet-800 text-white px-4 py-1 rounded-full
              hover:bg-[#f3dae4] transition-all hover:text-violet-800">
                {t("LinkChats")}
              </button>
            </Link>
            : null
          }
          <Link to="/about">
            <button className="bg-violet-800 text-white px-4 py-1 rounded-full
            hover:bg-[#f3dae4] transition-all hover:text-violet-800">
              {t("LinkAbout")}
            </button>
          </Link>
        </nav>

        <div className="flex justify-center align-middle items-center p-4">
          {user ? <LogoutButton /> : <div className="mr-4 px-4 py-1 rounded-full transition-all"></div>}
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
};

export default Header;
