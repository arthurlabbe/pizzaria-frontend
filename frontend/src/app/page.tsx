"use client";

import { useState, FormEvent } from "react";
import styles from "./page.module.scss";
import logoImg from "/public/logo.png";
import Image from "next/image";
import { api } from "@/services/api";
import { useRouter } from "next/navigation";
import { setCookie } from "nookies";

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: FormEvent) {
    event.preventDefault();

    if (email === "" || password === "") {
      alert("Preencha todos os campos");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/session", {
        email,
        password,
      });

      const { token } = response.data;

      setCookie(undefined, "session", token, {
        maxAge: 60 * 60 * 24 * 30, // 30 dias
        path: "/",
      });

      router.push("/dashboard");

    } catch (err) {
      console.log(err);
      alert("Erro ao acessar!"); 
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.containerCenter}>
      <Image src={logoImg} alt="Logo Bella Forneria" />

      <div className={styles.login}>
        <form onSubmit={handleLogin}>
          <input
            placeholder="Digite seu email"
            type="text"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            placeholder="Sua senha"
            type="password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "Carregando..." : "Acessar"}
          </button>
        </form>
      </div>
    </div>
  );
}