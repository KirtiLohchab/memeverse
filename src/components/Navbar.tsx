"use client";

import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  return (
    <nav className="p-4 bg-gray-100 dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-wide"
        >
          MemeVerse
        </Link>

        {/* Navigation Links */}
        <div className="flex gap-6 text-lg">
          {["explore", "upload", "leaderboard", "profile"].map((item) => (
            <Link
              key={item}
              href={`/${item}`}
              className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition duration-200"
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </Link>
          ))}
        </div>
        <div>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
