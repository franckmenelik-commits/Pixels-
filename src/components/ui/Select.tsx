import { SelectHTMLAttributes } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
}

export default function Select({ label, options, error, className = "", id, ...rest }: SelectProps) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-sm text-[var(--text-muted)]">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`bg-[var(--surface)] border border-[rgba(108,92,231,0.2)] rounded-lg px-4 py-2.5 text-[var(--text)] focus:outline-none focus:border-[var(--primary)] transition-colors appearance-none ${error ? "border-[var(--error)]" : ""} ${className}`}
        {...rest}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="text-sm text-[var(--error)]">{error}</span>}
    </div>
  );
}
