import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

// Bookings stored per-user in localStorage: { [userEmail]: Booking[] }
const KEY = "qf_bookings";

const readAll = () => {
  try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { return {}; }
};
const writeAll = (m) => localStorage.setItem(KEY, JSON.stringify(m));

const BookingsContext = createContext(null);

export const BookingsProvider = ({ children }) => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (!user) { setBookings([]); return; }
    setBookings(readAll()[user.email] || []);
  }, [user]);

  const persist = (next) => {
    setBookings(next);
    if (!user) return;
    const all = readAll();
    all[user.email] = next;
    writeAll(all);
  };

  const addBooking = (b) => {
    const next = [{ ...b, status: "confirmed", createdAt: Date.now() }, ...bookings];
    persist(next);
  };

  const cancelBooking = (id) => {
    persist(bookings.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b)));
  };

  const completeBooking = (id) => {
    persist(bookings.map((b) => (b.id === id ? { ...b, status: "completed" } : b)));
  };

  // Has the user ever booked this vendor (active or completed, not cancelled)?
  const hasBookedVendor = (vendorId) =>
    bookings.some((b) => b.vendorId === vendorId && b.status !== "cancelled");

  return (
    <BookingsContext.Provider value={{ bookings, addBooking, cancelBooking, completeBooking, hasBookedVendor }}>
      {children}
    </BookingsContext.Provider>
  );
};

export const useBookings = () => {
  const ctx = useContext(BookingsContext);
  if (!ctx) throw new Error("useBookings must be used within BookingsProvider");
  return ctx;
};
