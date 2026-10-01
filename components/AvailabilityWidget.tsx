"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export type WidgetUnit = { slug: string; name: string };

/** Tanggal hari ini di WIB, format YYYY-MM-DD, untuk atribut min pada input. */
function todayJakarta(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta" }).format(new Date());
}

/**
 * Widget awal permintaan booking.
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
    "min-h-12 w-full rounded-none border-0 border-b border-[#817E77] bg-transparent px-0 text-navy-900 focus:border-navy-900";
  const label = "block text-sm font-medium text-navy-700";

  return (
    <form onSubmit={submit} className="bg-white px-6 py-8 sm:px-9 sm:py-9">
      <h3 className="font-display text-xl font-semibold text-navy-900">Mulai permintaan</h3>
      <div className="mt-7 space-y-6">
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

        <div className="grid gap-6 sm:grid-cols-2">
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

      <div className="mt-8 flex flex-col gap-5 border-t border-road-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-56 text-sm text-navy-700">Admin mengonfirmasi detail lewat WhatsApp.</p>
        <button
          type="submit"
          className="inline-flex min-h-12 items-center justify-center bg-navy-900 px-6 font-semibold text-white transition-colors hover:bg-[#303030]"
        >
          Lanjut ke formulir
        </button>
      </div>
    </form>
  );
}
