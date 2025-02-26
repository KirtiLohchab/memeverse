"use client";

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { fetchMemes } from "@/redux/memeSlice";
import MemeCard from "@/components/MemeCard";
import { motion } from "framer-motion";

const Leaderboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const memes = useSelector((state: RootState) => state.memes.memes);

  useEffect(() => {
    if (memes.length === 0) {
      dispatch(fetchMemes());
    }
  }, [dispatch, memes.length]);

  const topMemes = [...memes].sort((a, b) => b.likes - a.likes).slice(0, 10);

  return (
    <div className="container mx-auto p-6 text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold text-center mb-6">Leaderboard</h1>
      <div className="bg-gray-300 dark:bg-gray-800 shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-8">
          🔥 Top 10 Most Liked Memes
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {topMemes.map((meme, index) => (
            <motion.div
              key={meme.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <MemeCard meme={meme} ranking={index + 1} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
