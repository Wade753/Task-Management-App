// // export { auth as middleware } from "./server/auth/config";

// // export default auth((req) => {
// //   console.log(req.auth); //  { session: { user: { ... } } }
// // });

// // export const config = {
// //   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
// // };

// import { NextResponse, type NextRequest } from "next/server";
// import { getToken } from "next-auth/jwt";

// // console.log("Middleware loaded!");
// // import { authConfig } from "./server/auth/config";
// // import NextAuth from "next-auth";

// // Use only one of the two middleware options below
// // 1. Use middleware directly
// // export const { auth: middleware } = NextAuth(authConfig)

// // 2. Wrapped middleware option
// export async function middleware(req: NextRequest) {
//   console.log("Middleware triggered for:", req.nextUrl.pathname);

//   const token = await getToken({ req, secret: process.env.AUTH_SECRET });
//   console.log("Token:=>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> midd", token);
//   const allowedPaths = ["/", "/login", "/register", "/"];
//   const allowedRegexPaths = [/^\/post\?id=[a-f0-9-]+$/];
//   console.log("Middleware token:", req.cookies.get("next-auth.session-token"));

//   if (allowedPaths.includes(req.nextUrl.pathname)) {
//     console.log("Allowed path, proceeding...");
//     return NextResponse.next();
//   }
//   if (
//     allowedRegexPaths.some((regex) =>
//       regex.test(req.nextUrl.pathname + req.nextUrl.search),
//     )
//   ) {
//     console.log("Allowed regex path, proceeding...");
//     return NextResponse.next();
//   }

//   if (!token) {
//     console.log("No token found, redirecting to /homepage");
//     return NextResponse.redirect(new URL("/", req.url));
//   }

//   console.log("User authenticated, allowing access");
//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
// };
import NextAuth from "next-auth";
import { authConfig } from "./server/auth/config";

export const { auth: middleware } = NextAuth(authConfig);
