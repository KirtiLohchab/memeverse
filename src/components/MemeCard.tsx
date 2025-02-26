"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface Meme {
  id: string;
  name: string;
  url: string;
  likes: number;
  comments: number;
}

interface MemeCardProps {
  meme: Meme;
  ranking?: number;
}

const MemeCard: React.FC<MemeCardProps> = ({ meme, ranking }) => {
  const router = useRouter();

  if (!meme) return null;

  return (
    <motion.div
      className="bg-gray-200 dark:bg-gray-800 p-2 rounded-lg shadow-lg relative cursor-pointer"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
      onClick={() => router.push(`/meme/${meme.id}`)}
    >
      {ranking !== undefined && (
        <div className="absolute top-2 left-2 bg-blue-600 text-white text-sm font-bold px-3 py-1 rounded-full">
          #{ranking}
        </div>
      )}

      <Image
        src={meme.url}
        alt={meme.name}
        width={300}
        height={300}
        className="rounded-lg w-full h-auto object-cover"
        loading="lazy"
      />
      <p className="mt-2 text-center font-semibold">{meme.name}</p>
      <p className="text-center text-sm">
        ❤️ {meme.likes} | 💬 {meme.comments}
      </p>
    </motion.div>
  );
};

export default MemeCard;
