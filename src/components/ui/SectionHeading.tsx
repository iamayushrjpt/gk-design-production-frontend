interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  dark?: boolean;
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  dark = false,
}: SectionHeadingProps) {
  const alignClass = align === "center" ? "text-center items-center mx-auto" : "text-left items-start";

  return (
    <div className={`flex flex-col gap-3 max-w-2xl ${alignClass}`}>
      {eyebrow && (
        <span
          className={`text-xs tracking-[0.2em] uppercase font-medium ${
            dark ? "text-gold" : "text-gold-deep"
          }`}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={`font-display font-medium text-3xl md:text-4xl leading-tight ${
          dark ? "text-ivory" : "text-ink"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p className={`text-base leading-relaxed ${dark ? "text-mist" : "text-stone"}`}>
          {description}
        </p>
      )}
    </div>
  );
}
