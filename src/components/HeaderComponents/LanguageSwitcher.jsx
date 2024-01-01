import React from "react";
import sk from "../../assets/sk.png";
import us from "../../assets/us.png";
import Cookies from "js-cookie";
import i18n from "../../i18n";

const LanguageSwitcher = () => {
  const changeLang = () => {
    if (i18n.language === "sk") {
      i18n.changeLanguage("en");
      Cookies.set("selectedLanguage", "en", { expires: 365 });
    } else {
      i18n.changeLanguage("sk");
      Cookies.set("selectedLanguage", "sk", { expires: 365 });
    }
  };

  return (
    <>
      <button onClick={changeLang} className="flex items-center justify-center">
        <img
          src={i18n.language === "sk" ? us : sk}
          alt="language icon"
          className="w-10 saturate-150 p-1 border-2 rounded-3xl border-violet-800"
        />
      </button>
    </>
  );
};

export default LanguageSwitcher;
