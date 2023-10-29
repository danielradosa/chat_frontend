import React from "react";
import { Header, Footer } from "../components";
import { useTranslation } from "react-i18next";

const Home = () => {
  const { t } = useTranslation();

  return (
    <>
      <main className="w-full  flex flex-col justify-between align-middle min-h-screen">
        <Header />
        <div className="text-center">
          <p>{t("HomeText")} <br /> {t("HomeText2")}</p>

          <div className="mt-4 flex justify-center align-middle ">
            <a href="/login">
              <button className="border hover:text-white transition-all border-[#8251ED] hover:bg-[#8251ED] text-[#8251ED] font-bold py-2 px-4 rounded-3xl">
                {t("LoginButtonText")}
              </button>
            </a>
          </div>
        </div>
        <Footer />
      </main>
    </>
  );
};

export default Home;
