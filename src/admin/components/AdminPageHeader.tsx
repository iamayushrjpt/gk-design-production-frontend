import type { ReactNode } from "react";

export default function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
      <div>
        <h1 className="font-display text-2xl md:text-3xl text-ink">{title}</h1>
        {description && <p className="text-sm text-stone mt-1">{description}</p>}
      </div>
      {action}
    </div>
  );
}
