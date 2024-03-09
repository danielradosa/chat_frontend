import React from "react";
import { Header, Footer } from "../components";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Home = () => {
  const { t } = useTranslation();

  let userExists = localStorage.getItem("token") ? true : false;

  if (userExists) {
    window.location.href = "/dashboard";
  } else {
    userExists = false;
    const storage = window.localStorage;
    storage.clear();
  }

  return (
    <main className="flex min-h-screen w-full flex-col justify-between">
      <Header />

      <div className="flex flex-col items-center text-center">
        <p className="font-bold md:text-2xl mb-8">
          {t("HomeText")} <br /> {t("HomeText2")}
        </p>

        <div className="flex flex-col items-center justify-center gap-4">
          <Link
            to="/login"
            className="bg-white rounded-md transition-all
            shadow-lg"
          >
            <button
              className="w-48 px-4 py-2 font-bold h-auto
            hover:bg-gray-100 focus:outline-none focus:ring-2 
      focus:ring-gray-300 focus:ring-offset-2 rounded-md"
            >
              {t("LoginButtonText")}
            </button>
          </Link>
          <Link
            to="/sign-up"
            className="bg-white rounded-md transition-all
            shadow-lg"
          >
            <button
              className="px-4 py-2 font-bold h-auto w-64
              hover:bg-gray-100 focus:outline-none focus:ring-2 
        focus:ring-gray-300 focus:ring-offset-2 rounded-md"
            >
              {t("SignupButtonText")}
            </button>
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  );
};

export default Home;
