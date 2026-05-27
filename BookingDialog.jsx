import { useEffect, useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, CheckCircle2, Phone, User, MapPin, Clock, Sparkles, Copy } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAuth } from "@/context/AuthContext";
import { useBookings } from "@/context/BookingsContext";

const TIME_SLOTS = [
  "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM",
  "06:00 PM", "07:00 PM",
];

// Demo number for the project — clearly fake (Indian DNS / non-routable range)
const DEMO_PHONE = "+91 98765 43210";

const genBookingId = () =>
  "QF-" + Math.random().toString(36).slice(2, 7).toUpperCase() + "-" + Date.now().toString().slice(-4);

const BookingDialog = ({ open, onOpenChange, vendor }) => {
  const { user } = useAuth();
  const { addBooking } = useBookings();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState();
  const [slot, setSlot] = useState("");
  const [confirmation, setConfirmation] = useState(null);

  // Auto-fill from profile when the dialog opens
  useEffect(() => {
    if (open && user) {
      setName((n) => n || user.name || "");
      setPhone((p) => p || user.phone || "");
      setAddress((a) => a || user.address || "");
    }
  }, [open, user]);

  // Gate the dialog: redirect to login if not signed in
  useEffect(() => {
    if (open && !user) {
      onOpenChange(false);
      toast("Please sign in to book a pro");
      navigate("/login", { state: { from: `/vendors/${vendor?.id}` } });
    }
  }, [open, user, vendor, navigate, onOpenChange]);

  const reset = () => {
    setStep(1);
    setName(""); setPhone(""); setAddress(""); setNotes("");
    setDate(undefined); setSlot("");
    setConfirmation(null);
  };

  const handleClose = (next) => {
    if (!next) setTimeout(reset, 200);
    onOpenChange(next);
  };

  const fillDemo = () => {
    setName(user?.name || "Demo User");
    setPhone(user?.phone || DEMO_PHONE);
    setAddress(user?.address || ("12, MG Road, " + (vendor?.location || "Mumbai")));
    setNotes("Need urgent help — please bring standard tools.");
    toast.success("Demo details filled");
  };

  const validateStep1 = () => {
    if (!name.trim()) return "Please enter your name";
    if (!/^[+\d][\d\s-]{8,}$/.test(phone.trim())) return "Enter a valid phone number";
    if (!address.trim()) return "Please enter a service address";
    return null;
  };

  const validateStep2 = () => {
    if (!date) return "Pick a service date";
    if (!slot) return "Pick a time slot";
    return null;
  };

  const next = () => {
    const err = validateStep1();
    if (err) { toast.error(err); return; }
    setStep(2);
  };

  const confirm = () => {
    const err = validateStep2();
    if (err) { toast.error(err); return; }
    const booking = {
      id: genBookingId(),
      vendorId: vendor.id,
      vendor: vendor.name,
      service: vendor.service,
      price: vendor.price,
      name, phone, address, notes,
      date: format(date, "EEE, dd MMM yyyy"),
      slot,
    };
    addBooking(booking);
    setConfirmation(booking);
    setStep(3);
    toast.success("Booking confirmed!", {
      description: `${booking.id} · ${booking.date} at ${booking.slot}`,
    });
  };

  const copyId = () => {
    navigator.clipboard?.writeText(confirmation.id);
    toast("Booking ID copied");
  };

  if (!vendor) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-extrabold">
            {step === 3 ? "Booking confirmed 🎉" : `Book ${vendor.name}`}
          </DialogTitle>
          <DialogDescription>
            {step === 3
              ? "We've notified the pro. They'll call you to confirm shortly."
              : `${vendor.service} · Starting ${vendor.price} · ${vendor.location}`}
          </DialogDescription>
        </DialogHeader>

        {/* Stepper */}
        {step !== 3 && (
          <div className="flex items-center gap-2 text-xs font-semibold mb-2">
            {[1, 2].map((n) => (
              <div key={n} className="flex items-center gap-2 flex-1">
                <div className={cn(
                  "w-7 h-7 rounded-full grid place-items-center transition-colors",
                  step >= n ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}>{n}</div>
                <span className={step >= n ? "text-foreground" : "text-muted-foreground"}>
                  {n === 1 ? "Your details" : "Date & time"}
                </span>
                {n === 1 && <div className="flex-1 h-px bg-border ml-2" />}
              </div>
            ))}
          </div>
        )}

        {/* Step 1 — details */}
        {step === 1 && (
          <div className="space-y-4">
            <Button type="button" variant="outline" onClick={fillDemo} className="w-full gap-2">
              <Sparkles className="w-4 h-4" /> Fill demo details
            </Button>

            <div className="space-y-1.5">
              <Label htmlFor="name" className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Full name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ravi Kumar" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone" className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> Phone</Label>
              <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={DEMO_PHONE} />
              <p className="text-[11px] text-muted-foreground">Demo only — no real SMS will be sent.</p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="address" className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Service address</Label>
              <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="House / street, area, city" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="Tell the pro what to expect…" />
            </div>

            <Button onClick={next} className="w-full font-bold">Continue</Button>
          </div>
        )}

        {/* Step 2 — schedule */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5"><CalendarIcon className="w-3.5 h-3.5" /> Service date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Time slot</Label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {TIME_SLOTS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSlot(s)}
                    className={cn(
                      "px-2 py-2 rounded-lg text-xs font-semibold border-2 transition-colors",
                      slot === s
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:border-primary/50 text-foreground"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-muted/40 p-3 text-xs space-y-1">
              <p><span className="text-muted-foreground">Pro:</span> <strong>{vendor.name}</strong></p>
              <p><span className="text-muted-foreground">For:</span> {name} · {phone}</p>
              <p><span className="text-muted-foreground">Where:</span> {address}</p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">Back</Button>
              <Button onClick={confirm} className="flex-1 font-bold">Confirm booking</Button>
            </div>
          </div>
        )}

        {/* Step 3 — success */}
        {step === 3 && confirmation && (
          <div className="space-y-4 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-success/10 grid place-items-center">
              <CheckCircle2 className="w-9 h-9 text-success" />
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 text-left space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Booking ID</p>
                  <p className="font-mono text-lg font-bold">{confirmation.id}</p>
                </div>
                <Button size="sm" variant="outline" onClick={copyId} className="gap-1.5">
                  <Copy className="w-3.5 h-3.5" /> Copy
                </Button>
              </div>
              <div className="h-px bg-border" />
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Pro</p>
                  <p className="font-semibold">{confirmation.vendor}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Service</p>
                  <p className="font-semibold">{confirmation.service}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">When</p>
                  <p className="font-semibold">{confirmation.date}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Time</p>
                  <p className="font-semibold">{confirmation.slot}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground">Address</p>
                  <p className="font-semibold">{confirmation.address}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground">Contact</p>
                  <p className="font-semibold">{confirmation.name} · {confirmation.phone}</p>
                </div>
              </div>
            </div>

            <Button onClick={() => handleClose(false)} className="w-full font-bold">Done</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;
