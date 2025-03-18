"use client";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { fetchMeetData } from "@/store/slices/fetchMeetings";
import { useRouter } from "next/navigation";
export default function RightSidebar() {
    const DAY_NAME_OF_WEEK_LONG = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const [open, setOpen] = useState(false);
    const [ticket, setTicket] = useState(null);
    const router = useRouter();
    var options = {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    };
    const dispatch = useDispatch();
    const { items, status, error } = useSelector((state) => state.meets);
    useEffect(() => {
        dispatch(fetchMeetData());
    }, [dispatch]);
    const handleClick = (meet_id, ID) => {
        if (!open) {
            setOpen(true);
            const ticket = items.data.find((item) => item.ticket_id === ID);
            console.log(ticket);
            setTicket(ticket);
        }
    }
    const redirectToMeet = (id)=>{
        setOpen(false)
        console.log(id)
        router.push(`/meets?id=${id}`);
    }
    return (
        <div className="flex flex-col items-center justify-between w-[300px]">
            <div className="flex flex-col items-center gap-10 h-1/4">
                <hr className="rotate-90 w-[55px] mt-7 border-blue-500 med-border" />
                <span className="w-[75px] h-[75px] flex items-center justify-center bg-blue-300 rotate-45 rounded-md notification-bell-shadow cursor-pointer">
                    <i className="fa-regular fa-bell r-45 "></i>
                </span>
            </div>
            <div className="flex flex-col items-center px-4 gap-4  notification-bell-shadow rounded-md w-full h-3/4  hide bg-white ">
                <h3 className="text-xl font-bold tracking-wide py-4">Scheduled Meetings</h3>
                {status === "loading" ? <p>Loading...</p> : ""}
                {status === "failed" ? <p>Error: {error}</p> : ""}

                <div className="w-full h-full overflow-y-auto hide flex flex-col items-center gap-4">
                {
                    items.data?.map((item, i) => {
                        return (
                            <div className="w-full bg-blue-100 py-2 flex flex-col items-center  rounded-xl box-shadow" key={i}>
                                <h2 className="font-bold text-blue-500">{item.ticket_id}</h2>
                                <h1 className="font-bold tracking-wide">{item.first_name}{" "}{item.last_name}</h1>
                                <h1 className="font-bold py-1">{DAY_NAME_OF_WEEK_LONG[new Date(item.available_timedate).getDay()]}&ensp;{new Date(item.available_timedate).toLocaleString("en-US", options)}</h1>
                                <span className="w-full flex flex-row items-center justify-around text-sm tracking-wide font-bold py-1">
                                    <span className="flex flex-col items-center">
                                        <p>Category</p>
                                        <p className="text-blue-400">{item.category}</p>
                                    </span>
                                    <span className="flex flex-col items-center">
                                        <p>Support Mode</p>
                                        <p className="text-blue-400">Video</p>
                                    </span>
                                </span>
                                <button className="bg-red-600 px-10 py-2 mt-2 text-white font-bold rounded-lg box-shadow cursor-pointer tracking-wide" onClick={() => handleClick(item.meet_id,item.ticket_id)}>Details</button>
                            </div>
                        )
                    })

                }
                
                </div>
                {items?.data?.length===0? "No Scheduled Meetings" :""}
            </div>

            {open ?
                <div className="fixed flex items-center justify-center top-0 left-0 w-screen h-screen bg- modal-blur z-20">
                    <div className="absolute flex flex-col gap-8 items-center px-20 w-2/4 h-2/4 bg-white rounded-2xl box-shadow ">
                        <span className="w-full  py-4 flex flex-row items-center justify-between">
                            <h1 className="text-2xl tracking-wide font-bold text-blue-400">Ticket Details</h1>
                            <button className="bg-red-500 px-4 py-1 text-white font-bold rounded-md notification-bell-shadow cursor-pointer" onClick={() => setOpen(false)}>
                                Close
                               
                            </button>
                        </span>
                        <div className="flex flex-col gap-2 w-full rounded-lg border-2 border-red-400 py-4 px-4 ">
                            <span className="flex flex-row items-center justify-start gap-4 text-lg">
                                <h1 className="font-bold tracking-wide">Ticket ID :</h1>
                                <h1>{ticket?.ticket_id}</h1>
                            </span>
                            <span className="flex flex-row items-center justify-start gap-4 text-lg">
                                <h1 className="font-bold tracking-wide">Customer Name :</h1>
                                <h1>{ticket?.first_name}{" "} {ticket?.last_name}&ensp; {ticket.gender==="Male"?"(M)":"(F)"}</h1>
                            </span>
                            <span className="flex flex-row items-center justify-start gap-4 text-lg">
                                <h1 className="font-bold tracking-wide">Customer Account No :</h1>
                                <h1>{ticket.account_number}</h1>
                            </span>
                            <span className="flex flex-row items-center justify-start gap-4 text-lg">
                                <h1 className="font-bold tracking-wide">Meet Time:</h1>
                                <h1>{ticket.available_timedate.slice(0, 11)}&ensp;{DAY_NAME_OF_WEEK_LONG[new Date(ticket.available_timedate).getDay()]}&ensp;{new Date(ticket.available_timedate).toLocaleString("en-US", options)}</h1>
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
                                <h1 className="font-bold tracking-wide">Language Preference :</h1>
                                <h1>{ticket.language_preference}</h1>
                            </span>
                            <span className="flex flex-row items-center justify-start gap-4 text-lg">
                                <h1 className="font-bold tracking-wide">Ticket Description :</h1>
                                <h1>{ticket.description}</h1>
                            </span>
                        </div>
                        <button className="bg-blue-500 text-white font-bold tracking-wide px-4 py-2 rounded-lg cursor-pointer box-shadow"
                        onClick={()=>redirectToMeet(ticket.meet_id)}>
                            Start Meet
                            <i className="fa-solid fa-video ml-4"></i>
                        </button>
                    </div>
                </div>
                : ""
            }

        </div>
    )
}