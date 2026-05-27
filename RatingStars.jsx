import { Star } from "lucide-react";

// Renders a 5-star rating with optional numeric label
const RatingStars = ({ rating, showNumber = true, size = 16 }) => {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[0, 1, 2, 3, 4].map((i) => {
          const filled = i < full || (i === full && half);
          return (
            <Star
              key={i}
              size={size}
              className={filled ? "fill-rating text-rating" : "text-muted-foreground/30"}
            />
          );
        })}
      </div>
      {showNumber && (
        <span className="text-sm font-semibold text-foreground ml-1">{rating.toFixed(1)}</span>
      )}
    </div>
  );
};

export default RatingStars;
