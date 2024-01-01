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
          <p>
            {t("HomeText")} <br /> {t("HomeText2")}
          </p>

          <div className="flex justify-center align-middle flex-col items-center">
            <Link to="/login">
              <button
                className="border hover:text-white transition-all border-violet-500
              hover:bg-violet-500 text-violet-500 font-bold py-2 px-4 rounded-3xl mt-4"
              >
                {t("LoginButtonText")}
              </button>
            </Link>
            <Link to="/sign-up">
              <button
                className="transition-all bg-violet-500
            font-bold py-2 px-4 rounded-3xl text-white mt-5"
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
