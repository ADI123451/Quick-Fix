import { Wrench, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="relative mt-24 border-t border-border bg-card overflow-hidden">
    <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ backgroundImage: 'var(--gradient-mesh)' }} />
    <div className="container relative py-14">
      <div className="grid md:grid-cols-4 gap-10 mb-10">
        <div className="md:col-span-2">
          <Link to="/" className="flex items-center gap-2.5 mb-4">
            <span className="grid place-items-center w-10 h-10 rounded-xl bg-[image:var(--gradient-hero)] text-primary-foreground">
              <Wrench className="w-5 h-5" />
            </span>
            <span className="text-xl font-extrabold text-gradient">Quick Fix</span>
          </Link>
          <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
            Your trusted marketplace for verified electricians, plumbers, carpenters, and technicians.
            Compare, choose, and book the best pros — all in one place.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-sm">Quick Links</h4>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
            <li><Link to="/vendors" className="hover:text-primary transition-colors">Browse Vendors</Link></li>
            <li><Link to="/compare" className="hover:text-primary transition-colors">Compare</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-sm">Contact</h4>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> hello@quickfix.app</li>
            <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> +91 90000 00000</li>
            <li className="flex items-center gap-2"><MapPin className="w-4 h-4" /> India</li>
          </ul>
        </div>
      </div>

      <div className="pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} Quick Fix. A college project demo.</p>
        <p>Built with React · Designed with care</p>
      </div>
    </div>
  </footer>
);

export default Footer;
