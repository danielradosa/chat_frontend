import React, { useState } from "react";
import axios from "axios";
import { Header, Footer } from "../components";
import { useTranslation } from "react-i18next";
import { LOGIN_ROUTE } from "../utils/routes";

const Login = () => {
  const { t } = useTranslation();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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
        setSuccess(t("LoginSuccess"));
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("username", res.data.username);
        localStorage.setItem("userId", res.data.userId);
        localStorage.setItem("profilePicture", res.data.profilePicture);

        window.location.href = "/dashboard";
      }
    } catch (err) {
      setError(t("LoginError"));
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  return (
    <>
      <main className="w-full flex flex-col justify-between align-middle min-h-screen">
        <Header />

        <form onSubmit={handleLogin}>
          <h2 className="text-center text-2xl font-bold mb-6">
            {t("LoginTitle")}
          </h2>
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
              required
              placeholder={t("LoginNamePlaceholder")}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="px-4 py-2 mb-4 bg-white rounded-md hover:bg-gray-100 transition-all border-2"
            />
            <input
              type="password"
              required
              placeholder={t("LoginPasswordPlaceholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-2 mb-4 bg-white rounded-md hover:bg-gray-100 transition-all border-2"
            />
            <button
              type="submit"
              className="font-bold py-2 px-4 mt-2 bg-white rounded-md 
              hover:bg-gray-100 focus:outline-none focus:ring-2 
        focus:ring-gray-300 focus:ring-offset-2 transition-all shadow-lg"
            >
              {t("LoginButtonText")}
            </button>

            {success && <p className="mt-4">{success}</p>}
            {error && <p className="mt-4">{error}</p>}
          </div>
        </form>

        <Footer />
      </main>
    </>
  );
};

export default Login;
