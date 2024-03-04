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
        className="px-4 py-1 rounded-full transition-all"
      >
        {t("Logout")}
      </button>
    </>
  );
};

export default LogoutButton;
