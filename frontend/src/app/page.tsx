import styles from "./page.module.scss";
import logoImg from "@/../public/bella-forneria.png";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { loginSchema } from "@/lib/validation";

export default function Page() {
  async function handleLogin(formData: FormData) {
    "use server";

    const parseResult = loginSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
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
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  }
);


      if (!response.ok) {
        console.log("Falha no login");
        return;
      }

    } catch (err) {
      console.log("Erro ao acessar API:", err);
      return;
    }

    redirect("/dashboard");
  }

  return (
    <>
      <div className={styles.containerCenter}>
        <Image src={logoImg} alt="Logo da pizzaria" className={styles.logo} />

        <section className={styles.login}>
          <form className={styles.formulario} action={handleLogin}>
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
    </>
  );
}