// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  // Get auth status from cookies, token, etc.
  const isAuthenticated = checkAuthStatus(request);
  
  // Get the pathname and search params
  const { pathname, search } = request.nextUrl;
  const fullPath = pathname + search;
  
  // Check if it's the meets route with an ID parameter
  const isMeetsWithId = pathname.startsWith('/meets') && search.includes('?id=');
  
  // Allow access to home page (login page)
  if (pathname === '/') {
    return NextResponse.next();
  }
  
  // Allow access if user is authenticated OR if it's the special meets route
  if (isAuthenticated || isMeetsWithId) {
    return NextResponse.next();
  }
  
  // Redirect to home/login page if not authenticated
  const url = request.nextUrl.clone();
  url.pathname = '/';
  return NextResponse.redirect(url);
}

// Helper function to check authentication status
function checkAuthStatus(request) {
  // Get the token from cookies or headers
  const token = localStorage.getItem("agentId");
  
  // Implement your token validation logic here
  return !!token; // Return true if token exists and is valid
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    // Match all routes except api routes, public assets, etc.
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
