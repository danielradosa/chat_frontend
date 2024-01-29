import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {
  Home,
  Login,
  Dashboard,
  Signup,
  Chat,
  Profile,
  About,
} from "./pages/index";
import IsAuthenticated from "./utils/isAuthenticated";
import i18n from "./i18n";
import { I18nextProvider } from "react-i18next";
import Cookies from "js-cookie";

function App() {
  const selectedLanguage = Cookies.get("selectedLanguage");
  i18n.changeLanguage(selectedLanguage);

  document.addEventListener("mousemove", (e) => {
    document.body.style.backgroundPositionX = -e.pageX / 100 + "px";
    document.body.style.backgroundPositionY = -e.pageY / 100 + "px";
  });

  return (
    <Router>
      <I18nextProvider i18n={i18n}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<Signup />} />
          <Route path="/about" element={<About />} />

          {/* Private Routes */}
          <Route element={<IsAuthenticated />}>
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Dynamic Routes */}
            <Route path="/chat/:conversationId" element={<Chat />} />
            <Route path="/profile/:userName" element={<Profile />} />
          </Route>
        </Routes>
      </I18nextProvider>
    </Router>
  );
}

export default App;
