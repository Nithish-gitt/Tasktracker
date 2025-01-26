// components/ui/button.js
import React from 'react';
import '../../weeklytasks.css';


export const Button = ({ onClick, children, className, disabled }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md text-white transition ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      disabled={disabled}
      style={{'margin-right':'2px','border-radius':'5px','margin-bottom':'2px,cursor:pointer'}}
    >
      {children}
    </button>
  );
};
