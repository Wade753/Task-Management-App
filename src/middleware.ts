import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

console.log("Middleware loaded!");

export async function middleware(req: NextRequest) {
    console.log("Middleware triggered for:", req.nextUrl.pathname);

    const token = await getToken({ req, secret: process.env.AUTH_SECRET });
    console.log("Token:", token);

    const allowedPaths = ["/home", "/login", "/register"];
    if (allowedPaths.includes(req.nextUrl.pathname)) {
        console.log("Allowed path, proceeding...");
        return NextResponse.next();
    }

    if (!token) {
        console.log("No token found, redirecting to /login");
        return NextResponse.redirect(new URL("/login", req.url));
    }

    console.log("User authenticated, allowing access");
    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};