import React, { useEffect } from "react";
import { Header, Footer } from "../components";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const userExists = localStorage.getItem("token");
    if (userExists) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const renderButton = (to, buttonText, width = "w-48") => (
    <Link to={to} className="bg-white rounded-md transition-all shadow-lg">
      <button
        className={`px-4 py-2 font-bold h-auto ${width} hover:bg-gray-100 
        focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 rounded-md`}
      >
        {t(buttonText)}
      </button>
    </Link>
  );

  return (
    <main className="flex min-h-screen w-full flex-col justify-between">
      <Header />
      <div className="flex flex-col items-center text-center">
        <p className="font-bold md:text-2xl mb-8">
          {t("HomeText")} <br /> {t("HomeText2")}
        </p>
        <div className="flex flex-col items-center justify-center gap-4">
          {renderButton("/login", "LoginButtonText")}
          {renderButton("/sign-up", "SignupButtonText", "w-64")}
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default Home;
