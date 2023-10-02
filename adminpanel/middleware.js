import { NextResponse } from "next/server";

export default function middleware(request) {

    const loggingPath = request.nextUrl.pathname === "/";
    const verify = request.cookies.get('accessToken');

    if (request.nextUrl.pathname === "/forgetPassword" && !verify) {
        return;
    } else {
        if (request.nextUrl.pathname === "/forgetPassword" && verify) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }

    if (loggingPath) {
        if (verify) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    } else {
        if (!verify) {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }
}

export const config = {
    matcher: [
        "/",
        "/forgetPassword",
        "/dashboard",
        "/products/:path*",
        "/category/:path*",
        "/brand/:path*",
        "/color/:path*",
        "/users"
    ]
} 