import { getCookie } from "cookies-next";

export function getCookieClient(): string | null {
  const token = getCookie("session");
  return token ? String(token) : null;
}
