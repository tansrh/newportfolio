// import JoditEditor from "jodit-react";
import dynamic from "next/dynamic";
import { TextareaHTMLAttributes, ReactNode, useRef, useState, forwardRef, useMemo } from "react";
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });
interface CommonTextareaInputProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: ReactNode;
  [key: string]: any;
}

const CommonTextareaInput = forwardRef<any, CommonTextareaInputProps>(({ label, value, onBlur, setValue, onChange, ...rest }, ref) => {
  // return (
  //   <div style={{ width: "100%"}}>
  //     {label && (
  //       <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", fontSize: "1rem", color: "#222" }}>
  //         {label}
  //       </label>
  //     )}
  //     <textarea
  //       rows={10}
  //       style={{
  //         width: "100%",
  //         minHeight: "80px",
  //         padding: "0.75rem",
  //         borderRadius: "4px",
  //         border: "1px solid #222",
  //         fontSize: "1rem",
  //         resize: "vertical",
  //         ...style
  //       }}
  //       {...rest}
  //     />
  //   </div>
  // );

  const config: any = useMemo(() => ({
    readonly: false,
    height: 400,
    toolbarButtonSize: 'middle',
    buttons: "all",
    uploader: {
      insertImageAsBase64URI: true,
    },
  }), []);

  return (
    <>
      {label && (
        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", fontSize: "1rem", color: "#222" }}>
          {label}
        </label>
      )}
      <JoditEditor
        ref={ref}
        value={value}
        config={config}
        tabIndex={1} // tabIndex of textarea

        {...rest}
        // onBlur={newValue => {
        //   // setValue(newValue);
        //   if (typeof window !== "undefined") {
        //     setValue(rest.name, newValue);
        //   }
        //   onChange?.({ target: { value: newValue } } as any);

        // }}
        onChange={newValue => {
          if (typeof window !== "undefined") {
            setValue(rest.name, newValue);
          }
        }}
      />
    </>
  );
});

export default CommonTextareaInput;
