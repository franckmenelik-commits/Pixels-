type BadgeVariant = "primary" | "success" | "warning" | "error" | "neutral";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  primary: "bg-[#FF8C45]/10 text-[#FF8C45]",
  success: "bg-[#10B981]/10 text-[#10B981]",
  warning: "bg-[#F59E0B]/10 text-[#92400E]",
  error: "bg-[#EF4444]/10 text-[#EF4444]",
  neutral: "bg-[#6B7280]/10 text-[#6B7280]",
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
