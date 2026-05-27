import { useState } from "react";
import { Link } from "react-router-dom";
import { Star, MessageSquare, Lock } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { useBookings } from "../context/BookingsContext";
import { useReviews } from "../context/ReviewsContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const timeAgo = (ts) => {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return Math.floor(s / 60) + "m ago";
  if (s < 86400) return Math.floor(s / 3600) + "h ago";
  return Math.floor(s / 86400) + "d ago";
};

const ReviewsSection = ({ vendor }) => {
  const { user } = useAuth();
  const { hasBookedVendor } = useBookings();
  const { getReviews, addReview, userReviewedVendor } = useReviews();
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState("");

  const reviews = getReviews(vendor.id);
  const eligible = user && hasBookedVendor(vendor.id);
  const already = user && userReviewedVendor(vendor.id, user.email);

  const submit = (e) => {
    e.preventDefault();
    if (!text.trim()) { toast.error("Write a short review"); return; }
    addReview(vendor.id, { authorEmail: user.email, authorName: user.name, rating, text });
    toast.success("Thanks for the review!");
    setText(""); setRating(5);
  };

  const initials = (n) => n.split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase();
  const avg = reviews.length ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1) : null;

  return (
    <section id="reviews" className="rounded-2xl bg-card border border-border/60 p-7 shadow-[var(--shadow-soft)] animate-fade-up">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary" /> Reviews
          <span className="text-sm font-normal text-muted-foreground">({reviews.length})</span>
        </h2>
        {avg && <div className="text-sm font-semibold flex items-center gap-1"><Star className="w-4 h-4 fill-rating text-rating" /> {avg} avg</div>}
      </div>

      {/* Form area */}
      {!user && (
        <div className="rounded-xl bg-muted/40 border border-dashed border-border p-4 text-sm flex items-center gap-2 mb-5">
          <Lock className="w-4 h-4 text-muted-foreground shrink-0" />
          <span><Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link> and book this pro to leave a review.</span>
        </div>
      )}
      {user && !eligible && (
        <div className="rounded-xl bg-muted/40 border border-dashed border-border p-4 text-sm flex items-center gap-2 mb-5">
          <Lock className="w-4 h-4 text-muted-foreground shrink-0" />
          <span>Only customers who've booked {vendor.name} can review.</span>
        </div>
      )}
      {user && eligible && already && (
        <div className="rounded-xl bg-success/10 text-success p-4 text-sm font-semibold mb-5">
          ✓ You've already reviewed this pro.
        </div>
      )}
      {user && eligible && !already && (
        <form onSubmit={submit} className="rounded-xl bg-muted/30 p-4 mb-6 space-y-3">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                onMouseEnter={() => setHover(n)}
                onMouseLeave={() => setHover(0)}
                className="p-0.5"
                aria-label={`${n} stars`}
              >
                <Star className={`w-6 h-6 transition-colors ${(hover || rating) >= n ? "fill-rating text-rating" : "text-muted-foreground/40"}`} />
              </button>
            ))}
            <span className="ml-2 text-sm text-muted-foreground">{rating}/5</span>
          </div>
          <Textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} placeholder="Share your experience…" />
          <Button type="submit" className="font-bold">Post review</Button>
        </form>
      )}

      {/* List */}
      {reviews.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-6">No reviews yet — be the first!</p>
      ) : (
        <ul className="space-y-4">
          {reviews.map((r) => (
            <li key={r.id} className="flex gap-3 pb-4 border-b border-border/60 last:border-0 last:pb-0">
              <div className="w-10 h-10 rounded-full bg-[image:var(--gradient-hero)] grid place-items-center text-primary-foreground font-bold text-sm shrink-0">
                {initials(r.authorName)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-sm">{r.authorName}</span>
                  <span className="text-xs text-muted-foreground">· {timeAgo(r.createdAt)}</span>
                </div>
                <div className="flex items-center gap-0.5 my-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star key={n} className={`w-3.5 h-3.5 ${r.rating >= n ? "fill-rating text-rating" : "text-muted-foreground/30"}`} />
                  ))}
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed">{r.text}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default ReviewsSection;
