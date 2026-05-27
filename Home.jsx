import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShieldCheck, Clock, Award, Star, ArrowRight, Sparkles, Users, CheckCircle2 } from "lucide-react";
import { categories, vendors } from "../data/vendors";
import VendorCard from "../components/VendorCard";

const Home = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/vendors${query ? `?q=${encodeURIComponent(query)}` : ""}`);
  };

  const featured = vendors.slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage: 'var(--gradient-mesh)' }} />
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)', backgroundSize: '32px 32px' }} />

        <div className="container relative py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent border border-primary/20 text-accent-foreground text-xs font-semibold mb-6 animate-fade-up">
              <Sparkles className="w-3.5 h-3.5" />
              Trusted by 10,000+ happy customers
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.05] tracking-tight mb-6 animate-fade-up delay-100">
              Find <span className="text-gradient animate-gradient bg-[image:var(--gradient-hero)] bg-clip-text text-transparent">trusted</span><br />
              service providers
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-up delay-200">
              Compare verified electricians, plumbers, carpenters & technicians by price,
              experience and ratings — all in one place.
            </p>

            <form
              onSubmit={handleSearch}
              className="max-w-2xl mx-auto flex items-center bg-card rounded-2xl p-2 shadow-[var(--shadow-hover)] border border-border/60 animate-fade-up delay-300"
            >
              <div className="flex items-center flex-1 gap-2 pl-4">
                <Search className="w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="What service do you need today?"
                  className="flex-1 px-2 py-3 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[image:var(--gradient-hero)] text-primary-foreground font-semibold shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-hover)] hover:scale-[1.02] transition-[var(--transition-smooth)]"
              >
                Search
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mt-14 animate-fade-up delay-400">
              {[
                { icon: Users, value: "10K+", label: "Happy customers" },
                { icon: CheckCircle2, value: "500+", label: "Verified pros" },
                { icon: Star, value: "4.8", label: "Average rating" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <s.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                  <p className="text-2xl md:text-3xl font-extrabold text-gradient">{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container py-20">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <p className="text-sm font-semibold text-primary mb-2">CATEGORIES</p>
            <h2 className="text-3xl md:text-4xl font-extrabold">Browse by service</h2>
          </div>
          <Link to="/vendors" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {categories.map((c, i) => (
            <Link
              key={c.name}
              to={`/vendors?category=${c.name}`}
              className="group relative rounded-2xl bg-card border border-border/60 p-6 overflow-hidden shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-hover)] hover:-translate-y-2 transition-[var(--transition-smooth)] animate-fade-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br ${c.color} opacity-20 blur-2xl group-hover:opacity-40 transition-opacity`} />
              <div className={`relative inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br ${c.color} text-white text-2xl items-center justify-center mb-4 shadow-[var(--shadow-soft)] group-hover:scale-110 group-hover:rotate-3 transition-[var(--transition-bounce)]`}>
                {c.icon}
              </div>
              <h3 className="font-bold text-foreground mb-1">{c.name}</h3>
              <p className="text-xs text-muted-foreground flex items-center gap-1 group-hover:text-primary transition-colors">
                Find pros <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Why us */}
      <section className="container py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-sm font-semibold text-primary mb-2">WHY QUICK FIX</p>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">A better way to hire pros</h2>
          <p className="text-muted-foreground">Everything you need to find, compare and book the right service provider.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: ShieldCheck, title: "Verified Pros", desc: "Every professional is background-checked and reviewed by real users in your area.", color: "from-emerald-400 to-teal-600" },
            { icon: Clock, title: "Quick Booking", desc: "Find and contact a trusted pro in just a few clicks — no calls, no waiting.", color: "from-violet-500 to-indigo-600" },
            { icon: Award, title: "Best Prices", desc: "Compare vendors side-by-side, see real pricing and pick what fits your budget.", color: "from-orange-400 to-red-500" },
          ].map((f, i) => (
            <div
              key={f.title}
              className="group relative rounded-2xl bg-card border border-border/60 p-8 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-hover)] transition-[var(--transition-smooth)] animate-fade-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className={`inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} text-white items-center justify-center mb-5 shadow-[var(--shadow-soft)]`}>
                <f.icon className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-xl mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured vendors */}
      <section className="container py-20">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <p className="text-sm font-semibold text-primary mb-2">TOP RATED</p>
            <h2 className="text-3xl md:text-4xl font-extrabold">Featured professionals</h2>
          </div>
          <Link to="/vendors" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
            See all vendors <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((v, i) => (
            <VendorCard key={v.id} vendor={v} index={i} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container py-20">
        <div className="relative overflow-hidden rounded-3xl bg-[image:var(--gradient-hero)] p-10 md:p-16 text-center text-primary-foreground shadow-[var(--shadow-hover)]">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
          <div className="relative">
            <Sparkles className="w-10 h-10 mx-auto mb-4 animate-float" />
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4">Ready to fix it quick?</h2>
            <p className="text-lg opacity-90 max-w-xl mx-auto mb-8">
              Browse hundreds of trusted professionals and book the perfect one for your job today.
            </p>
            <Link
              to="/vendors"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-card text-foreground font-bold shadow-[var(--shadow-hover)] hover:scale-105 transition-[var(--transition-smooth)]"
            >
              Browse all vendors <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
