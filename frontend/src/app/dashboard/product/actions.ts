"use server";

import { api } from "@/services/api";
import { cookies } from "next/headers";
import { productActionSchema } from "@/lib/validation";

export async function handleRegisterProduct(formData: FormData) {
  const parsed = productActionSchema.safeParse({
    name: formData.get("name"),
    price: formData.get("price"),
    description: formData.get("description"),
    categoryIndex: formData.get("category"),
  });

  if (!parsed.success) {
    console.error(parsed.error.flatten().formErrors);
    return;
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) {
    console.log("Token nao encontrado");
    return;
  }

  const data = {
    name: String(parsed.data.name),
    price: String(parsed.data.price),
    description: String(parsed.data.description),
    category_id: parsed.data.categoryIndex,
  };

  try {
    await api.post("/product", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Produto cadastrado com sucesso!");
  } catch (err) {
    console.log("Erro ao cadastrar produto via server action:", err);
  }
}
