import { InputHTMLAttributes, ReactNode } from "react";

interface CommonTextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
}

export default function CommonTextInput({ label, style, ...rest }: CommonTextInputProps) {
  return (
    <div style={{ width: "100%"}}>
      {label && (
        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", fontSize: "1rem", color: "#222" }}>
          {label}
        </label>
      )}
      <input
        type="text"
        style={{
          width: "100%",
          padding: "0.75rem",
          borderRadius: "4px",
          border: "1px solid #222",
          fontSize: "1rem",
          ...style
        }}
        {...rest}
      />
    </div>
  );
}
