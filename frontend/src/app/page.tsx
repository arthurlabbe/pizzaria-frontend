"use client";

import { useRouter } from "next/navigation";
import styles from "./page.module.scss";
import logoImg from "@/../public/bella-forneria.png";
import Image from "next/image";
import Link from "next/link";
import { loginSchema } from "@/lib/validation";

export default function Page() {
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const form = new FormData(e.target as HTMLFormElement);

    const parseResult = loginSchema.safeParse({
      email: form.get("email"),
      password: form.get("password"),
    });

    if (!parseResult.success) {
      console.error(parseResult.error.flatten().formErrors);
      return;
    }

    const { email, password } = parseResult.data;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/session`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        console.error("Falha no login");
        return;
      }

      router.push("/dashboard");
    } catch (err) {
      console.error("Erro ao acessar API:", err);
    }
  }

  return (
    <div className={styles.containerCenter}>
      <Image src={logoImg} alt="Logo da pizzaria" className={styles.logo} />

      <section className={styles.login}>
        <form className={styles.formulario} onSubmit={handleLogin}>
          <input
            type="email"
            required
            name="email"
            placeholder="Digite o seu email..."
            className={styles.input}
          />

          <input
            type="password"
            required
            name="password"
            placeholder="Digite a sua senha..."
            className={styles.input}
          />

          <button type="submit" className={styles.button}>
            Acessar
          </button>
        </form>

        <Link href="/signup" className={styles.text}>
          Não possui uma conta? Cadastre-se!
        </Link>
      </section>
    </div>
  );
}