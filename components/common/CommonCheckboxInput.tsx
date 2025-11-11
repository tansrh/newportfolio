import React, { InputHTMLAttributes, forwardRef } from "react";

interface CommonCheckboxInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  setValue?: (name: string, value: boolean) => void;
}

const CommonCheckboxInput = forwardRef<HTMLInputElement, CommonCheckboxInputProps>(
  ({ label, style, setValue, ...rest }, ref) => {
    return (
      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
        <input
          type="checkbox"
          ref={ref}
          style={{
            accentColor: "#111",
            width: "18px",
            height: "18px",
            marginRight: "0.5rem",
            ...style
          }}
          // onChange={(e) => {
          //   if (setValue) {
          //     setValue(rest.name || '', e.target.checked);
          //   }
          // }}
          {...rest}
        />
        {label && <span>{label}</span>}
      </label>
    );
  }
);

CommonCheckboxInput.displayName = "CommonCheckboxInput";
export default CommonCheckboxInput;
