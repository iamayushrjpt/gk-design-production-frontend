import { useEffect, useState } from "react";
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-ivory/95 backdrop-blur shadow-gk-soft" : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 h-20">
        <a href="/" className="flex flex-col leading-none">
          <span className="font-display text-2xl tracking-wide text-ink">
            GK <span className="text-gold-deep">DESIGN</span>
          </span>
        </a>

        <ul className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm font-medium text-ink hover:text-gold-deep transition-colors"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-5">
          <button aria-label="Search products" onClick={() => setSearchOpen(true)} className="text-ink hover:text-gold-deep transition-colors">
            <Search size={19} />
          </button>
          <a href="/wishlist" aria-label="View wishlist" className="text-ink hover:text-gold-deep transition-colors">
            <Heart size={19} />
          </a>
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-ink text-ivory text-xs font-medium uppercase tracking-wide px-4 py-2.5 rounded-gk-sm hover:bg-gold-deep hover:text-ink transition-colors"
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
        className={`md:hidden fixed inset-0 top-20 bg-ivory z-40 transition-transform duration-300 ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <ul className="flex flex-col gap-6 px-6 py-10">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setDrawerOpen(false)}
                className="font-display text-2xl text-ink"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="/wishlist"
              onClick={() => setDrawerOpen(false)}
              className="flex items-center gap-2 font-display text-2xl text-ink"
            >
              <Heart size={20} /> Wishlist
            </a>
          </li>
          <li className="pt-4">
            <a
              href={getWhatsAppLink()}
              className="inline-flex items-center gap-2 bg-ink text-ivory text-sm font-medium uppercase tracking-wide px-5 py-3 rounded-gk-sm"
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
