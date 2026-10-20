export default function ComingSoon({ title }: { title: string }) {
  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-32 text-center flex flex-col items-center gap-4">
      <span className="text-xs tracking-[0.2em] uppercase text-gold-deep">Gk Design</span>
      <h1 className="font-display text-4xl text-ink">{title}</h1>
      <p className="text-stone text-sm max-w-md">
        This page is scoped in the sitemap and will be built out in the next
        phase, following the same design system as the homepage.
      </p>
    </div>
  );
}
