import { useRef, useCallback, useEffect } from "react";

export const useInfiniteScroll = ({
  hasMore,
  isLoading,
  onLoadMore,
  threshold = 100,
}) => {
  const observer = useRef();

  const lastElementRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setTimeout(() => {
            onLoadMore();
          }, 100);
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore, onLoadMore]
  );

  return { lastElementRef };
};
