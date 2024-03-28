import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Header, Footer } from "../components";
import { SINGLE_USER, UPLOAD_PICTURE } from "../utils/routes";
import { uploadImageToCloudinary } from "../utils/cloudinaryUploads";
import avatar from "../assets/avatar.png";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Profile = () => {
  const { t } = useTranslation();
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const user = localStorage.getItem("token");
  const loading = !userData;
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch(SINGLE_USER(userId));
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    getUser();
  }, [userId]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    if (file) {
      try {
        const imageUrl = await uploadImageToCloudinary(
          file,
          (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            setProgress(progress);
          }
        );

        await fetch(UPLOAD_PICTURE, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
            profilePicture: imageUrl,
          }),
        });

        localStorage.setItem("profilePicture", imageUrl);
        setUserData({ ...userData, profilePicture: imageUrl });
      } catch (error) {
        console.error("Error uploading image:", error.message);
      } finally {
        setProgress(100);
        setTimeout(() => {
          setProgress(0);
        }, 2000);
      }
    }
  };

  const changeBGColor = () => {
    const label = document.querySelector("label[for=file]");
    label.style.backgroundColor = "rgba(255, 0, 0, 1)";
  }

  return (
    <div className="w-full flex flex-col justify-between align-middle min-h-screen">
      <Header />

      <div className="w-full grid place-items-center">
        <img
          src={userData?.profilePicture || loading || avatar}
          alt="profile"
          className="w-[320px] h-[320px] object-cover rounded-full shadow-md bg-black/60"
        />
        <h1 className="mt-8 text-2xl bg-black/60 text-white border-2 
        rounded-xl w-[320px] text-center py-2 shadow-md border-black">
          <b>
            {userData ? (
              `@` + userData.username
            ) : (
              <Skeleton width={320} height={52} />
            )}
          </b>
        </h1>
        {user && userId === localStorage.getItem("userId") && (
          <>
            <label 
              htmlFor="file"
              onChange={changeBGColor}
              className="mt-8 w-[320px] bg-black/60 py-2 px-4 text-center rounded-xl cursor-pointer
              shadow-md hover:shadow-lg transition ease-in-out hover:bg-black/40 flex items-center
              justify-between text-white"
            >{t("uploadPicture")}... <strong>+</strong></label>
            <input
              id="file"
              type="file"
              accept="image/*"
              style={{ visibility: "hidden" }}
              onChange={handleImageUpload}
              className="bg-white p-2 rounded-md shadow-md w-[320px] mt-8"
            />
            <div className="rounded-md w-[320px] mt-[-4em]">
              <progress
                value={progress}
                max="100"
                className="w-full h-2 rounded-md"
                style={{
                  transition: "all 0.15s ease-in-out",
                  width: `${progress}%`,
                }}
              ></progress>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
