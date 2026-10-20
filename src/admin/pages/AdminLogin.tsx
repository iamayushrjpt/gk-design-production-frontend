import { useState, type FormEvent } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { USE_LIVE_API } from "../../lib/api";
import Button from "../../components/ui/Button";
import { LogIn } from "lucide-react";

export default function AdminLogin() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Already logged in — bounce straight to the dashboard (or wherever they were headed).
  if (user) {
    const redirectTo = (location.state as { from?: string } | null)?.from ?? "/admin";
    return <Navigate to={redirectTo} replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      const redirectTo = (location.state as { from?: string } | null)?.from ?? "/admin";
      navigate(redirectTo, { replace: true });
    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="font-display text-2xl text-ivory">
            GK <span className="text-gold">DESIGN</span>
          </span>
          <p className="text-xs tracking-[0.2em] uppercase text-mist mt-1">Admin Login</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-paper rounded-gk-lg p-6 md:p-8 flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-3 py-2.5 border border-stone-200 rounded-gk-sm text-sm focus-visible:outline-gold"
              autoComplete="username"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Password
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-3 py-2.5 border border-stone-200 rounded-gk-sm text-sm focus-visible:outline-gold"
              autoComplete="current-password"
            />
          </label>

          {error && (
            <p role="alert" className="text-sm text-rust">{error}</p>
          )}

          <Button type="submit" variant="primary" icon={<LogIn size={16} />} disabled={loading} className="justify-center mt-2">
            {loading ? "Signing in…" : "Sign In"}
          </Button>
        </form>

      </div>
    </div>
  );
}
