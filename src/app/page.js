"use client";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { fetchData } from "../store/slices/fetchTickets";
import { useRouter } from "next/navigation";
export default function Home() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { items, status, error } = useSelector((state) => state.data);
  const [sortOption, setSortOption] = useState("");
  const [filteredTickets, setFilteredTickets] = useState([]);
  // const [query, setQuery] = useState("");
  // const [dequery, setDeQuery] = useState("");
  const sortRef = useRef(false);

  // Check if items.data is available
  const resolved = items?.data?.filter((item) => item.status === "Resolved") || []; // Default to empty array if undefined
 const openTickets = items?.data?.filter((item)=>item.status !== "Resolved" && item.language_preference===JSON.parse(localStorage.getItem("agent"))?.language_skills) || [];
  console.log(resolved);

  const handleSortChange = (option) => {
    setSortOption(option);

    let updatedTickets = [...openTickets]; // Create a new array to prevent mutation of the original array

    switch (option) {
      case "Newest First":
        updatedTickets.sort((a, b) => {
          const dateA = new Date(a.created_at.replace(" ", "T"));
          const dateB = new Date(b.created_at.replace(" ", "T"));
          return dateB - dateA; // Latest first (descending order)
        });
        setFilteredTickets(updatedTickets);
        sortRef.current = true;
        break;
      case "Oldest First":
        updatedTickets.sort((a, b) => {
          const dateA = new Date(a.created_at.replace(" ", "T"));
          const dateB = new Date(b.created_at.replace(" ", "T"));
          return dateA - dateB; // Oldest first (ascending order)
        });
        setFilteredTickets(updatedTickets);
        sortRef.current = true;
        break;
      case "High Urgency":
        updatedTickets = updatedTickets.filter(
          (item) => item.urgency_level === "High"
        );
        setFilteredTickets(updatedTickets);
        sortRef.current = true;
        break;
      case "Low Urgency":
        updatedTickets = updatedTickets.filter(
          (item) => item.urgency_level === "Low"
        );
        setFilteredTickets(updatedTickets);
        sortRef.current = true;
        break;
      case "Medium Urgency":
        updatedTickets = updatedTickets.filter(
          (item) => item.urgency_level === "Medium"
        );
        setFilteredTickets(updatedTickets);
        sortRef.current = true;
        break;
      case "":
        sortRef.current = false;
        setFilteredTickets(updatedTickets);
      default:
        break;
    }
  };

  const SearchInput = (input) => {
    let updatedTickets = [...openTickets];
    const filteredTickets = updatedTickets.filter((ticket) => {
      // Iterate over each key of the ticket
      for (let key in ticket) {
        if (ticket.hasOwnProperty(key)) {
          // Check if the key value includes the dequery (search term)
          if (ticket[key] && ticket[key].toString().toLowerCase().includes(input.toLowerCase())) {
            return true; // Ticket matches the query, include it
          }
        }
      }
      return false; // Exclude the ticket if no match is found
    });

    // Store the filtered tickets in state
    setFilteredTickets(filteredTickets);
  };

  useEffect(() => {
    dispatch(fetchData());
    document.title = "Vyom Assits -Dashboard"
  }, [dispatch]);

  useEffect(() => {
    setFilteredTickets(openTickets || []); // Set default to empty array if items.data is not available
  }, [items]);

  if (status === "loading") return <p>Loading...</p>;
  if (status === "failed") return <p>Error: {error}</p>;

  const handleClick = (id) => {
    router.push(`/tickets?id=${encodeURIComponent(id)}`);
  };

  return (
    <div className="w-3/4 flex flex-col items-center justify-around">
      <div className="flex flex-row items-center justify-around w-full">
        <div className="w-1/4 h-full flex flex-row bg-white items-center justify-center gap-14 mt-14 rounded-md notification-bell-shadow">
          <span>
            <h2 className="text-2xl font-bold text-blue-700 my-2">Total</h2>

            <h2 className="text-4xl font-bold text-blue-700 my-2">
              {items?.data?.length || 0} {/* Safe fallback */}
            </h2>

            <h2 className="text-2xl font-bold text-blue-700 my-2">
               Tickets
            </h2>
          </span>
          <i className="fa-solid fa-ticket r-45"></i>
        </div>

        <div className="w-1/4 h-full flex flex-row bg-white items-center justify-center gap-14 mt-14 rounded-md notification-bell-shadow">
          <span>
            <h2 className="text-2xl font-bold text-blue-700 my-2">Today</h2>
            <h2 className="text-4xl font-bold text-blue-700 my-2">{resolved.length}</h2>

            <h2 className="text-2xl font-bold text-blue-700 my-2">
              Tickets Resolved
            </h2>
          </span>
          <i className="fa-solid fa-ticket r-45"></i>
        </div>

        <div className="w-1/4 h-full flex flex-row bg-white items-center justify-center gap-14 mt-14 rounded-md notification-bell-shadow">
          <span>
            <h2 className="text-2xl font-bold text-blue-700 my-2">Total</h2>

            <h2 className="text-4xl font-bold text-blue-700 my-2">
              {items?.data?.filter((item) => item.status === "Open").length || 0} {/* Safe fallback */}
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
          <div className="flex flex-row gap-4 items-center justify-center">
            <input
              className="px-2 py-2 mr-4 border-2 border-blue-500 outline-none rounded-md"
              placeholder="Search Here"
              onChange={(e) => SearchInput(e.target.value)}
            />
            <select
              className="px-4 py-3 border-2 border-blue-500 rounded-md outline-none"
              value={sortOption} // Bind the value to the sortOption state
              onChange={(e) => handleSortChange(e.target.value)}
            >
              <option value="">
                {sortOption ? sortOption : "Sort By"}
              </option>
              <option value="Newest First">Newest First</option>
              <option value="Oldest First">Oldest First</option>
              <option value="High Urgency">High Urgency</option>
              <option value="Low Urgency">Low Urgency</option>
              <option value="Medium Urgency">Medium Urgency</option>
              <option value="">Remove Filter</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="px-10 pt-4">
          <div className="h-[500px] overflow-y-scroll hide">
            {/* Table Head */}
            <table className="w-full border-collapse border border-gray-300">
              <thead className="bg-blue-100 sticky">
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
                {filteredTickets?.map((item, i) => (
                  <tr
                    key={i}
                    className="hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleClick(item.ticket_id)}
                  >
                    <td className="border border-gray-300 px-4 py-2">
                      <p className="font-bold">
                        {item.first_name === "" ? "No Name" : item.first_name}{" "}
                        {item.last_name}
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
                        <p className="bg-green-300 h-full mx-4 py-2 rounded-md text-green-800 text-md font-bold">
                          Low
                        </p>
                      )}
                      {item.urgency_level === "High" && (
                        <p className="bg-red-300 h-full mx-4 py-2 rounded-md text-red-800 text-md font-bold">
                          High
                        </p>
                      )}
                      {item.urgency_level === "Medium" && (
                        <p className="bg-yellow-300 h-full mx-4 py-2 rounded-md text-yellow-800 text-md font-bold">
                          Medium
                        </p>
                      )}
                       {item.urgency_level === "Critical" && (
                        <p className="bg-red-300 h-full mx-4 py-2 rounded-md text-red-800 text-md font-bold">
                          High
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
