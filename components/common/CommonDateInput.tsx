import { InputHTMLAttributes } from "react";

interface CommonDateInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function CommonDateInput({ label, style, ...rest }: CommonDateInputProps) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
      {label && <span style={{ fontWeight: 500, maxWidth: '50px', width: '100%' }}>{label}</span>}
      <input
        type="date"
        style={{
          width: "max-content",
          padding: "0.75rem",
          borderRadius: "4px",
          border: "1px solid #222",
          fontSize: "1rem",
          ...style
        }}
        {...rest}
      />
    </label>
  );
}
