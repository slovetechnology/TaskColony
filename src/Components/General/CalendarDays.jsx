import React, { useState, useEffect } from "react";

const CalendarDays = ({ onSelectDate }) => {
    const date = new Date();
    const currentYear = date.getFullYear();
    const currentMonth = date.getMonth();

    // Function to ensure that the date is in a correct format (YYYY-MM-DD)
    const formatDate = (date) => {
        if (!(date instanceof Date) || isNaN(date)) {
            return null; // Handle invalid date case here
        }
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

    const currentMonthDays = getDaysInMonth(currentYear, currentMonth);

    const [active, setActive] = useState(formatDate(date));

    useEffect(() => {
        onSelectDate(formatDate(active));
    }, [active]);


    const handleDateChange = (value) => {
        setActive(value);
    };

    return (
        <>
            {[...Array(currentMonthDays).keys()].map((index) => {
                const day = index + 1;
                const timeFix = new Date(currentYear, currentMonth, day);

                // Check if the date is valid and not before today
                if (isNaN(timeFix) || timeFix < new Date().setHours(0, 0, 0, 0)) {
                    return null;
                }

                // Get the weekday using toLocaleString
                const momentFix = timeFix.toLocaleString('en-US', { weekday: 'short' });

                return (
                    <div key={`current-${index}`}>
                        <div
                            className={`flex flex-col text-center w-10 h-14 rounded-md cursor-pointer 
                                        ${active === formatDate(timeFix) ? "bg-secondary text-white" : "bg-white"}`}
                            onClick={() => handleDateChange(formatDate(timeFix))}
                        >
                            <label className="pb-1">{momentFix}</label>
                            <button>{day}</button>
                        </div>
                    </div>
                );
            })}
        </>
    );
};

export default CalendarDays;
