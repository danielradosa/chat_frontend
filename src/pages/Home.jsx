import React from "react";
import { Header, Footer } from "../components";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Home = () => {
  const { t } = useTranslation();
  const user = localStorage.getItem("token");

  if (user) {
    window.location.replace("/dashboard");
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
            className="bg-white rounded-md hover:bg-black hover:text-white transition-all
            shadow-lg"
          >
            <button className="w-48 px-4 py-2 font-bold h-auto">
              {t("LoginButtonText")}
            </button>
          </Link>
          <Link
            to="/sign-up"
            className="bg-white rounded-md hover:bg-black hover:text-white transition-all
            shadow-lg"
          >
            <button className="w-64 px-4 py-2 font-bold">
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
