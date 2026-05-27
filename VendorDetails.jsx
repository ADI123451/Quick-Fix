import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Briefcase, CheckCircle2, Phone, Shield, Award, MessageCircle, Calendar } from "lucide-react";
import { toast } from "sonner";
import { vendors } from "../data/vendors";
import RatingStars from "../components/RatingStars";
import BookingDialog from "../components/BookingDialog";
import ReviewsSection from "../components/ReviewsSection";
import { useAuth } from "../context/AuthContext";

const DEMO_PHONE = "+91 98765 43210";

const VendorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const vendor = vendors.find((v) => v.id === Number(id));
  const [bookingOpen, setBookingOpen] = useState(false);

  const requireAuth = (cb) => {
    if (!user) {
      toast("Please sign in to continue");
      navigate("/login", { state: { from: `/vendors/${id}` } });
      return;
    }
    cb();
  };

  const handleCall = () => {
    navigator.clipboard?.writeText(DEMO_PHONE);
    toast.success(`Calling ${vendor?.name}…`, {
      description: `Demo number ${DEMO_PHONE} copied to clipboard`,
    });
  };

  if (!vendor) {
    return (
      <div className="container py-20 text-center">
        <p className="text-6xl mb-4">😕</p>
        <h1 className="text-2xl font-bold mb-2">Vendor not found</h1>
        <p className="text-muted-foreground mb-6">The pro you're looking for doesn't exist.</p>
        <Link to="/vendors" className="inline-block px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold">
          ← Back to vendors
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 opacity-60" style={{ backgroundImage: 'var(--gradient-mesh)' }} />
        <div className="container relative pt-8 pb-16">
          <Link to="/vendors" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to all vendors
          </Link>

          <div className="flex flex-col md:flex-row items-start gap-6 animate-fade-up">
            <div className="relative shrink-0">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-3xl bg-[image:var(--gradient-hero)] grid place-items-center text-primary-foreground text-4xl font-extrabold shadow-[var(--shadow-glow)]">
                {vendor.name.charAt(0)}
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-success border-4 border-background grid place-items-center">
                <CheckCircle2 className="w-4 h-4 text-white" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs px-2.5 py-1 rounded-full bg-accent text-accent-foreground font-bold">
                  {vendor.service}
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-success/10 text-success font-bold flex items-center gap-1">
                  <Shield className="w-3 h-3" /> Verified
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-3">{vendor.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <RatingStars rating={vendor.rating} />
                <span>·</span>
                <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" /> {vendor.experience}</span>
                <span>·</span>
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {vendor.location}</span>
                <span>·</span>
                <span className="flex items-center gap-1.5"><Award className="w-4 h-4" /> {vendor.completed}+ jobs</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container py-10">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl bg-card border border-border/60 p-7 shadow-[var(--shadow-soft)] animate-fade-up">
              <h2 className="text-lg font-bold mb-3">About</h2>
              <p className="text-foreground/80 leading-relaxed">{vendor.description}</p>
            </div>

            <div className="rounded-2xl bg-card border border-border/60 p-7 shadow-[var(--shadow-soft)] animate-fade-up delay-100">
              <h2 className="text-lg font-bold mb-4">Skills & Expertise</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {vendor.skills.map((s) => (
                  <div key={s} className="flex items-center gap-3 p-3 rounded-xl bg-muted/40">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 grid place-items-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium">{s}</span>
                  </div>
                ))}
            </div>

            <ReviewsSection vendor={vendor} />
          </div>

            <div className="grid sm:grid-cols-3 gap-4 animate-fade-up delay-200">
              {[
                { label: "Experience", value: vendor.experience, icon: Briefcase },
                { label: "Rating", value: `${vendor.rating}/5`, icon: Award },
                { label: "Jobs done", value: `${vendor.completed}+`, icon: CheckCircle2 },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl bg-card border border-border/60 p-5 shadow-[var(--shadow-soft)]">
                  <s.icon className="w-5 h-5 text-primary mb-2" />
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="text-xl font-extrabold text-gradient">{s.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="rounded-2xl bg-card border border-border/60 p-7 shadow-[var(--shadow-soft)] h-fit lg:sticky lg:top-24 animate-fade-up delay-100">
            <p className="text-sm text-muted-foreground">Starting from</p>
            <p className="text-5xl font-extrabold text-gradient mb-1">{vendor.price}</p>
            <p className="text-xs text-muted-foreground mb-6">per visit · charges may vary by job</p>

            <div className="space-y-2.5">
              <button
                onClick={handleCall}
                className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-[image:var(--gradient-hero)] text-primary-foreground font-bold shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-hover)] hover:scale-[1.02] transition-[var(--transition-smooth)]"
              >
                <Phone className="w-4 h-4" /> Contact · {DEMO_PHONE}
              </button>
              <button
                onClick={() => requireAuth(() => setBookingOpen(true))}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-accent text-accent-foreground font-semibold hover:bg-accent/80 transition-colors"
              >
                <Calendar className="w-4 h-4" /> Book a slot
              </button>
              <button
                onClick={() => toast("Message sent (demo)", { description: `${vendor.name} will reply on ${DEMO_PHONE}` })}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-border font-semibold hover:bg-muted transition-colors"
              >
                <MessageCircle className="w-4 h-4" /> Send message
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-border space-y-3 text-sm">
              <div className="flex items-center gap-2 text-success">
                <Shield className="w-4 h-4" />
                <span className="font-semibold">Verified professional</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle2 className="w-4 h-4" />
                <span>Background checked</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Award className="w-4 h-4" />
                <span>Top-rated in area</span>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <BookingDialog open={bookingOpen} onOpenChange={setBookingOpen} vendor={vendor} />
    </div>
  );
};

export default VendorDetails;
