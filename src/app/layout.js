"use client";
import "./globals.css";
import Navbar from "@/components/Navbar";
import RightSidebar from "@/components/RightSidebar";
import Sidebar from "@/components/Sidebar";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "@/store/store";
import { Suspense, useState, useEffect } from "react";
import { loginStart, loginSuccess, loginFailure, logout, checkLoginStatus } from "@/store/slices/Auth";
import { PathnameContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime";
import { usePathname } from "next/navigation";

// Create a separate component for the app content to use Redux hooks
function AppContent({ children }) {
  const dispatch = useDispatch();
  const { isLoggedIn, isLoading, error } = useSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const pathname = usePathname();
  // Check for existing login on component mount
  useEffect(() => {
    dispatch(checkLoginStatus());
  }, [dispatch]);

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(loginStart());

    try {
      // Make API call
      console.log(email, password);
      const response = await fetch("https://sggsapp.co.in/vyom/admin/agent_login.php", {
        method: "POST",
        body: JSON.stringify({
          email: email,
          password: password
        }),
      });
      
      // Parse response
      const data = await response.json();
      console.log(data);
      
      if (data.success) {
        // Store auth information
        localStorage.setItem('agentId', data.agent.agent_id);
        localStorage.setItem('agent', JSON.stringify(data.agent));
        
        // Update Redux state
        dispatch(loginSuccess({
          agent: data.agent,
          agentId: data.agent.agent_id
        }));
      } else {
        dispatch(loginFailure(data.message || "Login failed. Please check your credentials."));
      }
    } catch (err) {
      console.error("Login error:", err);
      dispatch(loginFailure("An error occurred. Please try again later."));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('agentId');
    localStorage.removeItem('agent');
    dispatch(logout());
  };

  return (
    <>
      {!isLoggedIn && pathname!=="/meets"  ? (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 ">
          <img src="/logo.png" className="absolute scale-sm  "/>
          <div className="w-full max-w-md p-8 bg-blue-200 rounded-lg shadow-md modal-blur-2">
            <div className="flex justify-center mb-6">
              <h1 className="text-3xl font-bold text-blue-700">Customer Care Login</h1>
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}
            
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  Email 
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full px-3 py-2 border border-blue-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  className="w-full px-3 py-2 border border-blue-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <button
                  type="submit"
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <i className="fas fa-spinner fa-spin mr-2"></i> Logging in...
                    </span>
                  ) : (
                    "Log In"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="bg-blue-100">
          <Navbar onLogout={handleLogout} />
          <div className="flex flex-row justify-between h-[860px]">
            <Sidebar />
            <Suspense>{children}</Suspense>
            <RightSidebar />
          </div>
        </div>
      )}
    </>
  );
}

// Root layout component that provides the Redux store
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
        <title>Vyom Assist -Login</title>
        <link rel="icon" href="./logo.png"/>
      </head>
      <body>
        <Provider store={store}>
          <AppContent>{children}</AppContent>
        </Provider>
      </body>
    </html>
  );
}