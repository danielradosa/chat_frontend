import React from "react";
import { Header, Footer } from "../components";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { VALIDATE_TOKEN } from "../utils/routes";

const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  let user = localStorage.getItem("token");

  if (user) {
    const validateToken = async () => {
      try {
        const response = await axios.post(VALIDATE_TOKEN, {
          token: user,
        });
        if (response.data.valid) {
          navigate("/dashboard");
        }
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("userId");
        localStorage.removeItem("profilePicture");
        console.error("Token validation error:", error);
        window.location.reload();
      }
    };
    validateToken();
  }

  const renderButton = (to, buttonText, width = "w-48") => (
    <Link to={to} className="rounded-md transition-all shadow-lg">
      <button
        className={`px-4 py-2 font-bold h-auto ${width} hover:bg-blue-100 bg-white
        focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 rounded-sm
        transition-all`}
      >
        {t(buttonText)}
      </button>
    </Link>
  );

  return (
    <main className="flex min-h-screen w-full flex-col justify-between">
      <Header />
      <div className="flex flex-col items-center text-center">
        <p className="font-bold md:text-2xl mb-8 text-white">
          {t("HomeText")} <br /> {t("HomeText2")}
        </p>
        <div className="flex flex-col items-center justify-center gap-4">
          {renderButton("/login", "LoginButtonText")}
          {renderButton("/sign-up", "SignupButtonText")}
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default Home;
