"use client";
import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useSelector } from "react-redux";
import { v4 as uuid } from "uuid";
import { useRouter } from "next/navigation";
export default function ScheduleCalendar({ targetDate,ticket }) {
  const [scheduledDates, setScheduledDates] = useState([]);
  const [nextAvailableDate, setNextAvailableDate] = useState(null);
  const scheduledMeetings = useSelector((state) => state.meets.items);
  const router = useRouter();
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
      
      // Find next available date when scheduled dates change
      if (isScheduled(selectedTargetDate)) {
        const nextDate = checkNext(selectedTargetDate);
        setNextAvailableDate(nextDate);
      }
    }
  }, [scheduledMeetings, targetDate]);

  const formatDate = (date) => {
    const pad = (num) => num.toString().padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  };

  // Function to check if a date is scheduled
  const isScheduled = (date) => {
    const formattedDateTime = formatDate(date);
    return scheduledDates.includes(formattedDateTime);
  };
  
  // Function to find the next available date
  const checkNext = (startDate) => {
    const maxDaysToCheck = 30; // Limit how far ahead we check
    let nextDate = new Date(startDate);
    
    for (let i = 1; i <= maxDaysToCheck; i++) {
      nextDate = new Date(startDate);
      nextDate.setDate(nextDate.getDate() + i);
      
      if (!isScheduled(nextDate)) {
        return nextDate;
      }
    }
    
    return null; // Return null if no available date is found within the limit
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
    if (nextAvailableDate && 
        date.getDate() === nextAvailableDate.getDate() &&
        date.getMonth() === nextAvailableDate.getMonth() &&
        date.getFullYear() === nextAvailableDate.getFullYear()) {
      return "next-available-date";
    } else if (isTargetDate(date)) {
      return isScheduled(date) ? "scheduled-date" : "target-date";
    } else {
      return isScheduled(date) ? "scheduled-date" : null;
    }
  };

 const scheduleMeet = async(date)=>{
  const meetId = uuid();
  console.log(meetId)
  const response = await fetch(`https://sggsapp.co.in/vyom/admin/scheduled_ticket.php`,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      ticket_id:ticket.ticket_id,
      available_timedate:date,
      connection_way: `https://vyom-support-desk.vercel.app/meets?id=${meetId}`,
      meet_id:meetId,
      assigned_agent_id:localStorage.getItem("agentId")
    })
  })
  const result = await response.json();
  if(result.success){
    alert("Meet Scheduled");
    const data = new FormData();
    const message = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
   <h2 style="color: #003366;">Your Video Call with Union Bank of India is Scheduled!</h2>
   <p>Dear <strong>${ticket.first_name}&ensp;${ticket.last_name}</strong>,</p>
   <p>We are pleased to inform you that a video call has been scheduled regarding your service ticket <strong>#${ticket.ticket_id}</strong>.</p>
   
   <h3 style="color: #003366;">Video Call Details:</h3>
   <ul style="list-style-type: none; padding-left: 0;">
     <li><strong>Date:</strong> ${new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })}</li>
     <li><strong>Duration:</strong> Approximately 30 minutes</li>
     <li><strong>Platform:</strong> Union Bank Video Assist Portal</li>
     
   </ul>
 
   <h3 style="color: #003366;">How to Join:</h3>
   <ol>
     <li style="display:flex; flex-direction:column;">Click on the link below at the scheduled time:
      <br/>
      <p>Link: <a href="https://vyom-support-desk.vercel.app/meets?id=${meetId}" style="color: #003366;">https://vyom-support-desk.vercel.app/meets?id=${meetId}</a></p>
     </li>
     <li>Ensure you have a stable internet connection for smooth communication.</li>
     <li>Keep your service ticket details handy for quick reference.</li>
   </ol>
 
   <div style="background-color: #f2f2f2; padding: 15px; border-left: 4px solid #003366; margin: 20px 0;">
     <p style="margin: 0;"><strong>Important:</strong> This video call is secure and encrypted. Your personal and financial information shared during this call remains confidential.</p>
   </div>
 
   <p>If you need to reschedule or have any questions, please contact us at:
     <br/>
     <a href="tel:18002222244" style="color: #003366;">1800-222-2244</a> (Toll-free)
     <br/>
     <a href="mailto:customercare@unionbankofindia.com" style="color: #003366;">customercare@unionbankofindia.com</a>
   </p>
 
  
   <p>Thank you for banking with Union Bank of India.</p>
 
   <p>Best regards,</p>
   <p><strong>Customer Support Team</strong><br/>Union Bank of India</p>
   
   <div style="font-size: 12px; color: #666; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 10px;">
     <p>This is an automated message. Please do not reply to this email.</p>
     <p>For security reasons, Union Bank will never ask for your login credentials, OTP, card details, or any sensitive information via email or phone.</p>
   </div>
 </div>
 `.replace(/\r?\n/g, "");
    data.append("email_id", "2022bcs066@sggs.ac.in");
    data.append("subject", "Meet Scheduled!");
    data.append("body", message);
    try {
      const response = await fetch(
        `https://sggsapp.co.in/api/send_email.php`,
        {
          method: "POST",
          body: data,
        }
      );}
      catch(error){
        console.log(error)
      }
    
  }
  else{
    console.log(result.msg);
  }
 }

  return (
    <div className="flex flex-col items-center">
      <p className="text-2xl tracking-wide font-bold -py-2">
        {`${selectedTargetDate.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })} is ${isScheduled(selectedTargetDate) ? "already scheduled" : "free to take meet"}`}
      </p>
      
      <div className="flex flex-col items-center w-full">
        <div className="calendar-container">
          <Calendar
            tileClassName={getTileClassName}
            value={selectedTargetDate}
          />
        </div>
        
        {isScheduled(selectedTargetDate) && nextAvailableDate ? (
          <div className="mt-4 w-full">
            <p className="text-center mb-2">This date is already scheduled. Next available date:</p>
            <button 
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded w-full"
              onClick={()=>{scheduleMeet(nextAvailableDate)}}
            >
              Schedule on {nextAvailableDate.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </button>
          </div>
        ) : (
          !isScheduled(selectedTargetDate) && (
            <button 
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full"
              onClick={() => scheduleMeet(selectedTargetDate)}
            >
              Schedule on selected date
            </button>
          )
        )}
      </div>
      
      {/* Add custom CSS for the scheduled dates */}
      <style jsx>{`
        .calendar-container {
          width: 100%;
          max-width: 350px;
        }
        .calendar-container :global(.scheduled-date) {
          background-color: rgb(239, 68, 68);
          color: white;
        }
        .calendar-container :global(.target-date) {
          background-color: rgb(144, 238, 144);
          color: black;
        }
        .calendar-container :global(.next-available-date) {
          background-color: rgb(59, 130, 246);
          color: white;
        }
      `}</style>
    </div>
  );
}