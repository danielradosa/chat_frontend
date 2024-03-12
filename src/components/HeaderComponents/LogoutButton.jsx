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
        className="transition-all bg-white rounded-md py-1
        hover:bg-gray-100 focus:outline-none focus:ring-2 
        focus:ring-gray-300 focus:ring-offset-2 w-36 h-auto truncate"
      >
        {t("Logout")}
      </button>
    </>
  );
};

export default LogoutButton;
