import React, { useState, useEffect } from "react";
import axios from "axios";
import { Header, Footer } from "../components";
import { useTranslation } from "react-i18next";
import { LOGIN_ROUTE } from "../utils/routes";

const Login = () => {
  const { t } = useTranslation();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const isRemembered = localStorage.getItem("remember");

    if (isRemembered === "true" && window.location.pathname === "/login") {
      window.location.href = "/dashboard";
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setError("");
      const res = await axios.post(LOGIN_ROUTE, {
        username,
        password,
      });
      if (res.data) {
        setLoading(true);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("remember", true);
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 2000);
      }
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  return (
    <>
      <main className="w-full  flex flex-col justify-between align-middle min-h-screen">
        <Header />

        <form onSubmit={handleLogin}>
          <h1 className="text-center text-2xl font-bold mb-4">
            {t("LoginTitle")}
          </h1>
          {loading && (
            <img
              src="https://i.gifer.com/Pak.gif"
              alt="loader"
              className="w-48 flex mx-auto mt-[-2rem]"
            />
          )}
          <div className="flex justify-center align-middle flex-col items-center">
            <input
              type="text"
              placeholder={t("LoginNamePlaceholder")}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border border-[#8251ED] rounded-3xl px-4 py-2 mb-4"
            />
            <input
              type="password"
              placeholder={t("LoginPasswordPlaceholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-[#8251ED] rounded-3xl px-4 py-2 mb-4"
            />
            <button
              type="submit"
              className="border hover:text-white transition-all border-[#8251ED] 
                hover:bg-[#8251ED] text-[#8251ED] font-bold py-2 px-4 rounded-3xl"
            >
              {t("LoginButtonText")}
            </button>

            {error && <p className="mt-2">{error}</p>}
          </div>
        </form>

        <Footer />
      </main>
    </>
  );
};

export default Login;
