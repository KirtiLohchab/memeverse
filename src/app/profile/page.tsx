"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { updateProfile } from "@/redux/userSlice";
import AvatarUpload from "@/components/AvatarUpload";
import MemeCard from "@/components/MemeCard";
import InfiniteScroll from "@/components/InfiniteScroll";
import Image from "next/image";

const UserProfile: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useSelector((state: RootState) => state.user);
  const uploadedMemes = useSelector((state: RootState) => state.memes.memes);

  const [name, setName] = useState(user.name || "");
  const [bio, setBio] = useState(user.bio || "");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState(
    user.avatar || "/default-avatar.png"
  );
  const [showUploaded, setShowUploaded] = useState(true);
  const [loading, setLoading] = useState(false);
  const [memesToShow, setMemesToShow] = useState(6);

  useEffect(() => {
    const storedProfile = localStorage.getItem("userProfile");
    if (storedProfile) {
      const { name, bio, avatar } = JSON.parse(storedProfile);
      setName(name);
      setBio(bio);
      setAvatarPreview(avatar);
    }
  }, []);

  const handleAvatarUpload = (file: File) => {
    setAvatar(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = () => {
    const avatarUrl = avatar ? avatarPreview : user.avatar;
    const updatedProfile = { name, bio, avatar: avatarUrl };

    dispatch(updateProfile(updatedProfile));
    localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
  };

  const loadMoreMemes = () => {
    setLoading(true);
    setTimeout(() => {
      setMemesToShow((prev) => prev + 6);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="container mx-auto p-4 text-gray-900 dark:text-gray-100">
      <h1 className="text-xl font-semibold text-center mb-6">
        Edit Your Profile
      </h1>

      <div className="bg-gray-200 dark:bg-gray-800 p-6 shadow-md rounded-lg max-w-md mx-auto relative">
        <div className="absolute top-1 left-1/2 transform -translate-x-1/2">
          <Image
            src={avatarPreview}
            alt="Avatar"
            className="w-20 h-20 rounded-full object-cover border-4 border-gray-300 dark:border-gray-700"
          />
        </div>

        {/* Form Fields */}
        <div className="mt-12">
          <label className="block text-sm font-medium">Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 mt-1 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:border-gray-600 text-black dark:text-white"
          />

          <label className="block text-sm font-medium mt-4">Bio:</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full px-3 py-2 mt-1 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:border-gray-600 text-black dark:text-white resize-none"
            rows={3}
          />

          <AvatarUpload onUpload={handleAvatarUpload} />

          <button
            onClick={handleSaveProfile}
            className="w-full py-2 mt-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
          >
            Save Profile
          </button>
        </div>
      </div>

      {/* Dropdown for Uploaded & Liked Memes */}
      <div className="mt-8 flex justify-start">
        <select
          onChange={(e) => setShowUploaded(e.target.value === "uploaded")}
          className="border px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 text-lg font-bold bg-white dark:bg-gray-800"
        >
          <option value="uploaded">Uploaded Memes</option>
          <option value="liked">Liked Memes</option>
        </select>
      </div>

      {/* Meme List with Infinite Scroll */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold text-center">
          {showUploaded ? " Uploaded Memes" : "Liked Memes"}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
          {uploadedMemes.slice(0, memesToShow).map((meme) => (
            <MemeCard key={meme.id} meme={meme} />
          ))}
        </div>

        {/* Infinite Scroll Component */}
        <InfiniteScroll loadMore={loadMoreMemes} isLoading={loading} />
      </div>
    </div>
  );
};

export default UserProfile;
