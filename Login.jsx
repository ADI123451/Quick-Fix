import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogIn, Mail, Lock, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const fillDemo = () => {
    setEmail("demo@quickfix.app");
    setPassword("demo1234");
    toast("Demo credentials filled — sign up first if this is your first time.");
  };

  const submit = (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      login({ email, password });
      toast.success("Welcome back!");
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
            <LogIn className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold">Welcome back</h1>
          <p className="text-sm text-muted-foreground">Sign in to manage your bookings.</p>
        </div>

        <Button type="button" variant="outline" onClick={fillDemo} className="w-full gap-2 mb-4">
          <Sparkles className="w-4 h-4" /> Use demo credentials
        </Button>

        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password" className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5" /> Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <Button type="submit" disabled={loading} className="w-full font-bold">
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <p className="text-sm text-center mt-5 text-muted-foreground">
          New here?{" "}
          <Link to="/signup" state={{ from }} className="text-primary font-semibold hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
