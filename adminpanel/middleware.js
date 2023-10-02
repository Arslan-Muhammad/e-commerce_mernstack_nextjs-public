import { NextResponse } from "next/server";

export default function (request) {

    const verify = request.cookies.get('accessToken');
    // const verify = ''

    if (!verify) {
        return NextResponse.redirect(new URL('/', request.url))
    }

}

export const config = {
    matcher: [
        "/dashboard",
        "/products/:path*",
        "/category/:path*",
        "/brand/:path*",
        "/color/:path*",
        "/users"
    ]
} 