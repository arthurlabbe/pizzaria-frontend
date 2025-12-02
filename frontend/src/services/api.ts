import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API || "https://pizzaria-api-eight.vercel.app",
  withCredentials: true,
});