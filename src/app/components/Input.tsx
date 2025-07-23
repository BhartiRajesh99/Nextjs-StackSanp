"use client";
import React from "react";

function Input(props: any) {
  const { disabled, labelData, value, onChange, type, required=false } = props;
  return (
    <div className="relative my-2">
      <input
        type={type}
        id={labelData}
        name={labelData}
        required={required}
        disabled={disabled}
        className="peer w-full py-2 border-b-1 border-gray-300 focus:outline-none bg-transparent text-gray-900 dark:text-white transition"
        onChange={(e) => onChange(e.target.value)}
        value={value}
      />
      <label
        htmlFor={labelData}
        className={
          `absolute left-0 transition-all text-sm font-medium mb-1 ` +
          (value && value.length > 0
            ? "top-[-0.75rem] text-xs text-amber-500"
            : "top-3 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-amber-500 peer-focus:-top-3 peer-focus:text-xs peer-focus:text-amber-500")
        }
      >
        {labelData}
      </label>
    </div>
  );
}

export default Input;
