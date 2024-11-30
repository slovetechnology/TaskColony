import React, { useState } from 'react';
import { SlArrowDown, SlArrowUp } from 'react-icons/sl';

const CustomDropdown = ({ options = [] }) => {
  const [selectedOption, setSelectedOption] = useState(options[0]?.label || '');
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option) => {
    setSelectedOption(option.label);
    setIsOpen(false);
  };

  const selectedIcon = options.find(option => option.label === selectedOption)?.icon;

  return (
    <div className="relative cursor-pointer py-1 border-b px-3 bg-white border">
      <div
        className="text-sm w-full text-light py-4 outline-none rounded-lg flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex items-center">
          {selectedIcon}
          {selectedOption}
        </span>
        <span className="text-xs">{isOpen ? <SlArrowUp /> : <SlArrowDown />}</span>
      </div>

      {isOpen && options.length > 0 && (
        <ul className="absolute bg-white border rounded-lg w-full mt-1 -ml-3 z-10">
          {options.map((option) => (
            <li
              key={option.value}
              className="flex items-center py-2 px-3 hover:bg-gray-200 cursor-pointer"
              onClick={() => handleSelect(option)}
            >
              {option.icon}
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomDropdown;