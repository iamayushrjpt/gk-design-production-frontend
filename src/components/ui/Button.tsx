import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "outline-dark" | "outline-light" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  icon?: ReactNode;
  as?: "button" | "a";
  href?: string;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-gold text-ink hover:bg-gold-deep",
  "outline-dark":
    "border border-ink text-ink hover:bg-ink hover:text-ivory bg-transparent",
  "outline-light":
    "border border-ivory/50 text-ivory hover:bg-ivory hover:text-ink bg-transparent",
  ghost:
    "text-ink hover:text-gold-deep bg-transparent",
};

export default function Button({
  variant = "primary",
  icon,
  children,
  className = "",
  as = "button",
  href,
  ...props
}: ButtonProps) {
  const classes = `inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium tracking-wide uppercase rounded-gk-sm transition-colors duration-200 cursor-pointer ${variantClasses[variant]} ${className}`;

  if (as === "a" && href) {
    return (
      <a href={href} className={classes}>
        {children}
        {icon}
      </a>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
      {icon}
    </button>
  );
}
