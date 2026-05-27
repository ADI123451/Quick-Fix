import { useState } from "react";
import { User, Mail, Phone, MapPin, Save, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useBookings } from "../context/BookingsContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const Profile = () => {
  const { user, updateProfile, logout } = useAuth();
  const { bookings } = useBookings();
  const navigate = useNavigate();

  const [name, setName] = useState(user.name || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [address, setAddress] = useState(user.address || "");
  const [saving, setSaving] = useState(false);

  const initials = (name || user.email).split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase();

  const save = (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      updateProfile({ name: name.trim(), phone: phone.trim(), address: address.trim() });
      toast.success("Profile updated");
    } finally { setSaving(false); }
  };

  const stats = {
    total: bookings.length,
    active: bookings.filter((b) => b.status === "confirmed").length,
    completed: bookings.filter((b) => b.status === "completed").length,
  };

  return (
    <div className="container max-w-3xl py-12">
      <div className="rounded-2xl bg-card border border-border/60 p-8 shadow-[var(--shadow-soft)]">
        <div className="flex items-center gap-5 pb-6 border-b border-border">
          <div className="w-20 h-20 rounded-2xl bg-[image:var(--gradient-hero)] grid place-items-center text-primary-foreground text-2xl font-extrabold shadow-[var(--shadow-glow)]">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-extrabold truncate">{name || "Your name"}</h1>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {user.email}</p>
          </div>
          <Button variant="outline" onClick={() => { logout(); toast("Signed out"); navigate("/"); }} className="gap-2">
            <LogOut className="w-4 h-4" /> Sign out
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-3 my-6">
          {[
            { label: "Total bookings", value: stats.total },
            { label: "Active", value: stats.active },
            { label: "Completed", value: stats.completed },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-muted/40 p-4 text-center">
              <p className="text-2xl font-extrabold text-gradient">{s.value}</p>
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        <form onSubmit={save} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="p-name" className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Full name</Label>
            <Input id="p-name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="p-phone" className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> Phone</Label>
              <Input id="p-phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-address" className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Default address</Label>
              <Input id="p-address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="House / street, city" />
            </div>
          </div>
          <Button type="submit" disabled={saving} className="gap-2 font-bold">
            <Save className="w-4 h-4" /> {saving ? "Saving…" : "Save changes"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
