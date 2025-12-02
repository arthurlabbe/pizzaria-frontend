import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/" || pathname.startsWith("/_next") || pathname.startsWith("/favicon")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/dashboard")) {
    const session = req.cookies.get("session")?.value;

    if (!session) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    try {
      const apiURL = process.env.NEXT_PUBLIC_API;

      const response = await fetch(`${apiURL}/me`, {
        method: "GET",
        headers: {
          Cookie: `session=${session}`,
        },
        cache: "no-store",
        credentials: "include",
      });

      if (!response.ok) {
        return NextResponse.redirect(new URL("/", req.url));
      }

      return NextResponse.next();
    } catch (err) {
      console.log("Erro ao validar cookie:", err);
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}