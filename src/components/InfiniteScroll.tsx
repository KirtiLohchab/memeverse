"use client";

import { useEffect, useRef, useCallback } from "react";

interface InfiniteScrollProps {
  loadMore: () => void;
  isLoading: boolean;
}

const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  loadMore,
  isLoading,
}) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastMemeRef = useRef<HTMLDivElement | null>(null);

  const observeElement = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading || !node) return;

      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            loadMore();
          }
        },
        { threshold: 1.0 }
      );

      observerRef.current.observe(node);
    },
    [isLoading, loadMore]
  );

  useEffect(() => {
    if (lastMemeRef.current) {
      observeElement(lastMemeRef.current);
    }
  }, [observeElement]);

  return <div ref={lastMemeRef} className="h-1" />;
};

export default InfiniteScroll;
