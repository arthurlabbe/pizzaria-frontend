import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname === "/" ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/dashboard")) {
    const session = req.cookies.get("session")?.value;

    if (!session) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    try {
      const apiURL = process.env.NEXT_PUBLIC_API;
      if (!apiURL) {
        return NextResponse.next();
      }

      const response = await fetch(`${apiURL}/me`, {
        method: "GET",
        headers: {
          Cookie: `session=${session}`,
        },
        cache: "no-store",
      });

      if (!response.ok) {
        if (response.status === 401) {
          return NextResponse.redirect(new URL("/", req.url));
        }
        return NextResponse.next();
      }

      return NextResponse.next();
    } catch (err) {
      console.log("Erro ao validar cookie (middleware):", err);
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}