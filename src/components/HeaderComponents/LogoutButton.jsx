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
        className="transition-all bg-black/60 rounded-md py-1
        hover:bg-black/40 focus:outline-none focus:ring-2 font-semibold
        focus:ring-gray-300 focus:ring-offset-2 w-36 h-auto truncate"
      >
        {t("Logout")}
      </button>
    </>
  );
};

export default LogoutButton;
