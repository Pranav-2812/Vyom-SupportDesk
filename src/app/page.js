"use client";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchData } from "../store/slices/fetchTickets";
import { useRouter } from "next/navigation";
export default function Home() {
  const dispatch = useDispatch();
  const router  = useRouter();
  const { items, status, error } = useSelector((state) => state.data);
  useEffect(() => {
    dispatch(fetchData());
    document.title = "Dashboard - Vyom Assist";
  }, [dispatch]);
  if (status === "loading") return <p>Loading...</p>;
  if (status === "failed") return <p>Error: {error}</p>;
  const handleClick = (id)=>{
    router.push(`/tickets?id=${encodeURIComponent(id)}`);
  }
  return (
    <div className="w-3/4 flex flex-col items-center justify-around">
      <div className="flex flex-row items-center justify-around w-full">
        <div className="w-1/4 h-full flex flex-row bg-white items-center justify-center gap-14 mt-14 rounded-md notification-bell-shadow">
          <span>
            <h2 className="text-2xl font-bold text-blue-700 my-2">Today</h2>
            <h2 className="text-4xl font-bold text-blue-700 my-2">
              {items.data?.length}
            </h2>
            <h2 className="text-2xl font-bold text-blue-700 my-2">
              Total Tickets
            </h2>
          </span>
          <i className="fa-solid fa-ticket r-45"></i>
        </div>
        <div className="w-1/4 h-full flex flex-row bg-white items-center justify-center gap-14 mt-14 rounded-md notification-bell-shadow">
          <span>
            <h2 className="text-2xl font-bold text-blue-700 my-2">Today</h2>
            <h2 className="text-4xl font-bold text-blue-700 my-2">0</h2>
            <h2 className="text-2xl font-bold text-blue-700 my-2">
              Tickets Resolved
            </h2>
          </span>
          <i className="fa-solid fa-ticket r-45"></i>
        </div>
        <div className="w-1/4 h-full flex flex-row bg-white items-center justify-center gap-14 mt-14 rounded-md notification-bell-shadow">
          <span>
            <h2 className="text-2xl font-bold text-blue-700 my-2">Today</h2>
            <h2 className="text-4xl font-bold text-blue-700 my-2">
              {items.data?.filter((item) => item.status === "Open").length}
            </h2>
            <h2 className="text-2xl font-bold text-blue-700 my-2">
              Ticket Pending
            </h2>
          </span>
          <i className="fa-solid fa-ticket r-45"></i>
        </div>
      </div>

      <div className="w-11/12 h-3/4 bg-white mt-14 notification-bell-shadow rounded-md">
        <div className="flex flex-row items-center justify-between px-10 py-2 w-full">
          <h2 className="text-3xl text-blue-500 font-bold tracking-wide">
            Ticket Summary
          </h2>
          <div className="flex flex-row items-center justify-center">
            <input
              className="px-2 py-2 mr-4 border-2 border-blue-500 outline-none rounded-md"
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
        </div>

        {/* Table */}
        {/* Table */}
        <div className="px-10 pt-4">
          <div className="h-[500px] overflow-y-scroll">
              {/* Table Head */}
            <table className="w-full border-collapse border border-gray-300">
              <thead className="bg-blue-100  sticky">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Ticket
                  </th>
                  <th className="border border-gray-300 px-4 py-2">Category</th>
                  <th className="border border-gray-300 px-4 py-2">
                    Tracking ID
                  </th>
                  <th className="border border-gray-300 px-4 py-2">
                    Support Mode
                  </th>
                  <th className="border border-gray-300 px-4 py-2">
                    Urgency Level
                  </th>
                </tr>
              </thead>
              {/* Table Body */}
              <tbody>
                {items.data?.map((item, i) => (
                  <tr key={i} className="hover:bg-gray-100 cursor-pointer" onClick={()=>handleClick(item.ticket_id)}>
                    <td className="border border-gray-300 px-4 py-2">
                      <p className="font-bold">
                        {item.first_name===""?"No Name":item.first_name} {item.last_name}
                      </p>
                      <p className="text-sm text-gray-500">{item.created_at}</p>
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center font-bold">
                      {item.category}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center text-blue-400 font-bold">
                      {item.ticket_id}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center font-bold">
                      {item.preferred_support_mode === ""
                        ? "-"
                        : item.preferred_support_mode}
                    </td>
                    <td className="border border-gray-300 text-center">
                      {item.urgency_level === "Low" && (
                        <p className="bg-green-300 h-full mx-4 py-2 rounded-md text-green-800 font-bold">
                          {item.urgency_level}
                        </p>
                      )}
                      {item.urgency_level === "Medium" && (
                        <p className="bg-amber-200 h-full mx-4 py-2 rounded-md text-amber-600 font-bold">
                          {item.urgency_level}
                        </p>
                      )}
                      {item.urgency_level === "High" && (
                        <p className="bg-red-300 h-full mx-4 py-2 rounded-md text-red-700 font-bold">
                          {item.urgency_level}
                        </p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
