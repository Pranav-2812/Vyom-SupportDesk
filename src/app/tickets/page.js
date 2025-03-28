"use client";
import { useState, useEffect, use } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import ScheduleCalendar from "./Calender";
export default function TicketPage() {
  const [clicked, setClicked] = useState(false);
  const [ticket, setTicket] = useState(null);
  const [user, setUser] = useState("");
  const [open, setOpen] = useState(false);
  const [modal2, setModal2] = useState(false);
  const [showCalender, setShowCalender] = useState(false);
  const searchParams = useSearchParams();
  const ticketId = searchParams.get("id");
  const tickets = useSelector((state) => state.data.items);
  const router = useRouter();
  // const scheduledMeets = useSelector((state) => state.meets.items);
  // console.log(scheduledMeets);
  const handleClick = async (mobNo = 8530292951) => {
    if (!clicked) {
      const response = await fetch(
        `https://sggsapp.co.in/vyom/user/fetch_user_primary_details.php?mobile_number=${mobNo}`,
        {
          method: "GET",
          cache: "no-cache",
        }
      );
      const result = await response.json();
      if (!result.success) {
        console.log(result.msg);
      } else {
        setClicked(true);
        console.log(result.data);
        setUser(result.data);
      }
    } else {
      setClicked(false);
    }
  };
  const closeTicket = async()=>{
    const response = await fetch("https://sggsapp.co.in/vyom/admin/resolve_ticket.php",{
      method:"POST",
      headers: { "Content-Type": "application/json" },
      body:JSON.stringify({
        "ticket_id":ticketId,
        "status":"Resolved"
      })
    })
    const result = await response.json();
    if(result.success){
      alert("Closed Successdully!");
      setModal2(false)
      router.push("/");
    }
    else{
      console.log(result.msg)
    }
  }
  useEffect(() => {
    document.title = "Tickets - Vyom Assist";
    if (tickets?.data) {
      const result = tickets.data.find(
        (ticket) => ticket.ticket_id === ticketId
      );
      if (result) {
        setTicket(result);
      }
    }
  }, [tickets, ticketId]);
  const resoveTicket = () => {
    if (ticket.preferred_support_mode === "Video Call") {
      setShowCalender(true);
    }
    if (ticket.preferred_support_mode === "Text Message") {
      router.push(`/chats/conversation?id=${ticket.ticket_id}`);
    }
  };
  const renderLinks = (type) => {
    if (type === "Attachments") {
      if (ticket.image_link !== null) {
        window.open(ticket.image_link, "_blank");
      } 
    }

    if (type === "Video") {
      console.log(ticket.video_file_link);
      if (ticket.video_file_link !== null) {
        window.open(ticket.video_file_link, "_blank");
      }
    } 
    if (type === "Audio") {
      if (ticket.audio_file_link !== null) {
        window.open(ticket.audio_file_link, "_blank");
      }
    }
  };
  const closeModal = () => {
    setOpen(false);
    setShowCalender(false);
  };

  return (
    <div className="width_65 flex flex-col items-center ">
      <div className="w-full h-11/12  mt-34 flex flex-col items-start  px-10 py-4 bg-white  notification-bell-shadow      rounded-md ">
        {/* <div className=" w-full mt-4 flex flex-row items-center justify-around px-10 py-4">
          <h2 className="text-3xl w-2/4 text-blue-500 font-bold tracking-wide">
            Tickets
          </h2>
          <div className="flex flex-row w-2/4  items-center  justify-between ">
            <input
              className="w-3/4 px-2 py-2 mr-4  border-2 border-blue-500 outline-none rounded-md"
              placeholder="Search Here"
            />
            <select className="px-4 py-3 border-2 border-blue-500 rounded-md outline-none">
              <option className="outline-blue-500 rounded-md px-2 text-center">
                Sort By
              </option>
              <option className="outline-blue-500 rounded-md px-2 text-center">
                A
              </option>
              <option className="outline-blue-500 rounded-md px-2 text-center">
                B
              </option>
            </select>
          </div>
        </div> */}
        <h1
          className={`text-3xl font-bold  ${
            ticket?.urgency_level === "Low"
              ? "text-green-400"
              : ticket?.urgency_level === "Medium"
              ? "text-amber-500"
              : "text-red-500"
          }`}
        >
          {ticket?.urgency_level} Priority Ticket
        </h1>
        <div className="w-full flex flex-row items-center   gap-16 mt-4 overflow-x-auto">
          <div
            className={`width_65 flex flex-col  items-center justify-around gap-10 px-6 py-4 rounded-xl z-20 border-2 ${
              ticket?.urgency_level === "Low"
                ? "border-green-400"
                : ticket?.urgency_level === "Medium"
                ? "border-amber-500"
                : "border-red-500"
            }`}
          >
            <div className="w-full flex flex-row   gap-4">
              <div className="w-3/4 flex flex-col items-start justify-between gap-16">
                <div className="w-full">
                  <h1 className="ml-4 text-2xl text-blue-400 pb-8">
                    {ticket?.ticket_id}
                  </h1>
                  <div className="w-full border-r-2 px-4">
                    <span className="w-full flex flex-row items-center justify-start gap-10">
                      <h1 className="text-lg">
                        {ticket?.first_name} {ticket?.last_name}{" "}
                        {ticket?.gender === "Male" ? "(M)" : "(F)"}
                      </h1>
                      <button
                        type="button"
                        className={`w-1/3 ${
                          clicked ? "bg-red-500" : "bg-blue-600"
                        } font-bold py-2 px-1 text-sm rounded-md cursor-pointer text-white tracking-wide`}
                        onClick={() => handleClick(ticket?.mobile_number)}
                      >
                        {clicked ? "Close" : "Show profile"}
                      </button>
                    </span>
                    <div className="w-full flex flex-row  items-center justify-between">
                      <span className="text-center py-4">
                        <h1 className="font-bold">Category</h1>
                        <h1>{ticket?.category}</h1>
                      </span>
                      <span className="text-center py-2">
                        <h1 className="font-bold">Sub Category</h1>
                        <h1>{ticket?.sub_category}</h1>
                      </span>
                    </div>
                    <hr />
                    <span className="w-full">
                      <h1 className="font-bold py-1 flex flex-row">
                        Mobile Number:{" "}
                        <p className="font-normal">&ensp;{ticket?.mobile_number}</p>
                      </h1>
                      <h1 className="font-bold py-1 flex flex-row">
                        Email: <p className="font-normal">&ensp;{ticket?.email}</p>
                      </h1>
                    </span>
                    <hr />
                    <span className="w-full py-4">
                      <h1 className="font-bold py-1 flex flex-row">
                        Address:{" "}
                        <p className="font-normal">&ensp;{ticket?.address}</p>
                      </h1>
                      <span className="flex flex-row items-center justify-between font-bold py-1">
                        <h2 className="flex flex-row">
                          District:{" "}
                          <p className="font-normal">&ensp;{ticket?.country}</p>
                        </h2>
                        <h2 className="flex flex-row">
                          Taluka :{" "}
                          <p className="font-normal">&ensp;{ticket?.country}</p>
                        </h2>
                      </span>
                      <h1 className="font-bold flex flex-row pb-3">
                        State : <p className="font-normal">&ensp;{ticket?.country}</p>
                      </h1>
                    </span>
                    <hr />
                  </div>
                </div>
                <div className="w-full flex flex-row items-center justify-start gap-10 px-4">
                  <button
                    className="w-2/4 h-[100px] flex flex-col items-center justify-center gap-4 text-center border-2 cursor-pointer rounded-xl box-shadow "
                    onClick={() => {
                      renderLinks("Attachments");
                    }}
                  >
                    <h1 className=" font-bold text-sm">Attachments</h1>
                    <i className="fa-solid fa-paperclip scale-sm"></i>
                  </button>
                  <button
                    className="w-2/4 h-[100px] flex flex-col items-center justify-center gap-4 text-center border-2 cursor-pointer rounded-xl box-shadow "
                    onClick={() => {
                      renderLinks("Video");
                    }}
                  >
                    <h1 className=" font-bold text-sm">Video</h1>
                    <i className="fa-solid fa-video scale-sm "></i>
                  </button>
                  <button
                    className="w-2/4 h-[100px] flex flex-col items-center justify-center gap-4 text-center border-2 cursor-pointer rounded-xl box-shadow "
                    onClick={() => {
                      renderLinks("Audio");
                    }}
                  >
                    <h1 className=" font-bold text-sm">Audio</h1>
                    <i className="fa-solid fa-play  scale-sm"></i>
                  </button>
                </div>
              </div>
              <div className="w-2/4 h-max flex flex-col items-center justify-between">
                <div className="w-full">
                  <h1 className="pb-8 font-bold ml-24">{ticket?.updated_at}</h1>
                  <span className="w-full flex flex-col">
                    <h1 className="font-bold flex flex-row items-center">
                      Support Mode:{" "}
                      <p className="font-normal ml-4">
                        {ticket?.preferred_support_mode}
                      </p>
                    </h1>
                    <h1 className="font-bold flex flex-row items-center">
                      Status:{" "}
                      <p className="font-normal ml-4">{ticket?.status}</p>
                    </h1>
                    <h1 className="font-bold flex flex-row items-center">
                      Authentication :
                      <p className="font-normal ml-4"> suceess</p>
                    </h1>
                    <h1 className="flex flex-row py-3 font-bold">
                      Urgency Level :
                      <p
                        className={`px-2 ml-3 rounded-md ${
                          ticket?.urgency_level === "Low"
                            ? "bg-green-400 text-green-700 font-bold "
                            : ticket?.urgency_level === "Medium"
                            ? "bg-amber-200 text-amber-500 font-bold "
                            : "bg-red-300 text-red-600 font-bold "
                        }`}
                      >
                        {ticket?.urgency_level}
                      </p>
                    </h1>
                  </span>
                  <div className="w-full h-[150px] border-2 rounded-xl text-center my-8">
                    User Query
                  </div>
                </div>
                <button
                  className="bg-red-600 rounded-xl px-2 py-3 text-white font-bold w-2/4 notification-bell-shadow cursor-pointer"
                  onClick={() => {
                    setOpen(true);
                  }}
                >
                  Resolve Query
                </button>
                <button
                  className="bg-green-600 rounded-xl px-2 py-3 mt-2 text-white font-bold w-2/4 notification-bell-shadow cursor-pointer"
                  onClick={() => {
                    setModal2(true);
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
          {clicked ? (
            <div className="w-1/3 h-full  flex flex-col  rounded-xl border-2 ">
              <div className="flex flex-col w-full text-center border-b-2 py-10">
                <h1 className="font-bold tracking-wide">
                  {user?.first_name} {user?.last_name}{" "}
                  {user?.gender === "Male" ? "(M)" : "(F)"}
                </h1>
              </div>

              <div className="w-full flex flex-col gap-10 items-start px-4 py-4">
                <h1 className="flex flex-row justify-around gap-6 items-center">
                  <p className="font-bold text-lg tracking-wide">
                    Account Number:
                  </p>
                  <p>{user.account_number}</p>
                </h1>
                <h1 className="flex flex-row justify-around gap-6 items-center">
                  <p className="font-bold text-lg tracking-wide">
                    Mobile Number:
                  </p>
                  <p>{user.mobile_number}</p>
                </h1>
                <h1 className="flex flex-row justify-around gap-6 items-center">
                  <p className="font-bold text-lg tracking-wide">
                    Aadhar Number:
                  </p>
                  <p>{user.aadhaar}</p>
                </h1>
                <h1 className="flex flex-row justify-around gap-6 items-center">
                  <p className="font-bold text-lg tracking-wide">
                    Account Type:
                  </p>
                  <p>{user.account_type}</p>
                </h1>
                <h1 className="flex flex-row justify-around gap-6 items-center">
                  <p className="font-bold text-lg tracking-wide">
                    Active Loan:
                  </p>
                  <p></p>
                </h1>
                <h1 className="flex flex-row justify-around gap-6 items-center">
                  <p className="font-bold text-lg tracking-wide">
                    Bank Balance:
                  </p>
                  <p>{user.total_assets}</p>
                </h1>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
      {open ? (
        <div className="fixed flex items-center justify-center top-0 left-0 w-screen h-screen bg- modal-blur z-20">
          <div className="absolute flex flex-col gap-18 items-center justify-center  px-20 w-2/4 height_60 bg-white rounded-2xl box-shadow ">
            <span className="w-full  py-4 flex flex-row items-center justify-between">
              <h1 className="text-2xl tracking-wide font-bold text-blue-400">
                Resolve Ticket
              </h1>
              <button
                className="bg-red-500 px-4 py-1 text-white font-bold rounded-md notification-bell-shadow cursor-pointer"
                onClick={closeModal}
              >
                Close
              </button>
            </span>
            {!showCalender ? (
              <>
                <div className="flex flex-col gap-2 w-full rounded-lg border-2 border-red-400 py-4 px-4 ">
                  <span className="flex flex-row items-center justify-start gap-4 text-lg">
                    <h1 className="font-bold tracking-wide">Ticket ID :</h1>
                    <h1>{ticket?.ticket_id}</h1>
                  </span>
                  <span className="flex flex-row items-center justify-start gap-4 text-lg">
                    <h1 className="font-bold tracking-wide">Customer Name :</h1>
                    <h1>
                      {ticket.first_name} {ticket.last_name}&ensp;{" "}
                      {ticket.gender === "Male" ? "(M)" : "(F)"}
                    </h1>
                  </span>
                  <span className="flex flex-row items-center justify-start gap-4 text-lg">
                    <h1 className="font-bold tracking-wide">
                      Customer Account No :
                    </h1>
                    <h1>{ticket.account_number}</h1>
                  </span>

                  <span className="flex flex-row items-center justify-start gap-34 text-lg">
                    <span className="flex flex-row items-center gap-4">
                      <h1 className="font-bold tracking-wide">Category :</h1>
                      <h1>{ticket.category}</h1>
                    </span>
                    <span className="flex flex-row items-center gap-4">
                      <h1 className="font-bold tracking-wide">Sub Category:</h1>
                      <h1>{ticket.sub_category}</h1>
                    </span>
                  </span>
                  <span className="flex flex-row items-center justify-start gap-4 text-lg">
                    <h1 className="font-bold tracking-wide">
                      Language Preference :
                    </h1>
                    <h1>{ticket.language_preference}</h1>
                  </span>
                  <span className="flex flex-row items-center justify-start gap-4 text-lg">
                    <h1 className="font-bold tracking-wide">
                      Ticket Description :
                    </h1>
                    <h1>{ticket.description}</h1>
                  </span>
                </div>
                <button
                  className="bg-blue-500 text-white font-bold tracking-wide px-4 py-2 rounded-lg cursor-pointer box-shadow"
                  onClick={resoveTicket}
                >
                  {ticket.preferred_support_mode === "Video Call" ? (
                    "Schedule Video Call"
                  ) : ticket.preferred_support_mode === "Text Message" ? (
                    "Message Customer"
                  ) : (
                    <span className="flex flex-row items-center gap-4">
                      <i className="fa-solid fa-phone"></i>
                      Call {ticket.mobile_number}
                    </span>
                  )}
                </button>
              </>
            ) : (
              <ScheduleCalendar targetDate={ticket.available_timedate} ticket={ticket} />
            )}
          </div>
        </div>
      ) : (
        ""
      )}
      {modal2 ? (
        <div className="fixed flex items-center justify-center top-0 left-0 w-screen h-screen bg- modal-blur z-20">
          <div className="absolute flex flex-col gap-8 items-center justify-center px-20 w-1/3 h-1/4 bg-white rounded-2xl box-shadow ">
            
            <div className="flex flex-col items-center justify-center gap-6">
              <h1 className="text-2xl font-bold  tracking-wide">Mark as closed?</h1>
              <span className="flex flex-row items-center gap-10">
                <button className="bg-red-500 px-4 py-2 rounded-md box-shadow text-white font-bold cursor-pointer" onClick={()=>{setModal2(false)}}>No</button>
                <button className="bg-green-500 px-4 py-2 rounded-md box-shadow text-white font-bold cursor-pointer" onClick={closeTicket}>Yes</button>
              </span>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
