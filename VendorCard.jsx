import { Link } from "react-router-dom";
import { MapPin, Briefcase, ArrowRight, Check } from "lucide-react";
import RatingStars from "./RatingStars";

const serviceColors = {
  Electrician: "from-amber-400 to-orange-500",
  Plumber: "from-sky-400 to-blue-600",
  Carpenter: "from-orange-500 to-red-500",
  Technician: "from-emerald-400 to-teal-600",
};

const VendorCard = ({ vendor, onCompare, isComparing, index = 0 }) => {
  const grad = serviceColors[vendor.service] || "from-primary to-primary-glow";

  return (
    <article
      className="group relative rounded-2xl bg-card border border-border/60 overflow-hidden shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-hover)] hover:-translate-y-2 transition-[var(--transition-smooth)] animate-fade-up"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Top gradient strip */}
      <div className={`h-1.5 bg-gradient-to-r ${grad}`} />

      <div className="p-6">
        <div className="flex items-start justify-between gap-3 mb-5">
          <div className="flex items-center gap-3.5">
            <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${grad} grid place-items-center text-white font-bold text-xl shadow-[var(--shadow-soft)]`}>
              {vendor.name.charAt(0)}
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-success border-2 border-card grid place-items-center">
                <Check className="w-3 h-3 text-white" strokeWidth={3} />
              </span>
            </div>
            <div>
              <h3 className="font-bold text-foreground leading-tight">{vendor.name}</h3>
              <span className="inline-block mt-1 text-xs px-2.5 py-0.5 rounded-full bg-accent text-accent-foreground font-semibold">
                {vendor.service}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">from</p>
            <span className="text-xl font-extrabold text-gradient">{vendor.price}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
          <span className="flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5" />
            {vendor.experience}
          </span>
          <span className="w-1 h-1 rounded-full bg-border" />
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            {vendor.location}
          </span>
        </div>

        <div className="flex items-center justify-between mb-5 pb-5 border-b border-dashed border-border">
          <RatingStars rating={vendor.rating} />
          <span className="text-xs text-muted-foreground">{vendor.completed}+ jobs</span>
        </div>

        <div className="flex gap-2">
          <Link
            to={`/vendors/${vendor.id}`}
            className="flex-1 group/btn flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-foreground text-background font-semibold text-sm hover:bg-foreground/90 transition-[var(--transition-smooth)]"
          >
            View Details
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>
          <button
            onClick={() => onCompare?.(vendor)}
            className={`px-4 py-2.5 rounded-xl text-sm font-semibold border-2 transition-[var(--transition-smooth)] ${
              isComparing
                ? "bg-accent-orange text-accent-orange-foreground border-accent-orange"
                : "border-border hover:border-primary hover:text-primary text-foreground"
            }`}
          >
            {isComparing ? "✓" : "+"}
          </button>
        </div>
      </div>
    </article>
  );
};

export default VendorCard;
