import { useEffect, useRef, useState } from "react";
import { stats } from "../../lib/data";

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1200;
          const start = performance.now();

          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            setDisplay(Number((value * progress).toFixed(value % 1 !== 0 ? 1 : 0)));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={ref} className="font-display text-4xl md:text-5xl text-ink">
      {display}
      {suffix}
    </span>
  );
}

export default function StatsBand() {
  return (
    <section className="border-y border-stone-200 bg-paper">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-14 grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col items-center text-center gap-2">
            <Counter value={s.value} suffix={s.suffix} />
            <span className="text-sm text-stone">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
