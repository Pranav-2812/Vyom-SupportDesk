"use client";
import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useSelector } from "react-redux";

export default function ScheduleCalendar({ targetDate }) {
  const [scheduledDates, setScheduledDates] = useState([]);
  const scheduledMeetings = useSelector((state) => state.meets.items);

  // Convert targetDate to a Date object if it's not already
  const selectedTargetDate = new Date(targetDate);

  useEffect(() => {
    if (scheduledMeetings?.data) {
      // Extract dates from scheduled meetings and format them
      const formattedDates = scheduledMeetings.data.map((meet) => {
        const meetDate = new Date(meet.available_timedate);
        return formatDate(meetDate);
      });

      setScheduledDates(formattedDates);
    }
  }, [scheduledMeetings]);

  const formatDate = (date) => {
    const pad = (num) => num.toString().padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  };

  // Function to check if a date is scheduled
  const isScheduled = (date) => {
    const formattedDateTime = formatDate(date);
    return scheduledDates.includes(formattedDateTime);
  };

  // Function to check if a date matches the target date (day, month, year match)
  const isTargetDate = (date) => {
    return (
      date.getDate() === selectedTargetDate.getDate() &&
      date.getMonth() === selectedTargetDate.getMonth() &&
      date.getFullYear() === selectedTargetDate.getFullYear()
    );
  };

  // Function to generate tile class names
  const getTileClassName = ({ date }) => {
    if (isTargetDate(date)) {
      return isScheduled(date) ? "scheduled-date" : "target-date";
    } else {
      return isScheduled(date) ? "scheduled-date" : null;
    }
  };

  return (
    <div className="flex flex-col items-center">
      <p className="text-2xl tracking-wide font-bold -py-2">
        {`${selectedTargetDate.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })} is ${isScheduled(selectedTargetDate) ? "already Scheduled" : "free to take meet"}`}
      </p>
      
      <div className="calendar-container">
        <Calendar
          tileClassName={getTileClassName}
        />
      </div>
      
      {/* Add custom CSS for the scheduled dates */}
      <style jsx>{`
        .calendar-container :global(.scheduled-date) {
          background-color: rgb(239, 68, 68);
          color: white;
        }
        .calendar-container :global(.target-date) {
          background-color: rgb(144, 238, 144);
          color: black;
        }
      `}</style>
    </div>
  );
}