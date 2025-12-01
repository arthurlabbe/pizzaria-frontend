import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/_next") || pathname === "/") {
    return NextResponse.next();
  }

  if (!pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  const token = req.cookies.get("session")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const isValid = await validateToken(token);
  console.log(isValid);

  if (!isValid) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  return NextResponse.next();
}

async function validateToken(token: string) {
  if (!token) return false;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API ?? "http://localhost:3333"}/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    return response.ok;
  } catch (err) {
    console.log(err);
    return false;
  }
}
