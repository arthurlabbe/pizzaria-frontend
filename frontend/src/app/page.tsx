import styles from "./page.module.scss";
import logoImg from "@/../public/bella-forneria.png";
import Image from "next/image";
import Link from "next/link";
import { api } from "@/services/api";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
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
      const response = await api.post("/session", {
        email,
        password,
      });

      if (!response.data.token) {
        return;
      }

      console.log(response.data);

      const expressTime = 60 * 60 * 24 * 30;
      const cookieStore = await cookies();

      cookieStore.set("session", response.data.token, {
        maxAge: expressTime,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        httpOnly: false,
        sameSite: "lax",
      });
    } catch (err) {
      console.log(err);
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
            Nao possui uma conta? Cadastre-se
          </Link>
        </section>
      </div>
    </>
  );
}



