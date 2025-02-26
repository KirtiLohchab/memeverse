"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { fetchMemes, Meme } from "@/redux/memeSlice";
import { motion } from "framer-motion";

const MemeDetails = () => {
  const { id } = useParams() as { id: string };
  const dispatch = useAppDispatch();
  const { memes, loading } = useAppSelector((state: RootState) => state.memes);
  const [meme, setMeme] = useState<Meme | null>(null);
  const [likes, setLikes] = useState<number>(0);
  const [comments, setComments] = useState<string[]>([]);
  const [comment, setComment] = useState<string>("");

  useEffect(() => {
    if (memes.length === 0) {
      dispatch(fetchMemes());
    }
  }, [dispatch, memes.length]);

  useEffect(() => {
    if (memes.length > 0) {
      let foundMeme: Meme | undefined = memes.find((m) => m.id === id);
      if (!foundMeme) {
        const storedMemes: Meme[] = JSON.parse(
          localStorage.getItem("memes") || "[]"
        );
        foundMeme = storedMemes.find((m) => m.id === id);
      }

      if (foundMeme) {
        setMeme(foundMeme);
        setLikes(
          Number(localStorage.getItem(`likes-${foundMeme.id}`)) ||
            foundMeme.likes
        );
        setComments(
          JSON.parse(localStorage.getItem(`comments-${foundMeme.id}`) || "[]")
        );
      }
    }
  }, [id, memes]);

  const handleLike = () => {
    if (!meme) return;
    const newLikes = likes + 1;
    setLikes(newLikes);
    localStorage.setItem(`likes-${meme.id}`, newLikes.toString());
  };

  const handleComment = () => {
    if (comment.trim() === "" || !meme) return;
    const newComments = [...comments, comment];
    setComments(newComments);
    localStorage.setItem(`comments-${meme.id}`, JSON.stringify(newComments));
    setComment("");
  };

  if (loading) {
    return (
      <p className="text-center text-gray-500 dark:text-gray-400">
        Loading meme...
      </p>
    );
  }

  if (!meme) {
    return (
      <p className="text-center text-gray-500 dark:text-gray-400">
        Meme not found.
      </p>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
      <motion.div
        className="bg-gray-200 dark:bg-gray-800 p-6 rounded-lg shadow-xl"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold text-center mb-4 text-gray-900 dark:text-gray-100">
          {meme.name}
        </h1>
        <div className="relative w-full h-96 rounded-lg overflow-hidden">
          <Image
            src={meme.url}
            alt={meme.name}
            layout="fill"
            objectFit="contain"
            className="rounded-lg"
          />
        </div>
        <div className="mt-4 flex justify-between items-center text-gray-700 dark:text-gray-300">
          <button onClick={handleLike} className="flex items-center space-x-2">
            <span>❤️</span> <span>{likes} Likes</span>
          </button>
          <p>💬 {comments.length} Comments</p>
        </div>
      </motion.div>

      <motion.div
        className="bg-gray-200 dark:bg-gray-800 p-6 rounded-lg shadow-xl"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
          Comments
        </h2>
        <div className="space-y-3">
          <ul className="max-h-40 overflow-y-auto space-y-2">
            {comments.map((cmt, index) => (
              <li
                key={index}
                className="bg-gray-200 dark:bg-gray-700 p-2 rounded-lg"
              >
                {cmt}
              </li>
            ))}
          </ul>
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          />
          <button
            onClick={handleComment}
            className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition"
          >
            Post Comment
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default MemeDetails;
