import React, { useState, useEffect } from 'react';
import { CiSearch } from 'react-icons/ci';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

const Input = ({
  label,
  labelClass = '',
  inputClass = '',
  type,
  design,
  suffix,
  className = '',
  error,
  ...props
}) => {
  const [inputType, setInputType] = useState(type);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (type === 'password') {
      setInputType(showPassword ? 'text' : 'password');
    }
  }, [showPassword, type]);

  return (
    <div className={className}>
      <label className={`flex flex-col gap-2 relative ${labelClass}`}>
        {label && <span className={labelClass}>{label}</span>}
        {type === 'search' && (
          <span className='absolute top-1/2 -translate-y-1/2 left-2'>
            <CiSearch />
          </span>
        )}
        <input
          {...props}
          type={inputType}
          className={`px-4 py-[11.5px] rounded ${design === 'single-border' ? 'border-b' : 'border'} ${error ? 'border-danger-500' : 'border-secondary-400'} focus:outline-none ${type === 'password' ? 'pr-8' : ''} ${type === 'search' ? 'pl-8' : ''} ${inputClass}`}
        />
        {type === 'password' && (
          <span
            className={`absolute top-1/2 ${suffix ? 'right-8' : 'right-0'} cursor-pointer p-2 transition-all`}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
          </span>
        )}
        {suffix && <span className='absolute top-1/2 right-0'>{suffix}</span>}
      </label>
      {error && <span className='text-danger text-sm'>{error}</span>}
    </div>
  );
};

export default Input;