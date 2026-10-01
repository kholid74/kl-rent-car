"use client";

import { useActionState } from "react";
import Link from "next/link";

import { loginAdmin } from "../actions";

export default function LoginForm() {
  const [error, action, pending] = useActionState(loginAdmin, null);
  return (
    <main className="admin-login">
      <section className="admin-login-story">
        <Link href="/" className="admin-wordmark">KL<span> / </span>Rent Car</Link>
        <div>
          <p className="admin-kicker">PORTAL ADMIN & PEMILIK</p>
          <h1>Kendali penuh.<br /><em>Perjalanan tenang.</em></h1>
          <p>Rental mengelola perjalanan. Pemilik memantau kendaraan dan hasil kemitraan, melalui akun masing-masing.</p>
        </div>
        <span>KL RENT CAR · DEMO KALSARA</span>
      </section>
      <section className="admin-login-form-wrap">
        <div className="admin-login-form">
          <p className="admin-kicker">AKSES DEMO</p>
          <h2>Selamat datang kembali.</h2>
          <p>Gunakan email dan kata sandi yang diberikan tim Kalsara. Hak akses mengikuti akun Anda.</p>
          <form action={action}>
            <label htmlFor="admin-email">Email</label>
            <input id="admin-email" name="email" type="email" autoComplete="username" required placeholder="nama@perusahaan.com" />
            <label htmlFor="admin-password">Kata sandi</label>
            <input id="admin-password" name="password" type="password" autoComplete="current-password" required placeholder="Masukkan kata sandi" />
            {error && <p className="admin-form-error" role="alert">{error}</p>}
            <button type="submit" disabled={pending}>{pending ? "Memeriksa..." : "Masuk ke dashboard"}<span aria-hidden="true">↗</span></button>
          </form>
          <Link href="/" className="admin-back">← Kembali ke website</Link>
        </div>
      </section>
    </main>
  );
}
