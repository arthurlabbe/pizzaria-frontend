import axios from "axios";

export const api = axios.create({
  baseURL: "https://pizzaria-api-eight.vercel.app",
  withCredentials: true
});