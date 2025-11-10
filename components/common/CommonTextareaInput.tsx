import { TextareaHTMLAttributes, ReactNode } from "react";

interface CommonTextareaInputProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: ReactNode;
}

export default function CommonTextareaInput({ label, style, ...rest }: CommonTextareaInputProps) {
  return (
    <div style={{ width: "100%"}}>
      {label && (
        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", fontSize: "1rem", color: "#222" }}>
          {label}
        </label>
      )}
      <textarea
        rows={10}
        style={{
          width: "100%",
          minHeight: "80px",
          padding: "0.75rem",
          borderRadius: "4px",
          border: "1px solid #222",
          fontSize: "1rem",
          resize: "vertical",
          ...style
        }}
        {...rest}
      />
    </div>
  );
}
