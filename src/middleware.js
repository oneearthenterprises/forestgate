// import { NextResponse } from 'next/server';

// export function middleware(request) {
//   // Check if the user is trying to access the admin dashboard
//   if (request.nextUrl.pathname.startsWith('/admin-dashboard')) {
//     // Check for an authentication cookie
//     const authCookie = request.cookies.get('admin-auth');
    
//     // If the cookie doesn't exist or is not valid, redirect to the admin login page
//     if (!authCookie || authCookie.value !== 'true') {
//       const loginUrl = new URL('/admin-login', request.url);
//       return NextResponse.redirect(loginUrl);
//     }
//   }

//   // If the path is /admin-login and the user is already authenticated, redirect to dashboard
//   if (request.nextUrl.pathname === '/admin-login') {
//     const authCookie = request.cookies.get('admin-auth');
//     if (authCookie && authCookie.value === 'true') {
//         const dashboardUrl = new URL('/admin-dashboard', request.url);
//         return NextResponse.redirect(dashboardUrl);
//     }
//   }

//   // Allow the request to proceed
//   return NextResponse.next();
// }

// // See "Matching Paths" below to learn more
// export const config = {
//   matcher: ['/admin-dashboard/:path*', '/admin-login'],
// };




import { NextResponse } from 'next/server';

export function middleware(request) {
  const pathname = request.nextUrl.pathname;

  const userRoutes = {
    myBookings: "/my-bookings",
    profile: "/profile",
    checkout: "/checkout",
  };

  const userCookie = request.cookies.get("user-auth");
  const authCookie = request.cookies.get("admin-auth");

  // user protected routes
  if (Object.values(userRoutes).includes(pathname)) {
    if (!userCookie) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // admin protected routes
  if (pathname.startsWith("/admin-dashboard")) {
    if (!authCookie) {
      return NextResponse.redirect(new URL("/admin-login", request.url));
    }
  }

  // admin login redirect
  if (pathname === "/admin-login") {
    if (authCookie) {
      return NextResponse.redirect(new URL("/admin-dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/my-bookings",
    "/admin-dashboard/:path*",
    "/admin-login",
  ],
};