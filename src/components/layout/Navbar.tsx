import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Search, Heart, MessageCircle } from "lucide-react";
import { getWhatsAppLink } from "../../lib/whatsapp";
import SearchOverlay from "./SearchOverlay";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Categories", href: "/categories" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // A mobile drawer should never follow the user down the page or trap them
  // behind an open overlay after navigation/keyboard dismissal.
  useEffect(() => {
    setDrawerOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!drawerOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDrawerOpen(false);
    };
    const closeOnScroll = () => setDrawerOpen(false);
    window.addEventListener("keydown", closeOnEscape);
    window.addEventListener("scroll", closeOnScroll, { passive: true });
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("scroll", closeOnScroll);
    };
  }, [drawerOpen]);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-ivory/95 backdrop-blur shadow-gk-soft" : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 h-20">
        <Link to="/" className="flex flex-row items-center gap-2.5 leading-none">
          <img
            src="/gk-design-logo.jpeg"
            alt="GK Design logo"
            className="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-gold-deep/30"
            width={36}
            height={36}
          />
          <span className="font-display text-2xl tracking-wide text-ink">
            GK DESIGN
          </span>
        </Link>

        <ul className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                to={link.href}
                className="text-sm font-medium text-ink hover:text-gold-deep transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-5">
          <button aria-label="Search products" onClick={() => setSearchOpen(true)} className="text-ink hover:text-gold-deep transition-colors">
            <Search size={19} />
          </button>
          <Link to="/wishlist" aria-label="View wishlist" className="text-ink hover:text-gold-deep transition-colors">
            <Heart size={19} />
          </Link>
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#25D366] text-white text-xs font-medium uppercase tracking-wide px-4 py-2.5 rounded-gk-sm hover:bg-[#128C7E] transition-colors"
          >
            <MessageCircle size={15} /> Enquire
          </a>
        </div>

        <div className="flex items-center gap-4 md:hidden">
          <button aria-label="Search products" onClick={() => setSearchOpen(true)} className="text-ink">
            <Search size={21} />
          </button>
          <button
            aria-label={drawerOpen ? "Close menu" : "Open menu"}
            aria-expanded={drawerOpen}
            onClick={() => setDrawerOpen((v) => !v)}
            className="text-ink"
          >
            {drawerOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        aria-hidden={!drawerOpen}
        className={`md:hidden fixed inset-x-0 top-20 bottom-0 bg-ivory z-40 overflow-y-auto overscroll-contain transition-[transform,visibility] duration-300 ${
          drawerOpen ? "translate-x-0 visible" : "translate-x-full invisible"
        }`}
      >
        <ul className="flex flex-col gap-6 px-6 py-10">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                to={link.href}
                onClick={() => setDrawerOpen(false)}
                className="font-display text-2xl text-ink"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              to="/wishlist"
              onClick={() => setDrawerOpen(false)}
              className="flex items-center gap-2 font-display text-2xl text-ink"
            >
              <Heart size={20} /> Wishlist
            </Link>
          </li>
          <li className="pt-4">
            <a
              href={getWhatsAppLink()}
              className="inline-flex items-center gap-2 bg-[#25D366] text-white text-sm font-medium uppercase tracking-wide px-5 py-3 rounded-gk-sm hover:bg-[#128C7E] transition-colors"
            >
              <MessageCircle size={16} /> Enquire on WhatsApp
            </a>
          </li>
        </ul>
      </div>

      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
