"use client";

import { createContext, useContext, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { logoutAdmin } from "@/app/admin/actions";
import { type DemoData } from "@/lib/admin-demo";
import { saveAdminDemo } from "@/app/demo/actions";

type DemoContextValue = { data: DemoData; setData: (next: React.SetStateAction<DemoData>) => Promise<boolean>; reset: () => void };
const DemoContext = createContext<DemoContextValue | null>(null);
export function useAdminDemo() {
  const value = useContext(DemoContext);
  if (!value) throw new Error("Admin demo harus berada dalam AdminShell.");
  return value;
}

const links = [
  { href: "/admin", label: "Ringkasan", icon: "▦" },
  { href: "/admin/pesanan", label: "Pesanan", icon: "▤" },
  { href: "/admin/penawaran", label: "Penawaran", icon: "◇" },
  { href: "/admin/jadwal", label: "Jadwal", icon: "▦" },
  { href: "/admin/armada", label: "Armada", icon: "▰" },
  { href: "/admin/pemilik", label: "Pemilik kendaraan", icon: "◇" },
  { href: "/admin/pendapatan", label: "Pendapatan", icon: "▥" },
  { href: "/admin/sopir", label: "Sopir", icon: "♙" },
  { href: "/admin/pelanggan", label: "Pelanggan", icon: "◎" },
  { href: "/admin/laporan", label: "Laporan", icon: "▥" },
];

export default function AdminShell({ children, initialData, initialRevision }: { children: React.ReactNode; initialData: DemoData; initialRevision: string }) {
  const [data, updateData] = useState(initialData);
  const current = useRef(initialData);
  const version = useRef(initialRevision);
  const saving = useRef(false);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  async function persist(next: DemoData, reset = false) {
    if (saving.current) return false;
    saving.current = true; setBusy(true); setNotice("Menyimpan perubahan…");
    try {
      const result = await saveAdminDemo(next, version.current, reset);
      if (result.error || !result.data) { setNotice(result.error ?? "Gagal menyimpan."); return false; }
      current.current = result.data; version.current = result.revision!; updateData(result.data);
      setNotice("Tersimpan. Jadwal dan portal pemilik telah diperbarui.");
      return true;
    } catch { setNotice("Perubahan belum tersimpan. Periksa koneksi lalu coba kembali."); return false; }
    finally { saving.current = false; setBusy(false); }
  }
  const setData = (next: React.SetStateAction<DemoData>) => persist(typeof next === "function" ? next(current.current) : next);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  return (
    <DemoContext.Provider value={{ data, setData, reset: () => { void persist(current.current, true); } }}>
      <div className="admin-shell">
        <aside className={`admin-sidebar ${mobileOpen ? "is-open" : ""}`}>
          <div className="admin-brand"><Link href="/admin">KL<span> / </span>Rent Car</Link><small>RUANG OPERASIONAL</small></div>
          <nav aria-label="Menu admin">
            <span className="admin-nav-label">RUANG KERJA</span>
            {links.map((item) => {
              const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
              return <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className={active ? "is-active" : ""} aria-current={active ? "page" : undefined}><span aria-hidden="true">{item.icon}</span>{item.label}</Link>;
            })}
          </nav>
          <div className="admin-sidebar-foot"><span className="admin-demo-dot" /> Mode demo aktif <small>Data operasional hanya contoh</small></div>
        </aside>
        {mobileOpen && <button className="admin-mobile-scrim" aria-label="Tutup menu" onClick={() => setMobileOpen(false)} />}
        <div className="admin-main-wrap">
          <header className="admin-topbar">
            <button className="admin-menu-toggle" onClick={() => setMobileOpen(true)} aria-label="Buka menu">☰</button>
            <div className="admin-topbar-text"><strong>KL Rent Car</strong><span> / Ruang Operasional</span></div>
            <div className="admin-top-actions"><Link href="/">Website</Link><Link href="/demo">Ganti peran</Link><form action={logoutAdmin}><button type="submit">Keluar <span aria-hidden="true">↗</span></button></form></div>
          </header>
          <main className="admin-content">{notice && <p className="admin-notice" role="status">{notice}</p>}<fieldset disabled={busy} className="portal-fieldset">{children}</fieldset></main>
        </div>
      </div>
    </DemoContext.Provider>
  );
}
