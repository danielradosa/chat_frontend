import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import i18n from "./i18n";
import { I18nextProvider } from "react-i18next";

function App() {
  return (
    <Router>
      <I18nextProvider i18n={i18n}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />

          {/* Private Routes */}
        </Routes>
        </I18nextProvider>
      </Router>
  );
}

export default App;
