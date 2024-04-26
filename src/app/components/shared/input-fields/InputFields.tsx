import React, { ChangeEvent, ReactNode } from "react";

interface InputFieldProps {
  css?: string;
  label?: string;
  placeholder?: string;
  inputType?: string;
  borderColor?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  value?: string | number;
  name?: string;
  disabled?: boolean;
  error?: string; // Add error prop
}

const InputField: React.FC<InputFieldProps> = ({
  css,
  label,
  placeholder,
  inputType,
  onChange,
  value,
  name,
  disabled,
  error, // Destructure error prop
}) => {
  return (
    <div className="">
      {label && (
        <label htmlFor={name} className="text-nrvGreyBlack mb-2 text-sm">
          {label}
        </label>
      )}
      <div
        className={`${css} border ${
          error ? "border-red-500" : "border-nrvLightGrey"
        } mt-2 relative flex items-center cursor-pointer rounded-lg overflow-hidden  focus:outline-none cursor-pointer `}
      >
        <input
          type={inputType ? inputType : "text"}
          id={name}
          name={name}
          placeholder={placeholder}
          className={`font-light w-full h-11 px-3 py-2 cursor-pointer focus:outline-none text-sm ${
            error ? "text-red-500" : ""
          }`} // Conditionally apply error color
          onChange={onChange}
          value={value}
          disabled={disabled}
        />
      </div>
      {error && <div className="text-red-500 text-sm mt-1">{error}</div>} {/* Render error message */}
    </div>
  );
};

export default InputField;
