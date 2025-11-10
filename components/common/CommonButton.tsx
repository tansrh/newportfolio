import { ButtonHTMLAttributes, useState } from "react";

export default function CommonButton({ children, style, ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <button
      style={{
        background: "#111",
        color: "#fff",
        border: "1px solid #fff",
        borderRadius: "6px",
        padding: "0.5rem 1.2rem",
        fontWeight: 500,
        fontSize: "1rem",
        cursor: "pointer",
        transition: "background 0.2s, color 0.2s, box-shadow 0.2s",
        boxShadow: isHovered ? "5px 5px 12px rgba(0,0,0,0.18)" : "none",
        ...style
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...rest}
    >
      {children}
    </button>
  );
}
