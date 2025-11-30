import Image from "next/image";
import Link from "next/link";
import styles from "../page.module.scss";
import logoImg from "@/../public/bella-forneria.png";
import { api } from "@/services/api";
import { redirect } from "next/navigation";
import { signupSchema } from "@/lib/validation";

export default function Signup() {
  async function handleRegister(formData: FormData) {
    "use server";

    const parseResult = signupSchema.safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!parseResult.success) {
      console.error(parseResult.error.flatten().formErrors);
      return;
    }

    const { name, email, password } = parseResult.data;
    try {
      await api.post("/users", {
        name,
        email,
        password,
      });
    } catch (err) {
      console.log("error");
      console.log(err);
    }
    redirect("/");
  }

  return (
    <>
      <div className={styles.containerCenter}>
        <Image src={logoImg} alt="Logo da pizzaria" className={styles.logo} />

        <section className={styles.login}>
          <h1>Criando sua conta</h1>
          <form action={handleRegister} className={styles.formulario}>
            <input
              type="text"
              required
              name="name"
              placeholder="Digite o seu nome completo..."
              className={styles.input}
            />

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
              Cadastrar
            </button>
          </form>

          <Link href="/" className={styles.text}>
            Ja possui uma conta? Faca o login
          </Link>
        </section>
      </div>
    </>
  );
}
