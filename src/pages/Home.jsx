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
        <img
          src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/30f50151-92ad-4fd9-be87-6c7969f2d76d/d64a5uz-eabbc2bb-40ed-4ed7-8e76-2ae8bbc5f177.png/v1/fill/w_456,h_370/cinnamoroll_png_by_carolinachocofreak_d64a5uz-fullview.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MzcwIiwicGF0aCI6IlwvZlwvMzBmNTAxNTEtOTJhZC00ZmQ5LWJlODctNmM3OTY5ZjJkNzZkXC9kNjRhNXV6LWVhYmJjMmJiLTQwZWQtNGVkNy04ZTc2LTJhZThiYmM1ZjE3Ny5wbmciLCJ3aWR0aCI6Ijw9NDU2In1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.QS_Yxj3B9xDbhvRsRxRem4VXHYv9kqbjzXbU-Xg8ch0"
          alt=""
          width="256px"
        />
        <p className="font-bold text-white md:text-2xl">
          {t("HomeText")} <br /> {t("HomeText2")}
        </p>

        <div className="flex flex-col items-center justify-center gap-4">
          <Link to="/login">
            <button
              className="mt-8 w-48 rounded-3xl bg-white px-4
                py-2 font-bold text-blue-300 transition-all hover:bg-blue-300 hover:text-white"
            >
              {t("LoginButtonText")}
            </button>
          </Link>
          <Link to="/sign-up">
            <button
              className="w-64 rounded-3xl bg-blue-300 px-4
                py-2 font-bold text-white transition-all hover:bg-blue-400"
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
