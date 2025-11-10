import React, { InputHTMLAttributes } from "react";

interface CommonCheckboxInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function CommonCheckboxInput({ label, style, ...rest }: CommonCheckboxInputProps) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
      <input
        type="checkbox"
        style={{
          accentColor: "#111",
          width: "18px",
          height: "18px",
          marginRight: "0.5rem",
          ...style
        }}
        {...rest}
      />
      {label && <span>{label}</span>}
    </label>
  );
}
