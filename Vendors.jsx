import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { vendors, categories } from "../data/vendors";
import VendorCard from "../components/VendorCard";
import Loader from "../components/Loader";
import { useCompare } from "../context/CompareContext";

const Vendors = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";
  const initialQuery = searchParams.get("q") || "";

  const [category, setCategory] = useState(initialCategory);
  const [query, setQuery] = useState(initialQuery);
  const [sort, setSort] = useState("rating");
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(18);
  const { compareList, toggleCompare } = useCompare();

  // Reset pagination whenever filters/search/sort change
  useEffect(() => {
    setVisible(18);
  }, [category, query, sort]);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    let list = vendors.filter((v) => {
      const matchCategory = category === "All" || v.service === category;
      const matchQuery =
        !query ||
        v.name.toLowerCase().includes(query.toLowerCase()) ||
        v.service.toLowerCase().includes(query.toLowerCase()) ||
        v.skills.some((s) => s.toLowerCase().includes(query.toLowerCase()));
      return matchCategory && matchQuery;
    });

    const priceNum = (p) => Number(p.replace(/[^\d]/g, ""));
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    if (sort === "price-low") list = [...list].sort((a, b) => priceNum(a.price) - priceNum(b.price));
    if (sort === "price-high") list = [...list].sort((a, b) => priceNum(b.price) - priceNum(a.price));
    if (sort === "experience") list = [...list].sort((a, b) => parseInt(b.experience) - parseInt(a.experience));
    return list;
  }, [category, query, sort]);

  const filters = ["All", ...categories.map((c) => c.name)];

  return (
    <div>
      {/* Page header */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 opacity-60" style={{ backgroundImage: 'var(--gradient-mesh)' }} />
        <div className="container relative py-14">
          <p className="text-sm font-semibold text-primary mb-2 animate-fade-up">SERVICE PROVIDERS</p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3 animate-fade-up delay-100">
            Browse <span className="text-gradient">verified</span> pros
          </h1>
          <p className="text-muted-foreground max-w-xl animate-fade-up delay-200">
            Filter by category, search by skill, and add up to 3 vendors to compare side-by-side.
          </p>
        </div>
      </section>

      <div className="container py-10">
        {/* Search + sort */}
        <div className="flex flex-col lg:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, service, or skill..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-muted"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>

          <div className="relative flex items-center gap-2 px-4 py-3 rounded-xl border border-border bg-card">
            <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-transparent text-sm font-medium focus:outline-none cursor-pointer pr-4"
            >
              <option value="rating">Top rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="experience">Most experienced</option>
            </select>
          </div>
        </div>

        {/* Category chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 -mx-1 px-1">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setCategory(f)}
              className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-[var(--transition-smooth)] ${
                category === f
                  ? "bg-[image:var(--gradient-hero)] text-primary-foreground shadow-[var(--shadow-soft)]"
                  : "bg-card border border-border hover:border-primary hover:text-primary text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Result count + compare bar */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            <span className="font-bold text-foreground">{filtered.length}</span> pro
            {filtered.length !== 1 && "s"} available
          </p>
          {compareList.length > 0 && (
            <Link
              to="/compare"
              className="px-5 py-2 rounded-full bg-accent-orange text-accent-orange-foreground font-semibold text-sm shadow-[var(--shadow-soft)] hover:scale-105 transition-[var(--transition-smooth)] animate-scale-in"
            >
              Compare ({compareList.length}) →
            </Link>
          )}
        </div>

        {loading ? (
          <Loader />
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 rounded-2xl bg-muted/40 border border-dashed border-border">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-foreground font-semibold mb-1">No matches found</p>
            <p className="text-sm text-muted-foreground">Try a different search or category.</p>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.slice(0, visible).map((v, i) => (
                <VendorCard
                  key={v.id}
                  vendor={v}
                  index={i % 18}
                  onCompare={toggleCompare}
                  isComparing={!!compareList.find((c) => c.id === v.id)}
                />
              ))}
            </div>

            {visible < filtered.length && (
              <div className="flex flex-col items-center gap-3 mt-12">
                <p className="text-xs text-muted-foreground">
                  Showing <span className="font-semibold text-foreground">{visible}</span> of{" "}
                  <span className="font-semibold text-foreground">{filtered.length}</span> pros
                </p>
                <button
                  onClick={() => setVisible((v) => v + 18)}
                  className="px-8 py-3 rounded-full bg-foreground text-background font-semibold text-sm hover:bg-foreground/90 hover:scale-105 transition-[var(--transition-smooth)] shadow-[var(--shadow-soft)]"
                >
                  Load more pros
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Vendors;
