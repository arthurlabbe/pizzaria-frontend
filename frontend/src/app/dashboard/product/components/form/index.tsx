"use client";

import styles from "./styles.module.scss";
import { UploadCloud } from "lucide-react";
import Image from "next/image";
import { Button } from "@/app/dashboard/components/button";
import { ChangeEvent, useState } from "react";
import { api } from "@/services/api";
import { getCookieClient } from "@/lib/cookieClient";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { productSchema } from "@/lib/validation";

interface CategoryProps {
  id: string;
  name: string;
}

interface Props {
  categories: CategoryProps[];
}

export function Form({ categories }: Props) {
  const router = useRouter();
  const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState("");

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (file.type !== "image/jpeg" && file.type !== "image/png") {
        toast.warning("Formato invalido! Envie JPG ou PNG.");
        return;
      }

      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const categoryIndex = Number(formData.get("category"));

    const parsed = productSchema.safeParse({
      name: formData.get("name"),
      price: formData.get("price"),
      description: formData.get("description"),
      categoryIndex,
      image,
    });

    if (!parsed.success) {
      const [firstError] = parsed.error.errors;
      toast.warning(firstError?.message || "Preencha todos os campos!");
      return;
    }

    const selectedCategory = categories[parsed.data.categoryIndex];

    if (!selectedCategory) {
      toast.warning("Categoria invalida.");
      return;
    }

    const { name, price, description, image: validatedImage } = parsed.data;

    const data = new FormData();

    data.append("name", String(name));
    data.append("price", String(price));
    data.append("description", String(description));
    data.append("category_id", selectedCategory.id);
    data.append("file", validatedImage);

    const token = getCookieClient();

    if (!token) {
      toast.warning("Token nao encontrado. Faca login novamente.");
      return;
    }

    try {
      await api.post("/product", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Produto cadastrado com sucesso!");
      router.push("/dashboard");
    } catch (err) {
      console.log(err);
      toast.warning("Erro ao cadastrar produto.");
    }
  }

  return (
    <main className={styles.container}>
      <h1>Novo produto</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.labelImage}>
          <span className={styles.span}>
            <UploadCloud size={30} color="#fff" />
          </span>

          <input
            type="file"
            accept="image/png, image/jpeg"
            required
            onChange={handleFile}
            className={styles.inputFile}
          />

          {previewImage && (
            <Image
              src={previewImage}
              alt="Imagem de preview"
              className={styles.preview}
              fill
              quality={100}
              priority
            />
          )}
        </label>

        <select name="category">
          {categories.map((category, index) => (
            <option key={category.id} value={index}>
              {category.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="name"
          placeholder="Digite o nome do produto..."
          required
          className={styles.input}
        />

        <input
          type="text"
          name="price"
          placeholder="Digite o preco do produto..."
          required
          className={styles.input}
        />

        <textarea
          name="description"
          placeholder="Digite a descricao do produto..."
          required
          className={styles.input}
        ></textarea>

        <Button name="Cadastrar produto" />
      </form>
    </main>
  );
}
