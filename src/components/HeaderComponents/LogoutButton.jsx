import React from "react";
import { t } from "i18next";

const LogoutButton = () => {
  const handleLogout = () => {
    const storage = window.localStorage;
    storage.clear();
    window.location.replace("/");
  };

  return (
    <>
      <button
        onClick={handleLogout}
        className="px-4 py-1 transition-all bg-white text-black 
        hover:bg-black hover:text-white relative rounded-md"
      >
        {t("Logout")}
      </button>
    </>
  );
};

export default LogoutButton;
