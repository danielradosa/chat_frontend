import React from "react";
import { useTranslation } from "react-i18next";
import sk from "../assets/sk.webp";
import us from "../assets/us.webp";

const Header = () => {
  const { i18n } = useTranslation();

  const changeLang = () => {
    if (i18n.language === "sk") {
      i18n.changeLanguage("en");
    } else {
      i18n.changeLanguage("sk");
    }
  };

  return (
    <header>
      <div className="flex justify-between items-center align-middle">
        <h1 className="text-3xl p-4 items-center">
          <span className="font-bold text-[#8251ED]">dove</span>.me
        </h1>
        <button onClick={changeLang} className="flex items-center justify-center mr-4">
          <img
            src={i18n.language === "sk" ? us : sk}
            alt="language icon"
            className="w-8"
          />
        </button>
      </div>
      <hr />
    </header>
  );
};

export default Header;
