import React from "react";
import { LogoutButton, LanguageSwitcher, Logo } from "./HeaderComponents";

const Header = () => {
  const user = localStorage.getItem("token");
  
  return (
    <header>
      <div className="flex items-center justify-between align-middle">
        <Logo />

        <div className="flex justify-center align-middle items-center p-4">
          {user ? <LogoutButton /> : null}
          <LanguageSwitcher />
        </div>
      </div>
      <hr />
    </header>
  );
};

export default Header;
