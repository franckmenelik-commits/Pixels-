import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, className = "", id, ...rest }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm text-[var(--text-muted)]">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`bg-[var(--surface)] border border-[rgba(108,92,231,0.2)] rounded-lg px-4 py-2.5 text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] transition-colors ${error ? "border-[var(--error)]" : ""} ${className}`}
        {...rest}
      />
      {error && <span className="text-sm text-[var(--error)]">{error}</span>}
    </div>
  );
}
