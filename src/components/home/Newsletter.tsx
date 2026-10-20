import { useState, type FormEvent } from "react";
import Button from "../ui/Button";
import { useSectionContent } from "../../lib/useSectionContent";

export default function Newsletter() {
  const { content } = useSectionContent({ type: "newsletter" });
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    try {
      // POST /api/newsletter/subscribe in production
      await new Promise((res) => setTimeout(res, 700));
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="bg-ink">
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-16 text-center flex flex-col items-center gap-5">
        <span className="text-xs tracking-[0.2em] uppercase text-gold">{content.eyebrow || "Stay in the loop"}</span>
        <h2 className="font-display text-3xl md:text-4xl text-ivory">
          {content.title || "New arrivals, before they're gone"}
        </h2>
        <p className="text-sm text-mist max-w-md">
          {content.description || "One email a month. New pieces, restocks, and the occasional workshop tour — nothing else."}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-md pt-2">
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status === "error") setStatus("idle");
            }}
            placeholder="you@email.com"
            className="flex-1 px-4 py-3 rounded-gk-sm bg-ink-soft border border-line-dark text-ivory placeholder:text-mist text-sm focus-visible:outline-gold"
          />
          <Button variant="primary" type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Subscribing…" : "Subscribe"}
          </Button>
        </form>

        <div role="status" aria-live="polite" className="min-h-[20px] text-sm">
          {status === "success" && <span className="text-sage">Subscribed. Watch your inbox.</span>}
          {status === "error" && <span className="text-rust">Enter a valid email address.</span>}
        </div>
      </div>
    </section>
  );
}
