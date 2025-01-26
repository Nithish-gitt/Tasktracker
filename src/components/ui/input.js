// components/ui/input.js
import React from 'react';
import '../../weeklytasks.css';


export const Input = ({ type, placeholder, value, onChange, className, disabled }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${disabled ? 'bg-gray-200 cursor-not-allowed' : ''} ${className}`}
      disabled={disabled}
    />
  );
};
