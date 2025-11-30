import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { api } from "@/services/api";
import { Header } from "./components/header";
import { OrderProvider } from "@/providers/order";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) {
    redirect("/");
  }

  try {
    await api.get("/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch {
    redirect("/");
  }

  return (
    <>
      <Header />
      <OrderProvider>{children}</OrderProvider>
    </>
  );
}
