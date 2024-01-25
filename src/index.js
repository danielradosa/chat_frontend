import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import CustomCursor from "custom-cursor-react";
import "custom-cursor-react/dist/index.css";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CustomCursor
      targets={["button", "Link", "a", "input", "textarea", "li button"]}
      customClass="custom-cursor"
      dimensions={50}
      fill="#006CC1"
      smoothness={{
        movement: 0.2,
        scale: 0.1,
        opacity: 0.2,
      }}
      targetOpacity={0.5}
      targetScale={2.5}
      strokeWidth={2}
      strokeColor={"#006CC1"}
    />
    <App />
  </React.StrictMode>
);
