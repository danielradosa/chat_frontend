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
        className="text-white bg-red-500 mr-4 px-4 py-1 rounded-full transition-all"
      >
        {t("Logout")}
      </button>
    </>
  );
};

export default LogoutButton;
