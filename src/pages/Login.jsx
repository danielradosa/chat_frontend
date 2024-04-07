import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Header, Footer } from "../components";
import { useTranslation } from "react-i18next";
import { LOGIN_ROUTE, VALIDATE_TOKEN } from "../utils/routes";

const Login = () => {
  const { t } = useTranslation();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
      }
    };
    validateToken();
  }

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      setError("");
      const res = await axios.post(LOGIN_ROUTE, {
        username,
        password,
      });
      if (res.data) {
        setSuccess(t("LoginSuccess"));
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("username", res.data.username);
        localStorage.setItem("userId", res.data.userId);
        localStorage.setItem("profilePicture", res.data.profilePicture);
        navigate("/dashboard");
      }
    } catch (err) {
      setError(t("LoginError"));
      setTimeout(() => {
        setError("");
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <main className="w-full flex flex-col justify-between align-middle min-h-screen">
        <Header />

        <form onSubmit={handleLogin}>
          <h2 className="text-center text-2xl font-bold mb-6 text-white">
            {t("LoginTitle")}
          </h2>
          {loading && (
            <img
              src="https://i.gifer.com/Pak.gif"
              alt="loader"
              className="w-48 flex mx-auto mt-[-2rem]"
            />
          )}
          <div className="flex justify-center align-middle flex-col items-center text-white">
            <input
              type="text"
              required
              placeholder={t("LoginNamePlaceholder")}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="px-4 py-2 mb-4 bg-black/80 rounded-xl hover:bg-black/60 transition-all border-2 border-black"
            />
            <input
              type="password"
              required
              placeholder={t("LoginPasswordPlaceholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-2 mb-4 bg-black/80 rounded-xl hover:bg-black/60 transition-all border-2 border-black"
            />
            <button
              type="submit"
              className="font-bold py-2 px-4 mt-2 bg-white rounded-xl
              hover:bg-gray-100 focus:outline-none focus:ring-2 text-black
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
