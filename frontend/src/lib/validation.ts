import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "E-mail é obrigatório").email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

export const signupSchema = z.object({
  name: z.string().min(2, "Nome é obrigatório"),
  email: z.string().min(1, "E-mail é obrigatório").email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

export const categorySchema = z.object({
  name: z.string().min(2, "Nome da categoria é obrigatório"),
});

export const productSchema = z.object({
  name: z.string().min(2, "Nome é obrigatório"),
  price: z
    .string()
    .min(1, "Preço é obrigatório")
    .refine((value) => !isNaN(Number(value)) && Number(value) > 0, {
      message: "Preço deve ser um número maior que zero",
    }),
  description: z.string().min(5, "Descrição é obrigatória"),
  categoryIndex: z
    .number()
    .int()
    .nonnegative("Categoria é obrigatória"),
  image: z
    .instanceof(File, { message: "Selecione uma imagem" })
    .refine(
      (file) => ["image/jpeg", "image/png"].includes(file.type),
      "Formato inválido. Use JPG ou PNG"
    ),
});

export const productActionSchema = productSchema
  .omit({ image: true })
  .extend({
    categoryIndex: z.coerce.number().int().nonnegative("Categoria é obrigatória"),
  });
