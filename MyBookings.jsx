import { Link } from "react-router-dom";
import { Calendar, MapPin, Phone, X, CheckCircle2, ArrowRight, Clock } from "lucide-react";
import { toast } from "sonner";
import { useBookings } from "../context/BookingsContext";
import { Button } from "@/components/ui/button";

const STATUS_STYLES = {
  confirmed: "bg-primary/10 text-primary",
  completed: "bg-success/10 text-success",
  cancelled: "bg-destructive/10 text-destructive",
};

const MyBookings = () => {
  const { bookings, cancelBooking, completeBooking } = useBookings();

  if (!bookings.length) {
    return (
      <div className="container max-w-2xl py-20 text-center">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-muted grid place-items-center mb-4">
          <Calendar className="w-7 h-7 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-extrabold mb-2">No bookings yet</h1>
        <p className="text-muted-foreground mb-6">Find a pro and book your first service.</p>
        <Link to="/vendors" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[image:var(--gradient-hero)] text-primary-foreground font-bold shadow-[var(--shadow-soft)]">
          Browse vendors <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold">My bookings</h1>
        <p className="text-muted-foreground">{bookings.length} total · manage and review your services</p>
      </div>

      <div className="space-y-4">
        {bookings.map((b) => (
          <div key={b.id} className="rounded-2xl bg-card border border-border/60 p-5 shadow-[var(--shadow-soft)]">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${STATUS_STYLES[b.status]}`}>
                    {b.status}
                  </span>
                  <span className="text-[11px] font-mono text-muted-foreground">{b.id}</span>
                </div>
                <h3 className="text-lg font-bold">
                  <Link to={`/vendors/${b.vendorId}`} className="hover:text-primary">{b.vendor}</Link>
                </h3>
                <p className="text-xs text-muted-foreground">{b.service} · {b.price}</p>
              </div>
              <div className="flex gap-2">
                {b.status === "confirmed" && (
                  <>
                    <Button size="sm" variant="outline" onClick={() => { completeBooking(b.id); toast.success("Marked completed — you can review now"); }} className="gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Mark done
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => { cancelBooking(b.id); toast("Booking cancelled"); }} className="gap-1.5 text-destructive hover:text-destructive">
                      <X className="w-3.5 h-3.5" /> Cancel
                    </Button>
                  </>
                )}
                {b.status === "completed" && (
                  <Link to={`/vendors/${b.vendorId}#reviews`} className="text-xs font-semibold text-primary hover:underline self-center">
                    Leave a review →
                  </Link>
                )}
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-3 text-xs text-muted-foreground border-t border-border/60 pt-3">
              <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {b.date}</span>
              <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {b.slot}</span>
              <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {b.phone}</span>
              <span className="sm:col-span-3 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {b.address}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookings;
