import { type ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  LayoutTemplate,
  Image as ImageIcon,
  MessageCircle,
  Settings,
  ExternalLink,
  LogOut,
} from "lucide-react";
import { useAuth } from "./AuthContext";

const navItems = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/categories", label: "Categories", icon: FolderTree },
  { to: "/admin/homepage", label: "Homepage CMS", icon: LayoutTemplate },
  { to: "/admin/media", label: "Media Library", icon: ImageIcon },
  { to: "/admin/inquiries", label: "Inquiries", icon: MessageCircle },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen flex bg-ivory">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 bg-ink text-ivory p-6">
        <div className="flex flex-col leading-none mb-10">
          <span className="font-display text-xl">
            GK <span className="text-gold">DESIGN</span>
          </span>
          <span className="text-[10px] tracking-[0.2em] uppercase text-mist mt-1">Admin</span>
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-gk-sm text-sm transition-colors ${
                  isActive ? "bg-gold text-ink font-medium" : "text-mist hover:bg-ink-soft hover:text-ivory"
                }`
              }
            >
              <item.icon size={17} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-3 pt-6">
          {user && (
            <div className="flex items-center justify-between text-xs text-mist">
              <span className="truncate">{user.name}</span>
              <button onClick={handleLogout} aria-label="Log out" className="flex items-center gap-1 hover:text-gold transition-colors shrink-0">
                <LogOut size={13} /> Logout
              </button>
            </div>
          )}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-mist hover:text-gold transition-colors"
          >
            <ExternalLink size={14} /> View live site
          </a>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden flex flex-col bg-ink text-ivory">
          <div className="flex items-center justify-between px-4 py-4">
            <span className="font-display text-lg">GK <span className="text-gold">DESIGN</span> Admin</span>
          </div>
          <nav className="flex gap-1 px-3 pb-3 overflow-x-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `shrink-0 px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors ${
                    isActive ? "bg-gold text-ink font-medium" : "text-mist bg-ink-soft"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </header>
        <main className="flex-1 p-6 md:p-10 overflow-x-auto">{children}</main>
      </div>
    </div>
  );
}
