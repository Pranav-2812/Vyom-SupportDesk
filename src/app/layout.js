"use client";
import "./globals.css";
import Navbar from "@/components/Navbar";
import RightSidebar from "@/components/RightSidebar";
import Sidebar from "@/components/Sidebar";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { Suspense } from "react";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.png" />
        <title>Vyom Assist</title>
        <script
          src="https://kit.fontawesome.com/20cafe9e9f.js"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body className={`antialiased`}>
        <Provider store={store}>
          <div className="bg-blue-100 ">
            <Navbar />
            <div className="flex flex-row justify-between h-[860px] ">
              <Sidebar />
              <Suspense>{children}</Suspense>
              <RightSidebar />
            </div>
          </div>
        </Provider>
      </body>
    </html>
  );
}
