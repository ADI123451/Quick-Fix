import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X, Wrench, Sparkles, User as UserIcon, Calendar, LogOut, LogIn } from "lucide-react";
import { useCompare } from "../context/CompareContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { compareList } = useCompare();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { to: "/", label: "Home" },
    { to: "/vendors", label: "Vendors" },
    { to: "/compare", label: "Compare" },
  ];

  const initials = user
    ? (user.name || user.email).split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase()
    : "";

  const handleLogout = () => {
    logout();
    toast("Signed out");
    navigate("/");
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-[var(--transition-smooth)] ${
        scrolled ? "glass border-b border-border/60 shadow-[var(--shadow-soft)]" : "bg-transparent"
      }`}
    >
      <nav className="container flex items-center justify-between h-18 py-3">
        <Link to="/" className="flex items-center gap-2.5 font-bold text-xl group">
          <span className="relative grid place-items-center w-10 h-10 rounded-xl bg-[image:var(--gradient-hero)] text-primary-foreground shadow-[var(--shadow-glow)] group-hover:scale-110 transition-[var(--transition-bounce)]">
            <Wrench className="w-5 h-5" />
            <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-rating animate-pulse" />
          </span>
          <span className="text-gradient font-extrabold tracking-tight">Quick Fix</span>
        </Link>

        <ul className="hidden md:flex items-center gap-1 p-1 rounded-full bg-muted/50 border border-border/50">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  `px-5 py-2 rounded-full text-sm font-semibold transition-[var(--transition-smooth)] ${
                    isActive
                      ? "bg-card text-primary shadow-[var(--shadow-soft)]"
                      : "text-foreground/60 hover:text-foreground"
                  }`
                }
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          {compareList.length > 0 && (
            <Link
              to="/compare"
              className="relative px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent/80 transition-colors"
            >
              Compare
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-accent-orange text-accent-orange-foreground text-xs grid place-items-center font-bold">
                {compareList.length}
              </span>
            </Link>
          )}

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-border hover:bg-muted transition-colors">
                  <span className="w-8 h-8 rounded-full bg-[image:var(--gradient-hero)] grid place-items-center text-primary-foreground text-xs font-bold">
                    {initials}
                  </span>
                  <span className="text-sm font-semibold max-w-[120px] truncate">{user.name || "Account"}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <p className="font-semibold truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link to="/profile" className="cursor-pointer"><UserIcon className="w-4 h-4 mr-2" /> Profile</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/my-bookings" className="cursor-pointer"><Calendar className="w-4 h-4 mr-2" /> My bookings</Link></DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                  <LogOut className="w-4 h-4 mr-2" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-border text-sm font-semibold hover:bg-muted transition-colors"
            >
              <LogIn className="w-4 h-4" /> Sign in
            </Link>
          )}

          <Link
            to="/vendors"
            className="px-5 py-2.5 rounded-full bg-[image:var(--gradient-hero)] text-primary-foreground text-sm font-semibold shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-hover)] hover:-translate-y-0.5 transition-[var(--transition-smooth)]"
          >
            Find a Pro
          </Link>
        </div>

        <button
          className="md:hidden p-2 rounded-lg hover:bg-muted"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden glass border-t border-border animate-fade-in">
          <ul className="container py-4 flex flex-col gap-1">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  end={l.to === "/"}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-lg text-sm font-semibold ${
                      isActive ? "bg-accent text-accent-foreground" : "text-foreground/70"
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
            <li className="pt-2 mt-2 border-t border-border">
              {user ? (
                <>
                  <NavLink to="/profile" onClick={() => setOpen(false)} className="block px-4 py-3 rounded-lg text-sm font-semibold text-foreground/70">Profile</NavLink>
                  <NavLink to="/my-bookings" onClick={() => setOpen(false)} className="block px-4 py-3 rounded-lg text-sm font-semibold text-foreground/70">My bookings</NavLink>
                  <button onClick={() => { setOpen(false); handleLogout(); }} className="block w-full text-left px-4 py-3 rounded-lg text-sm font-semibold text-destructive">Sign out</button>
                </>
              ) : (
                <NavLink to="/login" onClick={() => setOpen(false)} className="block px-4 py-3 rounded-lg text-sm font-semibold text-primary">Sign in</NavLink>
              )}
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;
