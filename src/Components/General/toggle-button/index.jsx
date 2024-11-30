import React from 'react';
import './index.scss';

const ToggleButton = ({ label, ...props }) => {
  return (
    <label className='relative flex items-center gap-1 cursor-pointer'>
      <input type='checkbox' className='input' hidden {...props} />
      <span className={`slider ${props.checked ? 'on' : 'off'}`} />
      {label && <span className='inline-block'>{label}</span>}
    </label>
  );
};

export default ToggleButton;