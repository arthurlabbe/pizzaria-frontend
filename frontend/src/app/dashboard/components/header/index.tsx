"use client";

import Link from "next/link";
import styles from "./styles.module.scss";
import Image from "next/image";
import logoImg from "@/../public/bella-forneria.png";
import { LogOutIcon } from "lucide-react";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function Header() {
  const router = useRouter();

  async function handleLogout() {
    deleteCookie("session", { path: "/" });
    toast.success("Logout realizado com sucesso!");
    router.replace("/");
  }

  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Link href="/dashboard">
          <Image
            alt="Logo BellaForneria"
            src={logoImg}
            width={270}
            height={130}
            priority={true}
            quality={100}
            className={styles.logo}
          />
        </Link>

        <nav className={styles.nav}>
          <Link href="/dashboard/category">Categoria</Link>
          <Link href="/dashboard/product">Produto</Link>
          <form action={handleLogout}>
            <button type="submit">
              <LogOutIcon size={24} color="#6a4a17" />
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
}
