import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Header, Footer } from "../components";
import { SINGLE_USER, UPLOAD_PICTURE } from "../utils/routes";
import { uploadImageToCloudinary } from "../utils/cloudinaryUploads";
import avatar from "../assets/avatar.png";

const Profile = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const profilePicture = localStorage.getItem("profilePicture");

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
        const imageUrl = await uploadImageToCloudinary(file);
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
      }
    }
  };

  return (
    <div className="w-full flex flex-col justify-between align-middle min-h-screen">
      <Header />

      <div className="w-full grid place-items-center">
        <img
          src={profilePicture || userData?.profilePicture || avatar}
          alt="profile"
          className="w-48 h-48 object-cover rounded-md shadow-md bg-white"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="mt-8 bg-white p-2 rounded-md shadow-md w-[320px]"
        />
        <h1 className="mt-8 text-2xl">
          <b>@{userData?.username}</b>
        </h1>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
