"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "@/redux/themeSlice";
import { RootState } from "@/redux/store";

export default function ThemeToggle() {
  const dispatch = useDispatch();
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-lg shadow-md transition"
    >
      {darkMode ? "Light Mode" : "Dark Mode"}
    </button>
  );
}
