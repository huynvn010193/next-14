import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const privatePaths = ["/manage"];
const unAuthPaths = ["/login"];

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // TODO: Do đã set cookie ở route login vô cookieStore.
  const accessToken = Boolean(request.cookies.get("accessToken")?.value);
  const refreshToken = Boolean(request.cookies.get("refreshToken")?.value);

  // TODO: chưa đăng nhập thì không cho vào private paths. Trường hợp chưa đăng nhập thì sẽ không có refreshToken. Do accessToken hết hạn sẽ biến mất.
  if (privatePaths.some((path) => pathname.startsWith(path)) && !refreshToken) {
    const url = new URL("/login", request.url);
    return NextResponse.redirect(url);
  }

  // TODO: đăng nhập rùi thì sẽ không cho vào login nữa.
  if (unAuthPaths.some((path) => pathname.startsWith(path)) && refreshToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // TODO:  TH: đăng nhập rùi nhưng hết hạn và truy cập vào page authentication -> accessToken hết hạn nhưng refreshToken còn hạn.
  if (
    privatePaths.some((path) => pathname.startsWith(path)) &&
    !accessToken &&
    refreshToken
  ) {
    const url = new URL("/logout", request.url);
    url.searchParams.set(
      "refreshToken",
      request.cookies.get("refreshToken")?.value ?? ""
    );
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/manage/:path*", "/login"],
};
