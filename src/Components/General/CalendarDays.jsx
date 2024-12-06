import React, { useState } from "react";
import moment from "moment";

const CalendarDays = ({ onSelectDate }) => {
    const date = new Date();
    const currentYear = date.getFullYear();
    const currentMonth = date.getMonth();
    const nextMonth = currentMonth + 1 === 12 ? 0 : currentMonth + 1;
    const nextYear = nextMonth === 0 ? currentYear + 1 : currentYear;

    const getDaysInMonth = (year, month) =>
        new Date(year, month + 1, 0).getDate();

    const currentMonthDays = getDaysInMonth(currentYear, currentMonth);
    const daysToShowNextMonth = 7; // Number of days from the next month

    const [active, setActive] = useState(
        `${currentYear}-${currentMonth + 1}-${date.getDate()}`
    );

    const handleDateChange = (value) => {
        setActive(value);
        onSelectDate(value);
    };

    return (
        <>
            {[...Array(currentMonthDays - date.getDate() + 1).keys()].map((index) => {
                const day = date.getDate() + index;
                const timeFix = `${currentYear}-${currentMonth + 1}-${day}`;
                const momentFix = moment(timeFix).format("ddd");
                const dataToSet = moment(timeFix).format("YYYY-MM-D");
                const splitActive = active.split("-");
                const getActive = splitActive[splitActive.length - 1];

                return (
                    <div key={`current-${index}`}>
                        <div className={`flex flex-col text-center w-10 h-14 rounded-md ${getActive === `${day}` ? "bg-secondary text-white" : "bg-white"}`} onClick={() => handleDateChange(dataToSet)}>
                            <label className="pb-1">{momentFix}</label>
                            <button>{day}   </button>

                        </div>

                    </div>
                );
            })}
        </>
    );
};

export default CalendarDays;