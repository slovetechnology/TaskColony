import React, { useState } from 'react';
import { SlArrowDown, SlArrowUp } from 'react-icons/sl';

const AdminDropdown = ({ options = [], onChange }) => {
    const [selectedOption, setSelectedOption] = useState(options[0]?.label || '');
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (option) => {
        setSelectedOption(option.label);
        setIsOpen(false);
        if (onChange) {
            onChange(option); // Pass the selected option to the parent component
        }
    };

    return (
        <div className="relative cursor-pointer border-b px-3 bg-[#F29D8A] border">
            <div
                className="text-sm w-full text-white py-3 outline-none rounded-lg flex justify-between items-center"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="flex items-center">
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
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AdminDropdown;
