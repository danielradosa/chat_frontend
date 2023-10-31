import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import sk from "../assets/sk.webp";
import us from "../assets/us.webp";
import { t } from "i18next";

const Header = () => {
  const { i18n } = useTranslation();
  const user = localStorage.getItem("token");

  const changeLang = () => {
    if (i18n.language === "sk") {
      i18n.changeLanguage("en");
    } else {
      i18n.changeLanguage("sk");
    }
  };

  const handleLogout = () => {
    const storage = window.localStorage;
    storage.clear();
    window.location.replace("/");
  };

  return (
    <header>
      <div className="flex items-center justify-between align-middle">
        <h1 className="text-3xl p-4 items-center">
          <Link to={user ? "/dashboard" : "/"}>
            <span className="font-bold text-[#8251ED]">dove</span>.me
          </Link>
        </h1>

        <div className="flex justify-center align-middle items-center p-4">
          {user ? (
            <button
              onClick={handleLogout}
              className="text-white bg-red-500 mr-4 px-4 py-1 rounded-3xl"
            >
              {t("Logout")}
            </button>
          ) : null}
          <button
            onClick={changeLang}
            className="flex items-center justify-center"
          >
            <img
              src={i18n.language === "sk" ? us : sk}
              alt="language icon"
              className="w-8"
            />
          </button>
        </div>
      </div>
      <hr />
    </header>
  );
};

export default Header;
