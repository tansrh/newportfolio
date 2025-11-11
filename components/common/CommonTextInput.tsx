import { InputHTMLAttributes, ReactNode, forwardRef } from "react";

interface CommonTextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
  setValue?: (name: string, value: string) => void;
}

const CommonTextInput = forwardRef<HTMLInputElement, CommonTextInputProps>(
  ({ label, style, setValue, ...rest }, ref) => {
    return (
      <div style={{ width: "100%"}}>
        {label && (
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", fontSize: "1rem", color: "#222" }}>
            {label}
          </label>
        )}
        <input
          type="text"
          ref={ref}
          style={{
            width: "100%",
            padding: "0.75rem",
            borderRadius: "4px",
            border: "1px solid #222",
            fontSize: "1rem",
            ...style
          }}
          // onChange={(e) => {
          //   if (setValue) {
          //     setValue(rest.name || '', e.target.value);
          //   }
          // }}
          {...rest}
        />
      </div>
    );
  }
);

CommonTextInput.displayName = "CommonTextInput";
export default CommonTextInput;
