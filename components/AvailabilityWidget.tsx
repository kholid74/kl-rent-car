"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export type WidgetUnit = { slug: string; name: string };

/** Tanggal hari ini di WIB, format YYYY-MM-DD, untuk atribut min pada input. */
function todayJakarta(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta" }).format(new Date());
}

/**
 * Widget cek ketersediaan di hero.
 *
 * Ruang paling berharga di halaman dipakai untuk memulai konversi, bukan untuk
 * dekorasi. Widget ini belum memanggil API mana pun — ia hanya membawa pilihan
 * pengunjung ke form booking lewat query param, jadi bisa berdiri sekarang dan
 * otomatis tersambung ketika alur booking selesai.
 *
 * Memakai input type="date" bawaan peramban, bukan date picker pustaka: di
 * ponsel ia memanggil pemilih tanggal asli sistem, yang lebih nyaman daripada
 * kalender buatan mana pun.
 */
export function AvailabilityWidget({ units }: { units: WidgetUnit[] }) {
  const router = useRouter();
  const min = todayJakarta();
  const [unit, setUnit] = useState("");
  const [mulai, setMulai] = useState("");
  const [selesai, setSelesai] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const q = new URLSearchParams();
    if (unit) q.set("unit", unit);
    if (mulai) q.set("mulai", mulai);
    if (selesai) q.set("selesai", selesai);
    router.push(`/booking${q.size ? `?${q}` : ""}`);
  }

  const field =
    "min-h-12 w-full rounded-lg border border-road-200 bg-white px-3 text-navy-900 focus:border-navy-700";
  const label = "block text-sm font-semibold text-navy-900";

  return (
    <form onSubmit={submit} className="rounded-xl bg-white p-6 shadow-xl">
      <h2 className="font-display text-lg font-bold text-navy-900">Cek ketersediaan</h2>
      <div className="road-divider mt-3 w-20" aria-hidden="true" />

      <div className="mt-5 space-y-4">
        <div>
          <label htmlFor="w-unit" className={label}>
            Unit
          </label>
          <select
            id="w-unit"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className={`${field} mt-1.5`}
          >
            <option value="">Semua unit</option>
            {units.map((u) => (
              <option key={u.slug} value={u.slug}>
                {u.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="w-mulai" className={label}>
              Mulai
            </label>
            <input
              id="w-mulai"
              type="date"
              min={min}
              value={mulai}
              onChange={(e) => {
                setMulai(e.target.value);
                // Tanggal selesai yang lebih awal dari mulai tidak masuk akal;
                // dibersihkan di sini supaya form booking tidak menerima
                // kombinasi yang pasti ditolak validasinya.
                if (selesai && e.target.value > selesai) setSelesai("");
              }}
              className={`${field} mt-1.5`}
            />
          </div>
          <div>
            <label htmlFor="w-selesai" className={label}>
              Selesai
            </label>
            <input
              id="w-selesai"
              type="date"
              min={mulai || min}
              value={selesai}
              onChange={(e) => setSelesai(e.target.value)}
              className={`${field} mt-1.5`}
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-navy-900 font-semibold text-white transition-colors hover:bg-navy-700"
      >
        Cek Ketersediaan
      </button>
      <p className="mt-3 text-center text-sm text-navy-700/70">
        Tanpa pembayaran online. Admin mengonfirmasi lewat WhatsApp.
      </p>
    </form>
  );
}
