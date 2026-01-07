import React, { useState, useRef, useEffect } from 'react';

export default function SignInputs({ type, name, value, onChange, placeholder, className = "" }) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null); 

  const handleLabelClick = () => {
    inputRef.current.focus();
  };

  useEffect(() => {
    if (value) {
      setIsFocused(true); 
    }
  }, [value]);

  return (
    <div className="relative flex flex-col items-center">
      <input 
        ref={inputRef} 
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(value ? true : false)}
        className={`border-2 border-black text-center w-full h-12 rounded-md shadow-sm transition duration-300 ease-in-out hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent ${className}`} 
        placeholder=" " 
      />
      <label
        onClick={handleLabelClick} 
        className={`absolute top-1/2 transform -translate-y-1/2 cursor-pointer transition-opacity duration-300 ${isFocused || value ? 'opacity-0' : 'opacity-100'}`}
      >
        {placeholder}
      </label>
    </div>
  );
}
