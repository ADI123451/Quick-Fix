import { Link } from "react-router-dom";
import { X, Trophy, ArrowRight, Scale } from "lucide-react";
import { useCompare } from "../context/CompareContext";
import RatingStars from "../components/RatingStars";

const Compare = () => {
  const { compareList, toggleCompare, clearCompare } = useCompare();

  if (compareList.length === 0) {
    return (
      <div className="container py-24 text-center">
        <div className="inline-flex w-20 h-20 rounded-3xl bg-accent items-center justify-center mb-6">
          <Scale className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-3">Compare Vendors</h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Add 2 or 3 vendors from the listing page to see them side-by-side.
        </p>
        <Link
          to="/vendors"
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[image:var(--gradient-hero)] text-primary-foreground font-bold shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-hover)] hover:scale-105 transition-[var(--transition-smooth)]"
        >
          Browse Vendors <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  // Highlight winners
  const priceNum = (p) => Number(p.replace(/[^\d]/g, ""));
  const lowestPrice = Math.min(...compareList.map((v) => priceNum(v.price)));
  const highestRating = Math.max(...compareList.map((v) => v.rating));
  const mostExp = Math.max(...compareList.map((v) => parseInt(v.experience)));

  const rows = [
    { label: "Service", get: (v) => <span className="font-semibold">{v.service}</span> },
    {
      label: "Experience",
      get: (v) => (
        <span className={`font-semibold ${parseInt(v.experience) === mostExp ? "text-success" : ""}`}>
          {v.experience} {parseInt(v.experience) === mostExp && "🏆"}
        </span>
      ),
    },
    {
      label: "Price",
      get: (v) => (
        <span className={`font-extrabold ${priceNum(v.price) === lowestPrice ? "text-success text-lg" : "text-foreground"}`}>
          {v.price} {priceNum(v.price) === lowestPrice && "💰"}
        </span>
      ),
    },
    {
      label: "Rating",
      get: (v) => (
        <div className="flex items-center gap-2">
          <RatingStars rating={v.rating} />
          {v.rating === highestRating && <span>🌟</span>}
        </div>
      ),
    },
    { label: "Location", get: (v) => v.location },
    { label: "Jobs Done", get: (v) => <span className="font-semibold">{v.completed}+</span> },
    { label: "Top Skill", get: (v) => <span className="text-xs px-2 py-1 rounded-full bg-accent text-accent-foreground font-semibold">{v.skills[0]}</span> },
  ];

  return (
    <div>
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 opacity-60" style={{ backgroundImage: 'var(--gradient-mesh)' }} />
        <div className="container relative py-14 flex items-end justify-between flex-wrap gap-4">
          <div>
            <p className="text-sm font-semibold text-primary mb-2">SIDE-BY-SIDE</p>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">
              Compare <span className="text-gradient">{compareList.length}</span> vendor{compareList.length > 1 && "s"}
            </h1>
            <p className="text-muted-foreground text-sm">Best value, highest rating and most experience are highlighted.</p>
          </div>
          <button
            onClick={clearCompare}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            Clear all
          </button>
        </div>
      </section>

      <div className="container py-10">
        <div className="overflow-x-auto rounded-2xl border border-border/60 bg-card shadow-[var(--shadow-soft)]">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="bg-muted/40">
                <th className="text-left p-5 font-semibold text-xs uppercase tracking-wider text-muted-foreground w-36">
                  Feature
                </th>
                {compareList.map((v) => (
                  <th key={v.id} className="p-5 text-left">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-[image:var(--gradient-hero)] grid place-items-center text-primary-foreground font-bold text-lg shadow-[var(--shadow-soft)]">
                          {v.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-foreground">{v.name}</div>
                          <span className="inline-block mt-0.5 text-xs px-2 py-0.5 rounded-full bg-accent text-accent-foreground font-semibold">
                            {v.service}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleCompare(v)}
                        className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                        aria-label="Remove"
                      >
                        <X className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.label} className={`border-t border-border/40 ${i % 2 ? "bg-muted/20" : ""}`}>
                  <td className="p-5 font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                    {row.label}
                  </td>
                  {compareList.map((v) => (
                    <td key={v.id} className="p-5 text-sm text-foreground">{row.get(v)}</td>
                  ))}
                </tr>
              ))}
              <tr className="border-t border-border/40">
                <td className="p-5"></td>
                {compareList.map((v) => (
                  <td key={v.id} className="p-5">
                    <Link
                      to={`/vendors/${v.id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[image:var(--gradient-hero)] text-primary-foreground text-sm font-bold shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-hover)] hover:scale-105 transition-[var(--transition-smooth)]"
                    >
                      View Details <ArrowRight className="w-4 h-4" />
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 p-5 rounded-2xl bg-accent/50 border border-primary/10 flex items-start gap-3">
          <Trophy className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-accent-foreground">Quick guide</p>
            <p className="text-muted-foreground">💰 = best price · 🌟 = top rating · 🏆 = most experienced</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Compare;
