"use client";

import { useState } from "react";
import { WA_NUMBER } from "@/lib/site";

type Unit = { slug: string; name: string };

export function BookingForm({ units, initialUnit, initialStart, initialEnd }: { units: Unit[]; initialUnit: string; initialStart: string; initialEnd: string }) {
  const [unit, setUnit] = useState(initialUnit);
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const selected = units.find((item) => item.slug === data.get("unit"));
    const message = [
      `Halo KL Rent Car, saya ingin mengajukan pemesanan${selected ? ` ${selected.name}` : ""}.`,
      `Layanan: ${data.get("service")}`,
      `Tanggal: ${data.get("mulai")} sampai ${data.get("selesai")}`,
      `Lokasi jemput: ${data.get("lokasi")}`,
      `Nama: ${data.get("nama")}`,
      `Nomor WhatsApp: ${data.get("telepon")}`,
      `Catatan: ${data.get("catatan") || "-"}`,
      "Mohon konfirmasi ketersediaan dan total biaya. Terima kasih.",
    ].join("\n");
    window.location.href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
  }
  const field = "mt-1.5 min-h-12 w-full rounded-lg border border-road-200 bg-white px-3 text-navy-900";
  return <form onSubmit={submit} className="mt-8 grid gap-5 rounded-xl border border-road-200 bg-white p-6 sm:grid-cols-2">
    <label className="text-sm font-semibold text-navy-900">Unit<select name="unit" value={unit} onChange={(e) => setUnit(e.target.value)} className={field}><option value="">Pilih unit</option>{units.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}</select></label>
    <label className="text-sm font-semibold text-navy-900">Jenis layanan<select name="service" className={field}><option>Lepas kunci</option><option>Dengan sopir</option></select></label>
    <label className="text-sm font-semibold text-navy-900">Tanggal mulai<input name="mulai" type="date" defaultValue={initialStart} required className={field} /></label>
    <label className="text-sm font-semibold text-navy-900">Tanggal selesai<input name="selesai" type="date" defaultValue={initialEnd} required className={field} /></label>
    <label className="text-sm font-semibold text-navy-900">Lokasi jemput<input name="lokasi" required className={field} /></label>
    <label className="text-sm font-semibold text-navy-900">Nama<input name="nama" autoComplete="name" required className={field} /></label>
    <label className="text-sm font-semibold text-navy-900">Nomor WhatsApp<input name="telepon" type="tel" autoComplete="tel" required className={field} /></label>
    <label className="text-sm font-semibold text-navy-900 sm:col-span-2">Catatan<textarea name="catatan" rows={3} className={field} /></label>
    <p className="text-sm text-navy-700 sm:col-span-2">Permintaan akan dibuka sebagai pesan WhatsApp. Pemesanan baru berlaku setelah admin mengonfirmasi ketersediaan.</p>
    <button type="submit" className="inline-flex min-h-12 items-center justify-center rounded-lg bg-navy-900 px-5 font-semibold text-white sm:col-span-2">Lanjutkan ke WhatsApp</button>
  </form>;
}
