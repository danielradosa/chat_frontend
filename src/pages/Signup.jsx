import React, { useState } from "react";
import axios from "axios";
import { Header, Footer } from "../components";
import { useTranslation } from "react-i18next";
import { REGISTER_ROUTE } from "../utils/routes";

const Signup = () => {
  const { t } = useTranslation();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");

  let user = localStorage.getItem("token");

  if (user) {
    window.location.href = "/dashboard";
  }

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      setError("");
      const res = await axios.post(REGISTER_ROUTE, {
        username,
        password,
        passwordAgain,
      });
      if (res.data) {
        setLoading(true);
        setSuccess(t("SignupSuccess"));
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("username", res.data.username);
        localStorage.setItem("userId", res.data.userId);
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      }
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  return (
    <>
      <main className="flex min-h-screen w-full flex-col justify-between align-middle">
        <Header />

        <form onSubmit={handleSignup}>
          <h2 className="mb-6 text-center text-2xl font-bold text-white">
            {t("SignupTitle")}
          </h2>
          {loading && (
            <img
              src="https://i.gifer.com/Pak.gif"
              alt="loader"
              className="mx-auto mt-[-2rem] flex w-48"
            />
          )}
          <div className="flex flex-col items-center justify-center align-middle text-black">
            <input
              type="text"
              autoComplete="off"
              required
              placeholder={t("SignupNamePlaceholder")}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mb-4 px-4 py-2 bg-white rounded-sm hover:bg-blue-100 transition-all border-2 border-white"
            />
            <input
              required
              minLength={6}
              type="password"
              autoComplete="new-password"
              placeholder={t("SignupPasswordPlaceholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-4 px-4 py-2 bg-white rounded-sm hover:bg-blue-100 transition-all border-2 border-white"
            />
            <input
              required
              minLength={6}
              type="password"
              autoComplete="new-password"
              placeholder={t("SignupPasswordAgainPlaceholder")}
              value={passwordAgain}
              onChange={(e) => setPasswordAgain(e.target.value)}
              className="mb-4 px-4 py-2 bg-white rounded-sm hover:bg-blue-100 transition-all border-2 border-white"
            />
            <button
              type="submit"
              className="font-bold py-2 px-4 mt-2 bg-white rounded-sm 
              hover:bg-blue-100 focus:outline-none focus:ring-2 text-black
        focus:ring-gray-300 focus:ring-offset-2 transition-all shadow-lg"
            >
              {t("SignupButtonText")}
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

export default Signup;
