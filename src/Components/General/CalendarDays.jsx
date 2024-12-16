import React, { useState, useEffect } from "react";
import moment from "moment";

const CalendarDays = ({ onSelectDate }) => {
    const date = new Date();
    const currentYear = date.getFullYear();
    const currentMonth = date.getMonth();
    const currentDate = date.getDate();

    const getDaysInMonth = (year, month) =>
        new Date(year, month + 1, 0).getDate();

    const currentMonthDays = getDaysInMonth(currentYear, currentMonth);
    
    const [active, setActive] = useState(moment(date).format('YYYY-MM-DD'));

    useEffect(() => {
        onSelectDate(moment(active).format('MM-DD-YYYY'));
    }, [active, onSelectDate]);

    const handleDateChange = (value) => {
        setActive(value);
        onSelectDate(moment(value).format('MM-DD-YYYY'));
    };

    return (
        <>
            {[...Array(currentMonthDays).keys()].map((index) => {
                const day = index + 1;
                const timeFix = `${currentYear}-${currentMonth + 1}-${day}`;
                const dataToSet = moment(timeFix).format("YYYY-MM-DD");

                // Prevent showing past dates
                if (moment(dataToSet).isBefore(moment(), 'day')) {
                    return null; // Skip past dates
                }

                const momentFix = moment(dataToSet).format("ddd");

                return (
                    <div key={`current-${index}`}>
                        <div className={`flex flex-col text-center w-10 h-14 rounded-md ${active === dataToSet ? "bg-secondary text-white" : "bg-white"}`} onClick={() => handleDateChange(dataToSet)}>
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