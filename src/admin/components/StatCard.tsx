import type { LucideIcon } from "lucide-react";

export default function StatCard({
  icon: Icon,
  label,
  value,
  trend,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: string;
}) {
  return (
    <div className="bg-paper rounded-gk-lg p-6 shadow-gk-soft flex flex-col gap-3">
      <div className="w-10 h-10 rounded-gk-sm bg-gold-mist flex items-center justify-center">
        <Icon size={18} className="text-gold-deep" />
      </div>
      <div>
        <span className="font-display text-2xl text-ink">{value}</span>
        <p className="text-xs text-stone mt-0.5">{label}</p>
      </div>
      {trend && <span className="text-xs text-sage">{trend}</span>}
    </div>
  );
}
