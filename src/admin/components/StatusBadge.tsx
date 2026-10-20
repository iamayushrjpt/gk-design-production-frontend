const styles: Record<string, string> = {
  Published: "bg-sage/15 text-sage",
  Draft: "bg-stone-200 text-stone",
  Hidden: "bg-stone-200 text-stone",
  Hold: "bg-gold-mist text-gold-deep",
  Archived: "bg-rust/10 text-rust",
  "In Stock": "bg-sage/15 text-sage",
  "Made to Order": "bg-gold-mist text-gold-deep",
  "Out of Stock": "bg-rust/10 text-rust",
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${styles[status] ?? "bg-stone-200 text-stone"}`}>
      {status}
    </span>
  );
}
