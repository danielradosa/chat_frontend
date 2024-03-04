import React, { useRef } from "react";
import { Header, Footer } from "../components";
import { useTranslation } from "react-i18next";

const Profile = () => {
  const { t } = useTranslation();
  const username = useRef(window.location.pathname.split("/")[2]);
  console.log(username);

  return (
    <div className="w-full flex flex-col justify-between align-middle min-h-screen">
      <Header />

      <div className="w-full grid place-items-center">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqflWrAdAOipG7MXbS-lwcfUNVVUqey6h3CHpy_U6aw-pp9Af35G0O2ZR2c28YTf5sJug&usqp=CAU"
          alt="profile"
          className="w-48 h-48 object-cover"
        />
        <h1 className="text-2xl mt-8">
          <b> {username.current}</b>
          {t("ProfileTitle")}
        </h1>
        <p className="text-md mt-8 lg:w-1/3 w-3/4 text-justify lg:text-center">
          Bio here
        </p>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
