import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserPlus, Mail, Lock, User, Phone } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      signup(form);
      toast.success("Account created!");
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message);
    } finally { setLoading(false); }
  };

  return (
    <div className="container max-w-md py-16">
      <div className="rounded-2xl bg-card border border-border/60 p-8 shadow-[var(--shadow-soft)]">
        <div className="mb-6 text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-[image:var(--gradient-hero)] grid place-items-center text-primary-foreground mb-4 shadow-[var(--shadow-glow)]">
            <UserPlus className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold">Create your account</h1>
          <p className="text-sm text-muted-foreground">Book pros and track your services.</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Full name</Label>
            <Input id="name" value={form.name} onChange={set("name")} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email" className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Email</Label>
            <Input id="email" type="email" value={form.email} onChange={set("email")} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone" className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> Phone (optional)</Label>
            <Input id="phone" value={form.phone} onChange={set("phone")} placeholder="+91 98765 43210" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password" className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5" /> Password</Label>
            <Input id="password" type="password" value={form.password} onChange={set("password")} required minLength={6} />
          </div>
          <Button type="submit" disabled={loading} className="w-full font-bold">
            {loading ? "Creating…" : "Create account"}
          </Button>
        </form>

        <p className="text-sm text-center mt-5 text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" state={{ from }} className="text-primary font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
