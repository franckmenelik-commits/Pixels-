type BadgeVariant = "primary" | "success" | "warning" | "error" | "neutral";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  primary: "bg-[var(--primary)]/20 text-[var(--primary)]",
  success: "bg-[var(--success)]/20 text-[var(--success)]",
  warning: "bg-[var(--warning)]/20 text-[var(--warning)]",
  error: "bg-[var(--error)]/20 text-[var(--error)]",
  neutral: "bg-[var(--text-muted)]/20 text-[var(--text-muted)]",
};

export default function Badge({ variant = "primary", children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantStyles[variant]}`}
    >
      {children}
    </span>
  );
}
