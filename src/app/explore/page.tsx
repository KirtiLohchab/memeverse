"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchMemes } from "@/redux/memeSlice";
import MemeCard from "@/components/MemeCard";
import InfiniteScroll from "@/components/InfiniteScroll";
import SearchBar from "@/components/SearchBar";
import SortDropdown from "@/components/SortDropdown";

const categories = ["Trending", "New", "Classic", "Random"];

const Explore = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { memes, loading, error } = useSelector(
    (state: RootState) => state.memes
  );
  const [visibleMemes, setVisibleMemes] = useState(6);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("date");
  const [selectedCategory, setSelectedCategory] = useState("Trending");

  useEffect(() => {
    dispatch(fetchMemes());
  }, [dispatch]);

  const loadMoreMemes = () => {
    setVisibleMemes((prev) => prev + 8);
  };

  // Category Filtering Logic
  const getCategoryFilteredMemes = () => {
    const filteredMemes = [...memes];
    if (selectedCategory === "Trending") {
      return filteredMemes.filter((meme) => meme.likes > 100);
    }
    if (selectedCategory === "New") {
      return filteredMemes.filter(
        (meme) =>
          new Date(meme.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      );
    }
    if (selectedCategory === "Classic") {
      return filteredMemes.filter((meme) => meme.likes > 500);
    }
    return filteredMemes.sort(() => Math.random() - 0.5);
  };

  // Search & Sorting Logic
  const filteredMemes = getCategoryFilteredMemes()
    .filter((meme) =>
      meme.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOption === "likes") return b.likes - a.likes;
      if (sortOption === "comments") return b.comments - a.comments;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  if (loading) return <p className="text-center text-lg">Loading memes...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">Explore Memes</h1>

      {/* Category Filter Tabs */}
      <div className="flex justify-center space-x-4 mb-6">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition ${
              selectedCategory === category
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Search and Sort Components */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <SearchBar onSearch={setSearchQuery} />
        <SortDropdown onSortChange={setSortOption} />
      </div>

      {/* Memes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredMemes.slice(0, visibleMemes).map((meme) => (
          <MemeCard key={meme.id} meme={meme} />
        ))}
      </div>

      {/* Infinite Scroll */}
      <InfiniteScroll loadMore={loadMoreMemes} isLoading={loading} />
    </div>
  );
};

export default Explore;
