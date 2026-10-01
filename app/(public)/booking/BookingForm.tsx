"use client";

import { useState } from "react";
import Link from "next/link";
import { DEMO_MODE, WA_NUMBER } from "@/lib/site";
import { checkAvailability, submitDemoBooking } from "@/app/demo/actions";
import { day, money } from "@/lib/admin-demo";

type Unit = { slug: string; name: string; priceSelfDrive: number | null };

export function BookingForm({ units, initialUnit, initialStart, initialEnd }: { units: Unit[]; initialUnit: string; initialStart: string; initialEnd: string }) {
  const [unit, setUnit] = useState(initialUnit);
  const [start, setStart] = useState(initialStart);
  const [end, setEnd] = useState(initialEnd);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState<{ code: string; value: number; url: string } | null>(null);
  const selected = units.find((item) => item.slug === unit);
  async function check() {
    setBusy(true); setNotice("");
    try {
      const result = await checkAvailability(unit, start, end);
      setNotice(result.error ?? (result.available ? "Mobil tersedia pada periode ini. Lanjutkan permintaan untuk ditinjau admin." : "Mobil penuh pada periode ini. Pilih tanggal atau model lain."));
    } catch { setNotice("Ketersediaan belum dapat diperiksa. Coba lagi."); }
    finally { setBusy(false); }
  }
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const input = { vehicle: unit, service: String(form.get("service")), start, end, pickup: String(form.get("lokasi")), customer: String(form.get("nama")), phone: String(form.get("telepon")), note: String(form.get("catatan") ?? "") };
    if (start < day(0) || end < start) { setNotice("Periksa tanggal mulai dan selesai sewa."); return; }
    const message = [
      `Halo KL Rent Car, saya ingin mengajukan pemesanan ${selected?.name ?? ""}.`,
      `Layanan: ${input.service}`, `Tanggal: ${start} sampai ${end}`, `Lokasi jemput: ${input.pickup}`,
      `Nama: ${input.customer}`, `Nomor WhatsApp: ${input.phone}`, `Catatan: ${input.note || "-"}`,
      "Mohon konfirmasi ketersediaan dan total biaya. Terima kasih.",
    ];
    if (!DEMO_MODE) { window.location.href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message.join("\n"))}`; return; }
    setBusy(true); setNotice("");
    try {
      const result = await submitDemoBooking(input);
      if (result.error || !result.code) { setNotice(result.error ?? "Permintaan belum tersimpan."); return; }
      message.unshift(`Kode permintaan: ${result.code}`);
      setSuccess({ code: result.code, value: result.value!, url: `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message.join("\n"))}` });
    } catch { setNotice("Permintaan belum tersimpan. Periksa koneksi lalu coba lagi."); }
    finally { setBusy(false); }
  }
  const field = "mt-1.5 min-h-12 w-full rounded-lg border border-road-200 bg-white px-3 text-navy-900";
  if (success) return <section className="mt-8 space-y-5 rounded-xl border border-road-200 bg-white p-6" aria-live="polite"><p className="text-sm font-semibold text-navy-700">PERMINTAAN DEMO TERSIMPAN</p><h2 className="text-2xl font-semibold">{success.code}</h2><p>Estimasi {money(success.value)}. Status: menunggu konfirmasi admin. Belum ada pembayaran.</p><p>Permintaan sudah terhubung ke kendaraan dan pemiliknya. Lanjutkan percakapan untuk mengonfirmasi detail perjalanan.</p><a href={success.url} className="inline-flex min-h-12 items-center rounded-lg bg-navy-900 px-5 font-semibold text-white">Lanjutkan ke WhatsApp ↗</a><div><Link href="/demo" className="font-semibold underline underline-offset-4">Lihat permintaan sebagai admin →</Link></div></section>;
  return <form onSubmit={submit} className="mt-8 rounded-xl border border-road-200 bg-white p-6"><fieldset disabled={busy} className="grid min-w-0 gap-5 sm:grid-cols-2">
    <label className="text-sm font-semibold text-navy-900">Unit<select name="unit" required value={unit} onChange={(e) => { setUnit(e.target.value); setNotice(""); }} className={field}><option value="">Pilih unit</option>{units.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}</select></label>
    <label className="text-sm font-semibold text-navy-900">Jenis layanan<select name="service" key={unit} className={field}>{selected?.priceSelfDrive != null && <option>Lepas kunci</option>}<option>Dengan sopir</option></select></label>
    <label className="text-sm font-semibold text-navy-900">Tanggal mulai<input name="mulai" type="date" min={day(0)} value={start} onChange={(e) => { setStart(e.target.value); setNotice(""); if (end < e.target.value) setEnd(""); }} required className={field} /></label>
    <label className="text-sm font-semibold text-navy-900">Tanggal selesai<input name="selesai" type="date" min={start || day(0)} value={end} onChange={(e) => { setEnd(e.target.value); setNotice(""); }} required className={field} /></label>
    {DEMO_MODE && <button type="button" disabled={!unit || !start || !end} onClick={check} className="min-h-12 rounded-lg border border-navy-900 px-5 font-semibold disabled:opacity-50 sm:col-span-2">{busy ? "Memproses…" : "Cek ketersediaan"}</button>}
    <label className="text-sm font-semibold text-navy-900">Lokasi jemput<input name="lokasi" maxLength={300} required className={field} /></label>
    <label className="text-sm font-semibold text-navy-900">Nama<input name="nama" maxLength={300} autoComplete="name" required className={field} /></label>
    <label className="text-sm font-semibold text-navy-900">Nomor WhatsApp<input name="telepon" type="tel" maxLength={16} autoComplete="tel" required placeholder="0812…" className={field} /></label>
    <label className="text-sm font-semibold text-navy-900 sm:col-span-2">Catatan<textarea name="catatan" maxLength={2000} rows={3} className={field} /></label>
    {notice && <p role="status" className="rounded-lg bg-road-100 p-4 text-sm text-navy-900 sm:col-span-2">{notice}</p>}
    <p className="text-sm text-navy-700 sm:col-span-2">{DEMO_MODE ? "Gunakan identitas fiktif untuk demo. Permintaan tercatat di dashboard rental, lalu dapat dilanjutkan melalui WhatsApp." : "Permintaan akan dibuka sebagai pesan WhatsApp."} Pemesanan baru berlaku setelah admin mengonfirmasi ketersediaan.</p>
    <button type="submit" className="inline-flex min-h-12 items-center justify-center rounded-lg bg-navy-900 px-5 font-semibold text-white disabled:opacity-50 sm:col-span-2">{busy ? "Memproses…" : DEMO_MODE ? "Ajukan pemesanan" : "Lanjutkan ke WhatsApp"}</button>
  </fieldset></form>;
}
