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
        className="text-white bg-red-500 px-4 py-1 rounded-full transition-all
        hover:text-white hover:bg-blue-300"
      >
        {t("Logout")}
      </button>
    </>
  );
};

export default LogoutButton;
