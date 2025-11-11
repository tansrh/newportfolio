import { InputHTMLAttributes, forwardRef } from "react";

interface CommonDateInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  setValue?: (name: string, value: string) => void;
}

const CommonDateInput = forwardRef<HTMLInputElement, CommonDateInputProps>(
  ({ label, style, setValue, ...rest }, ref) => {
    return (
      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
        {label && <span style={{ fontWeight: 500, maxWidth: '50px', width: '100%' }}>{label}</span>}
        <input
          type="date"
          ref={ref}
          style={{
            width: "max-content",
            padding: "0.75rem",
            borderRadius: "4px",
            border: "1px solid #222",
            fontSize: "1rem",
            ...style
          }}
          // onChange={(e) => {
          //   console.log('Date changed:', e.target.value);
          //   if (setValue) {
          //     console.log('Setting value for', rest.name, 'to', e.target.value);
          //     setValue(rest.name || '', e.target.value);
          //   }
          // }}
          {...rest}
        />
      </label>
    );
  }
);

CommonDateInput.displayName = "CommonDateInput";
export default CommonDateInput;
