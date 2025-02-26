"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchMemes } from "@/redux/memeSlice";
import Link from "next/link";
import MemeCard from "@/components/MemeCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Homepage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { memes, loading, error } = useSelector(
    (state: RootState) => state.memes
  );

  useEffect(() => {
    dispatch(fetchMemes());
  }, [dispatch]);

  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
        Welcome to MemeVerse 🎉
      </h1>
      <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 mb-6">
        Discover, create, and share trending memes with the world!
      </p>

      <Link href="/explore">
        <button className="bg-gray-500 hover:bg-gray-700 text-white px-6 py-3 rounded-lg text-lg shadow-md transition">
          Explore Memes
        </button>
      </Link>

      {/* Swiper Carousel */}
      <div className="mt-28">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={15}
          // slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
          // navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 1000 }}
          className="w-full"
        >
          {loading && (
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Loading memes...
            </p>
          )}
          {error && <p className="text-red-500">{error}</p>}
          {!loading &&
            !error &&
            memes.slice(0, 12).map((meme) => (
              <SwiperSlide key={meme.id}>
                <MemeCard meme={meme} />
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Homepage;
