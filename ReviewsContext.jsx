import { createContext, useContext, useEffect, useState } from "react";

// Reviews stored globally in localStorage: { [vendorId]: Review[] }
const KEY = "qf_reviews";

const readAll = () => {
  try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { return {}; }
};
const writeAll = (m) => localStorage.setItem(KEY, JSON.stringify(m));

const ReviewsContext = createContext(null);

export const ReviewsProvider = ({ children }) => {
  const [map, setMap] = useState({});

  useEffect(() => { setMap(readAll()); }, []);

  const persist = (next) => { setMap(next); writeAll(next); };

  const getReviews = (vendorId) => map[vendorId] || [];

  const addReview = (vendorId, { authorEmail, authorName, rating, text }) => {
    const list = map[vendorId] || [];
    const review = {
      id: "r-" + Date.now(),
      authorEmail, authorName,
      rating: Math.max(1, Math.min(5, Number(rating))),
      text: text.trim(),
      createdAt: Date.now(),
    };
    persist({ ...map, [vendorId]: [review, ...list] });
  };

  const userReviewedVendor = (vendorId, email) =>
    (map[vendorId] || []).some((r) => r.authorEmail === email);

  return (
    <ReviewsContext.Provider value={{ getReviews, addReview, userReviewedVendor }}>
      {children}
    </ReviewsContext.Provider>
  );
};

export const useReviews = () => {
  const ctx = useContext(ReviewsContext);
  if (!ctx) throw new Error("useReviews must be used within ReviewsProvider");
  return ctx;
};
