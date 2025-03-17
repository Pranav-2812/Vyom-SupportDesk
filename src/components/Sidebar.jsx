"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
    const pathname = usePathname();
    const [activeItem, setActiveItem] = useState(null);

    const handleItemClick = (index) => {
        setActiveItem(index);
    };

    const menuItems = [
        { imgSrc: "fa-solid fa-house", label: "Dashboard", path: "/" },
        { imgSrc: "fa-solid fa-chart-simple", label: "Analytics", path: "/analytics" },
        { imgSrc: "fa-solid fa-gear", label: "Settings", path: "/settings" },
        { imgSrc: "fa-solid fa-headset", label: "Chat Support", path: "/chats" }
    ];

    return (
        <div className="flex flex-col justify-between w-[300px] h-[830px] right-shadow bg-white mt-3 rounded-md">
            <ul className="flex flex-col justify-around w-full mt-14">
                {menuItems.map((item, index) => {
                    const isActive = pathname === (item.path || "/tickets") || activeItem === index ;
                    return (
                        <Link key={index} href={item.path} passHref>
                            <li
                                className={`flex flex-row items-center justify-center my-4 gap-5 mx-8 rounded-md py-4 cursor-pointer 
                                    ${isActive ? "bg-blue-500 text-white" : "text-blue-500"}`}
                                onClick={() => handleItemClick(index)}
                            >
                                <i className={item.imgSrc}></i>
                                <p className="w-2/4">{item.label}</p>
                            </li>
                        </Link>
                    );
                })}
            </ul>

            <ul className="flex flex-row justify-around w-full">
                <li className="flex flex-col my-10 items-center justify-center">
                    <img src="/help.png" className="w-8 h-8" />
                    <p className="text-red-500 font-bold">Help</p>
                </li>
                <li className="flex flex-col my-10 items-center justify-center">
                    <img src="/contact.png" className="w-8 h-8" />
                    <p className="text-red-500 font-bold">Contact</p>
                </li>
                <li className="flex flex-col my-10 items-center justify-center">
                    <img src="/privacy.png" className="w-8 h-8" />
                    <p className="text-red-500 font-bold">Privacy</p>
                </li>
            </ul>
        </div>
    );
}
