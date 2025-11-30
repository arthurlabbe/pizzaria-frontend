import { Form } from "./components/form";
import { api } from "@/services/api";
import { cookies } from "next/headers";

export default async function Product() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  const response = await api.get("/category", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return <Form categories={response.data} />;
}
