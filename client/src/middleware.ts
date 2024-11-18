import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const privatePaths = ["/me"];
const authPaths = ["/login", "/register"];
const productEditRegex = /^\/products\/\d+\/edit$/;

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get("sessionToken")?.value;

  console.log("sessionToken", sessionToken);

  // Chưa đăng nhập thì không cho vào private paths
  if (privatePaths.some((path) => pathname.startsWith(path) && !sessionToken)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Đăng nhập rồi thì không cho vào auth paths
  if (authPaths.some((path) => pathname.startsWith(path) && sessionToken)) {
    return NextResponse.redirect(new URL("/me", request.url));
  }

  // TODO: nếu chưa đăng nhập thì không cho vào trang edit sản phẩm.
  if (productEditRegex.test(pathname) && !sessionToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/me", "/login", "/register", "/products/:path*"],
};
