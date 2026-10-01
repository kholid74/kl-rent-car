"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { switchRole } from "@/app/demo/actions";

export default function OwnerShell({ name, children }: { name: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  return <div className="admin-shell owner-shell"><aside className={`admin-sidebar ${open ? "is-open" : ""}`}><div className="admin-brand"><Link href="/pemilik">KL<span> / </span>Rent Car</Link><small>PORTAL PEMILIK KENDARAAN</small></div><nav aria-label="Menu pemilik"><span className="admin-nav-label">KEMITRAAN ANDA</span>{[["", "Ringkasan", "▦"], ["/kendaraan", "Kendaraan saya", "▰"], ["/jadwal", "Jadwal booking", "▤"], ["/riwayat", "Riwayat penyewaan", "◷"], ["/pendapatan", "Pendapatan", "▥"]].map(([path, label, icon]) => {
    const active = path ? pathname.startsWith(`/pemilik${path}`) : pathname === "/pemilik";
    return <Link href={`/pemilik${path}`} key={path} className={active ? "is-active" : ""} aria-current={active ? "page" : undefined} onClick={() => setOpen(false)}><span aria-hidden="true">{icon}</span>{label}</Link>;
  })}</nav><div className="admin-sidebar-foot"><span className="admin-demo-dot" /> Akses lihat saja<small>Operasional dikelola KL Rent Car</small></div></aside>{open && <button className="admin-mobile-scrim" aria-label="Tutup menu" onClick={() => setOpen(false)} />}<div className="admin-main-wrap"><header className="admin-topbar"><button className="admin-menu-toggle" aria-label="Buka menu" aria-expanded={open} onClick={() => setOpen(!open)}>☰</button><div className="admin-topbar-text"><strong>{name}</strong><span> / Pemilik kendaraan</span></div><div className="admin-top-actions"><Link href="/demo">Ganti peran</Link><form action={switchRole}><button name="account" value="customer">Keluar ↗</button></form></div></header><main className="admin-content">{children}</main></div></div>;
}
