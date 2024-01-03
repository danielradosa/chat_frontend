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
    <>
      <main className="w-full  flex flex-col justify-between align-middle min-h-screen">
        <Header />
        <div className="text-center">
          <p className="text-white font-bold md:text-2xl">
            {t("HomeText")} <br /> {t("HomeText2")}
          </p>

          <div className="flex justify-center flex-col align-middle gap-4 items-center">
            <Link to="/login">
              <button
                className=" hover:text-white transition-all hover:bg-violet-500 w-48 shadow-lg
                text-violet-500 font-bold py-2 px-4 rounded-3xl mt-8 bg-white"
              >
                {t("LoginButtonText")}
              </button>
            </Link>
            <Link to="/sign-up">
              <button
                className="text-white transition-all hover:bg-violet-800 w-64 
                text-violet-500 font-bold py-2 px-4 rounded-3xl bg-violet-500 shadow-lg"
              >
                {t("SignupButtonText")}
              </button>
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    </>
  );
};

export default Home;
