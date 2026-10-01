"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";

import { useAdminDemo } from "./AdminShell";
import { IncomeView, OwnersView, PortalTitle } from "@/components/OwnershipViews";
import { BOOKING_STATUSES, day, driverAvailable, formatDate, money, vehicleAvailable, type Booking, type BookingStatus, type DemoData, type Service } from "@/lib/admin-demo";

const activeStatuses = ["Dikonfirmasi", "Berjalan", "Selesai"];
const periodOptions = [30, 90, 180] as const;
const sortNewest = (a: Booking, b: Booking) => b.created.localeCompare(a.created) || b.code.localeCompare(a.code);

function title(name: string, description: string, action?: React.ReactNode) {
  return <div className="admin-page-heading"><div><p className="admin-kicker">KL RENT CAR / OPERASIONAL</p><h1>{name}</h1><p>{description}</p></div>{action}</div>;
}
function badge(status: string) { return <span className={`admin-badge status-${status.toLowerCase().replaceAll(" ", "-")}`}>{status}</span>; }
function vehicleName(data: DemoData, slug: string) { return data.vehicles.find((v) => v.slug === slug)?.name ?? slug; }
function driverName(data: DemoData, id: string | null) { return data.drivers.find((d) => d.id === id)?.name ?? "Belum ditugaskan"; }
function percent(n: number, total: number) { return total ? Math.round(n / total * 100) : 0; }

function BookingTable({ bookings, data }: { bookings: Booking[]; data: DemoData }) {
  if (!bookings.length) return <div className="admin-empty">Tidak ada pesanan untuk filter ini.</div>;
  return <div className="admin-table-scroll"><table className="admin-table"><thead><tr><th>Pesanan</th><th>Pelanggan</th><th>Armada</th><th>Jadwal</th><th>Nilai estimasi</th><th>Status</th><th /></tr></thead><tbody>{bookings.map((b) => <tr key={b.code}><td><Link className="admin-table-link" href={`/admin/pesanan/${b.code}`}>{b.code}</Link><small>{b.service}</small></td><td>{b.customer}</td><td>{vehicleName(data, b.vehicle)}<small>{data.units.find((u) => u.id === b.unitId)?.plate} ? {data.owners.find((o) => o.id === data.units.find((u) => u.id === b.unitId)?.ownerId)?.name}</small></td><td>{formatDate(b.start)}</td><td>{money(b.value)}</td><td>{badge(b.status)}</td><td><Link className="admin-row-arrow" href={`/admin/pesanan/${b.code}`} aria-label={`Lihat ${b.code}`}>↗</Link></td></tr>)}</tbody></table></div>;
}

function Overview() {
  const { data, reset } = useAdminDemo();
  const [period, setPeriod] = useState<number>(90);
  const periodBookings = data.bookings.filter((b) => b.created >= day(-period) && b.created <= day(0));
  const pending = data.bookings.filter((b) => b.status === "Menunggu");
  const active = data.bookings.filter((b) => b.status === "Berjalan" && b.start <= day(0) && b.end >= day(0));
  const upcoming = data.bookings.filter((b) => b.status === "Dikonfirmasi" && b.start >= day(0) && b.start <= day(7));
  const availableCars = data.vehicles.reduce((n, v) => n + (v.active ? v.unitCount - v.maintenance : 0), 0) - active.length;
  const availableDrivers = data.drivers.filter((d) => d.status === "Tersedia" && driverAvailable(data.bookings, d.id, day(0), day(0))).length;
  const dueQuotes = data.quotes.filter((q) => (q.stage === "Baru" || q.stage === "Ditindaklanjuti") && q.due <= day(3));
  const unassigned = data.bookings.filter((b) => b.service === "Dengan sopir" && b.status === "Dikonfirmasi" && !b.driver);
  const confirmedValue = periodBookings.filter((b) => activeStatuses.includes(b.status)).reduce((n, b) => n + b.value, 0);

  const size = period === 180 ? 6 : period === 90 ? 9 : 6;
  const buckets = Array.from({ length: size }, (_, i) => {
    const from = day(-period + Math.floor(i * period / size));
    const to = i === size - 1 ? day(0) : day(-period + Math.floor((i + 1) * period / size) - 1);
    const orders = periodBookings.filter((b) => b.created >= from && b.created <= to);
    return { from, to, count: orders.length, pending: orders.filter((b) => b.status === "Menunggu").length, cancelled: orders.filter((b) => b.status === "Batal").length, active: orders.filter((b) => b.status !== "Menunggu" && b.status !== "Batal").length };
  });
  const maxBucket = Math.max(1, ...buckets.map((b) => b.count));
  const serviceCount = {
    driver: periodBookings.filter((b) => b.service === "Dengan sopir").length,
    self: periodBookings.filter((b) => b.service === "Lepas kunci").length,
    quote: data.quotes.filter((q) => q.created >= day(-period)).length,
  };
  const serviceTotal = serviceCount.driver + serviceCount.self + serviceCount.quote;

  return <>
    {title("Selamat datang di ruang kendali.", "Satu pandangan untuk keputusan perjalanan hari ini.", <button className="admin-text-button" onClick={reset}>↺ Reset demo</button>)}
    <div className="admin-alert"><span className="admin-alert-icon">✦</span><div><strong>{pending.length + dueQuotes.length + unassigned.length} hal perlu perhatian</strong><p>{pending.length} pesanan menunggu, {dueQuotes.length} penawaran perlu tindak lanjut, {unassigned.length} perjalanan tanpa sopir.</p></div><Link href="/admin/pesanan?status=Menunggu">Tinjau pesanan ↗</Link></div>
    <div className="admin-kpi-grid">
      <Link href="/admin/pesanan?status=Menunggu" className="admin-kpi"><span>Pesanan baru</span><strong>{pending.length.toString().padStart(2, "0")}</strong><small>Perlu konfirmasi ↗</small></Link>
      <Link href="/admin/pesanan?status=Berjalan" className="admin-kpi"><span>Perjalanan aktif</span><strong>{active.length.toString().padStart(2, "0")}</strong><small>Sedang berlangsung ↗</small></Link>
      <Link href={`/admin/pesanan?status=Dikonfirmasi&from=${day(0)}&to=${day(7)}&date=start`} className="admin-kpi"><span>7 hari mendatang</span><strong>{upcoming.length.toString().padStart(2, "0")}</strong><small>Keberangkatan ↗</small></Link>
      <Link href="/admin/armada" className="admin-kpi"><span>Mobil tersedia</span><strong>{Math.max(0, availableCars).toString().padStart(2, "0")}</strong><small>Dari seluruh armada ↗</small></Link>
      <Link href="/admin/sopir" className="admin-kpi"><span>Sopir tersedia</span><strong>{availableDrivers.toString().padStart(2, "0")}</strong><small>Siap ditugaskan ↗</small></Link>
    </div>
    <div className="admin-section-line"><div><h2>Performa bisnis</h2><p>Angka dihitung dari data demo yang dapat ditelusuri.</p></div><div className="admin-segment" aria-label="Periode statistik">{periodOptions.map((n) => <button key={n} className={period === n ? "is-active" : ""} onClick={() => setPeriod(n)}>{n === 180 ? "6 bulan" : `${n} hari`}</button>)}</div></div>
    <div className="admin-chart-grid">
      <section className="admin-panel admin-chart-main"><div className="admin-panel-head"><div><h3>Tren pesanan</h3><p>Pesanan masuk menurut tanggal dibuat</p></div><span>{periodBookings.length} pesanan</span></div><div className="admin-bar-chart">{buckets.map((b) => <Link key={b.from} href={`/admin/pesanan?from=${b.from}&to=${b.to}`} className="admin-bar-item" title={`${b.count} pesanan: ${b.active} aktif/selesai, ${b.pending} menunggu, ${b.cancelled} batal`}><span className="admin-bar-number">{b.count}</span><span className="admin-bar-track"><span className="admin-bar-stack" style={{ height: `${Math.max(5, percent(b.count, maxBucket))}%` }}><span className="is-active" style={{ height: `${percent(b.active, b.count)}%` }} /><span className="is-pending" style={{ height: `${percent(b.pending, b.count)}%` }} /><span className="is-cancelled" style={{ height: `${percent(b.cancelled, b.count)}%` }} /></span></span><small>{new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short" }).format(new Date(`${b.from}T12:00:00`))}</small></Link>)}</div><div className="admin-chart-foot">Klik batang untuk melihat pesanan pada periode tersebut <span>↗</span></div><div className="admin-chart-legend"><span>● Aktif / selesai</span><span>● Menunggu</span><span>● Batal</span></div></section>
      <section className="admin-panel admin-chart-side"><div className="admin-panel-head"><div><h3>Komposisi permintaan</h3><p>Menurut layanan dan penawaran</p></div></div><div className="admin-service-list">{[
        { name: "Dengan sopir", count: serviceCount.driver, href: "/admin/pesanan?service=Dengan+sopir", color: "gold" },
        { name: "Lepas kunci", count: serviceCount.self, href: "/admin/pesanan?service=Lepas+kunci", color: "dark" },
        { name: "Penawaran khusus", count: serviceCount.quote, href: `/admin/penawaran?from=${day(-period)}`, color: "pale" },
      ].map((s) => <Link key={s.name} href={s.href} className="admin-service-row"><span>{s.name}<strong>{s.count}</strong></span><span className="admin-service-track"><span className={s.color} style={{ width: `${percent(s.count, serviceTotal)}%` }} /></span></Link>)}</div><div className="admin-value"><span>Potensi nilai pesanan</span><strong>{money(confirmedValue)}</strong><small>Estimasi pesanan terkonfirmasi dalam periode ini. Bukan omzet.</small></div></section>
    </div>
    <div className="admin-chart-grid admin-chart-bottom"><section className="admin-panel"><div className="admin-panel-head"><div><h3>Pemakaian armada</h3><p>Hari mobil terpakai / kapasitas tersedia, {period} hari</p></div><Link href="/admin/armada">Lihat armada ↗</Link></div><div className="admin-util-list">{data.vehicles.map((v) => {
      const capacity = Math.max(1, (v.active ? v.unitCount - v.maintenance : 0) * period);
      const used = data.bookings.filter((b) => b.vehicle === v.slug && activeStatuses.includes(b.status)).reduce((n, b) => {
        const start = b.start > day(-period) ? b.start : day(-period);
        const end = b.end < day(0) ? b.end : day(0);
        return n + (start <= end ? Math.round((new Date(`${end}T12:00:00Z`).getTime() - new Date(`${start}T12:00:00Z`).getTime()) / 86400000) + 1 : 0);
      }, 0);
      const pct = v.active ? Math.min(100, percent(used, capacity)) : 0;
      return <Link key={v.slug} href={`/admin/armada/${v.slug}`} className="admin-util-row"><span>{v.name}</span><span className="admin-util-track"><span style={{ width: `${pct}%` }} /></span><strong>{pct}%</strong></Link>;
    })}</div></section><section className="admin-panel"><div className="admin-panel-head"><div><h3>Perlu tindakan</h3><p>Prioritas tim operasional</p></div></div><div className="admin-task-list">{pending.slice(0, 3).map((b) => <Link href={`/admin/pesanan/${b.code}`} key={b.code}><span className="admin-task-mark">●</span><span><strong>{b.customer}</strong><small>Konfirmasi {vehicleName(data, b.vehicle)} · {formatDate(b.start)}</small></span><span>↗</span></Link>)}{dueQuotes.slice(0, 2).map((q) => <Link href="/admin/penawaran" key={q.code}><span className="admin-task-mark gold">◆</span><span><strong>{q.customer}</strong><small>Tindak lanjut penawaran · {formatDate(q.due)}</small></span><span>↗</span></Link>)}</div></section></div>
  </>;
}

function Orders() {
  const { data, setData } = useAdminDemo();
  const params = useSearchParams();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(params.get("status") ?? "Semua");
  const [showCreate, setShowCreate] = useState(false);
  const [notice, setNotice] = useState("");
  const from = params.get("from"); const to = params.get("to"); const dateField = params.get("date") === "start" ? "start" : "created";
  const service = params.get("service");
  const filtered = data.bookings.filter((b) => (status === "Semua" || b.status === status) && (!service || b.service === service) && (!from || b[dateField] >= from) && (!to || b[dateField] <= to) && `${b.code} ${b.customer} ${vehicleName(data, b.vehicle)}`.toLowerCase().includes(search.toLowerCase())).sort(sortNewest);
  async function create(form: FormData) {
    const start = String(form.get("start")); const end = String(form.get("end")); const vehicle = String(form.get("vehicle")); const service = String(form.get("service")) as Service;
    if (!start || !end || start > end || !vehicleAvailable(data, vehicle, start, end)) { setNotice("Tanggal tidak valid atau kapasitas armada pada tanggal itu penuh."); return; }
    const v = data.vehicles.find((item) => item.slug === vehicle)!;
    if (service === "Lepas kunci" && v.priceSelfDrive === null) { setNotice("Armada ini hanya tersedia dengan sopir."); return; }
    const code = `KL-DM-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    const booking: Booking = { code, customer: String(form.get("customer")).trim(), phone: String(form.get("phone")).trim(), vehicle, driver: null, service, start, end, created: day(0), status: "Menunggu", pickup: String(form.get("pickup")).trim(), value: (service === "Lepas kunci" ? v.priceSelfDrive! : v.price) * (Math.round((new Date(`${end}T12:00:00Z`).getTime() - new Date(`${start}T12:00:00Z`).getTime()) / 86400000) + 1), note: "Pesanan dibuat dalam mode demo." };
    if (await setData((prev) => ({ ...prev, bookings: [booking, ...prev.bookings] }))) { setShowCreate(false); setNotice(`Pesanan ${code} berhasil dibuat.`); }
  }
  return <>{title("Pesanan", "Pantau permintaan, konfirmasi perjalanan, dan tugaskan sopir.", <button className="admin-primary" onClick={() => setShowCreate(!showCreate)}>{showCreate ? "Tutup formulir" : "+ Pesanan baru"}</button>)}
    {notice && <p className="admin-notice" role="status">{notice}</p>}
    {showCreate && <section className="admin-panel admin-form-panel"><h2>Buat pesanan contoh</h2><form action={create} className="admin-form-grid"><label>Nama pelanggan<input name="customer" required placeholder="Nama pelanggan" /></label><label>Nomor kontak fiktif<input name="phone" required placeholder="62812..." /></label><label>Armada<select name="vehicle">{data.vehicles.filter((v) => v.active).map((v) => <option key={v.slug} value={v.slug}>{v.name}</option>)}</select></label><label>Layanan<select name="service"><option>Dengan sopir</option><option>Lepas kunci</option></select></label><label>Mulai<input name="start" type="date" min={day(0)} required /></label><label>Selesai<input name="end" type="date" min={day(0)} required /></label><label className="admin-form-wide">Titik jemput<input name="pickup" required placeholder="Lokasi penjemputan" /></label><button className="admin-primary" type="submit">Simpan pesanan demo</button></form></section>}
    <section className="admin-panel admin-list-panel"><div className="admin-filter-row"><input aria-label="Cari pesanan" placeholder="Cari kode, pelanggan, atau mobil..." value={search} onChange={(e) => setSearch(e.target.value)} /><select aria-label="Filter status" value={status} onChange={(e) => setStatus(e.target.value)}><option>Semua</option>{BOOKING_STATUSES.map((s) => <option key={s}>{s}</option>)}</select><span>{filtered.length} pesanan</span></div>{(from || to || service) && <p className="admin-filter-note">Filter aktif: {from && to ? `${formatDate(from)}–${formatDate(to)}` : service} <Link href="/admin/pesanan">Hapus filter</Link></p>}<BookingTable bookings={filtered} data={data} /></section>
  </>;
}

function OrderDetail({ code }: { code: string }) {
  const { data, setData } = useAdminDemo();
  const booking = data.bookings.find((b) => b.code === code);
  const [notice, setNotice] = useState("");
  if (!booking) return <NotFound />;
  const unit = data.units.find((u) => u.id === booking.unitId);
  const owner = data.owners.find((o) => o.id === unit?.ownerId);
  const drivers = data.drivers.filter((d) => d.status === "Tersedia" && driverAvailable(data.bookings, d.id, booking.start, booking.end, booking.code));
  function save(form: FormData) {
    const status = String(form.get("status")) as BookingStatus;
    const vehicle = String(form.get("vehicle"));
    const driver = String(form.get("driver")) || null;
    if (!BOOKING_STATUSES.includes(status) || (status !== "Batal" && !vehicleAvailable(data, vehicle, booking!.start, booking!.end, code))) { setNotice("Armada tidak tersedia pada jadwal ini."); return; }
    if (driver && !drivers.some((d) => d.id === driver) && driver !== booking!.driver) { setNotice("Sopir tidak tersedia pada jadwal ini."); return; }
    const selectedVehicle = data.vehicles.find((item) => item.slug === vehicle)!;
    if (booking!.service === "Lepas kunci" && selectedVehicle.priceSelfDrive === null) { setNotice("Armada ini hanya tersedia dengan sopir."); return; }
    const days = Math.round((new Date(`${booking!.end}T12:00:00Z`).getTime() - new Date(`${booking!.start}T12:00:00Z`).getTime()) / 86400000) + 1;
    setData((prev) => ({ ...prev, bookings: prev.bookings.map((b) => b.code === code ? { ...b, status, vehicle, driver: b.service === "Lepas kunci" ? null : driver, value: vehicle === b.vehicle ? b.value : (b.service === "Lepas kunci" ? selectedVehicle.priceSelfDrive! : selectedVehicle.price) * days } : b) }));
    setNotice("Permintaan perubahan dikirim. Periksa hasil penyimpanan di atas.");
  }
  return <><Link href="/admin/pesanan" className="admin-back-link">← Kembali ke pesanan</Link>{title(booking.code, `${booking.customer} · ${booking.service}`, badge(booking.status))}<div className="admin-alert"><div><strong>{vehicleName(data, booking.vehicle)} · {unit?.plate}</strong><p>Pemilik: {owner?.name} · Bagian pemilik {booking.ownerRate}% · {money(Math.round(booking.value * (booking.ownerRate ?? 0) / 100))} {booking.status === "Selesai" ? "tercatat" : "estimasi"}</p></div><Link href="/admin/pemilik">Lihat pemilik ↗</Link></div>{notice && <p className="admin-notice" role="status">{notice}</p>}
    <div className="admin-detail-grid"><section className="admin-panel admin-form-panel"><h2>Kelola perjalanan</h2><form action={save} className="admin-form-stack"><label>Status<select name="status" defaultValue={booking.status} key={`${code}-${booking.status}`}>{BOOKING_STATUSES.map((s) => <option key={s}>{s}</option>)}</select></label><label>Armada<select name="vehicle" defaultValue={booking.vehicle} key={`${code}-${booking.vehicle}`}>{data.vehicles.filter((v) => v.active).map((v) => <option key={v.slug} value={v.slug}>{v.name}</option>)}</select></label>{booking.service === "Dengan sopir" && <label>Sopir<select name="driver" defaultValue={booking.driver ?? ""} key={`${code}-${booking.driver}`}><option value="">Belum ditugaskan</option>{data.drivers.filter((d) => drivers.some((a) => a.id === d.id) || d.id === booking.driver).map((d) => <option key={d.id} value={d.id}>{d.name}{d.id === booking.driver && !drivers.some((a) => a.id === d.id) ? " · sedang bertugas" : ""}</option>)}</select><small>Hanya sopir yang tersedia pada tanggal pesanan yang dapat dipilih.</small></label>}<button className="admin-primary" type="submit">Simpan perubahan</button></form></section>
      <section className="admin-panel admin-info-panel"><h2>Detail pesanan</h2><dl><div><dt>Pelanggan</dt><dd>{booking.customer}</dd></div><div><dt>Kontak fiktif</dt><dd>{booking.phone}</dd></div><div><dt>Tanggal</dt><dd>{formatDate(booking.start)} – {formatDate(booking.end)}</dd></div><div><dt>Titik jemput</dt><dd>{booking.pickup}</dd></div><div><dt>Nilai estimasi</dt><dd>{money(booking.value)}</dd></div><div><dt>Catatan</dt><dd>{booking.note}</dd></div></dl><button className="admin-secondary" onClick={() => navigator.clipboard.writeText(`Halo ${booking.customer}, kami menindaklanjuti pesanan ${booking.code} untuk ${vehicleName(data, booking.vehicle)}.`).then(() => setNotice("Contoh pesan disalin. Nomor fiktif tidak dihubungi."))}>Salin contoh pesan</button></section></div>
  </>;
}

function Quotes() {
  const { data, setData } = useAdminDemo();
  const from = useSearchParams().get("from");
  const [notice, setNotice] = useState("");
  return <>{title("Penawaran", "Peluang untuk kontrak rutin dan perjalanan khusus.")}{notice && <p className="admin-notice" role="status">{notice}</p>}{from && <p className="admin-filter-note">Dibuat sejak {formatDate(from)} <Link href="/admin/penawaran">Hapus filter</Link></p>}<div className="admin-quote-grid">{data.quotes.filter((q) => !from || q.created >= from).map((q) => <article key={q.code} className="admin-panel admin-quote"><div className="admin-quote-top"><span>{q.code}</span>{badge(q.stage)}</div><h2>{q.customer}</h2><p>{q.need}</p><div className="admin-quote-meta"><span>Estimasi<br /><strong>{money(q.value)}</strong></span><span>Tindak lanjut<br /><strong>{formatDate(q.due)}</strong></span></div><div className="admin-quote-fields"><label>Estimasi harga<input type="number" min="0" step="50000" value={q.value} onChange={(e) => { const value = Number(e.target.value); setData((prev) => ({ ...prev, quotes: prev.quotes.map((item) => item.code === q.code ? { ...item, value } : item) })); }} /></label><label>Tenggat tindak lanjut<input type="date" value={q.due} onChange={(e) => setData((prev) => ({ ...prev, quotes: prev.quotes.map((item) => item.code === q.code ? { ...item, due: e.target.value } : item) }))} /></label></div><label>Tahap penawaran<select value={q.stage} onChange={(e) => { const stage = e.target.value as typeof q.stage; setData((prev) => ({ ...prev, quotes: prev.quotes.map((item) => item.code === q.code ? { ...item, stage } : item) })); setNotice(`${q.code} sekarang ${stage.toLowerCase()}.`); }}><option>Baru</option><option>Ditindaklanjuti</option><option>Disepakati</option><option>Tidak jadi</option></select></label></article>)}</div></>;
}

function Schedule() {
  const { data } = useAdminDemo();
  const [offset, setOffset] = useState(0);
  const dates = Array.from({ length: 7 }, (_, i) => day(offset * 7 + i));
  const weekday = (d: string) => new Intl.DateTimeFormat("id-ID", { weekday: "short" }).format(new Date(`${d}T12:00:00`));
  return <>{title("Jadwal perjalanan", "Lihat penugasan armada dan sopir dalam satu minggu.", <div className="admin-schedule-nav"><button onClick={() => setOffset(offset - 1)}>←</button><button onClick={() => setOffset(0)}>Hari ini</button><button onClick={() => setOffset(offset + 1)}>→</button></div>)}<section className="admin-panel admin-calendar-panel"><div className="admin-calendar-scroll"><div className="admin-calendar"><div className="admin-calendar-cell admin-calendar-head">Armada</div>{dates.map((d) => <div key={d} className="admin-calendar-cell admin-calendar-head"><span>{weekday(d)}</span><strong>{formatDate(d)}</strong></div>)}{data.vehicles.map((v) => <div className="admin-calendar-row" key={v.slug}><Link href={`/admin/armada/${v.slug}`} className="admin-calendar-cell admin-calendar-vehicle"><strong>{v.name}</strong><small>{v.unitCount - v.maintenance} mobil tersedia</small></Link>{dates.map((d) => { const orders = data.bookings.filter((b) => b.vehicle === v.slug && b.start <= d && b.end >= d && b.status !== "Batal" && b.status !== "Selesai"); return <div className="admin-calendar-cell admin-calendar-day" key={d}>{orders.map((b) => <Link href={`/admin/pesanan/${b.code}`} key={b.code} className={`admin-calendar-event ${b.status === "Menunggu" ? "is-pending" : ""}`} title={`${b.customer} · ${driverName(data, b.driver)}`}><strong>{b.customer.split(" ")[0]}</strong><small>{b.driver ? driverName(data, b.driver).split(" ")[0] : b.status}</small></Link>)}</div>; })}</div>)}</div></div><p className="admin-calendar-legend"><span>● Terkonfirmasi / berjalan</span><span>● Menunggu</span> Klik blok untuk membuka detail pesanan.</p></section></>;
}

function Fleet() {
  const { data } = useAdminDemo();
  return <>{title("Armada", "Pantau kapasitas, kesiapan, dan tarif delapan model kendaraan.")}<div className="admin-fleet-grid">{data.vehicles.map((v) => <Link key={v.slug} href={`/admin/armada/${v.slug}`} className="admin-fleet-card"><div className="admin-fleet-image"><Image src={v.image} alt={v.name} width={420} height={250} /></div><div className="admin-fleet-copy"><span>{v.category} · {v.seats} kursi</span><h2>{v.name}</h2><p>{v.unitCount - v.maintenance} dari {v.unitCount} mobil siap · {v.maintenance} perawatan<br />Mulai {money(v.price)} / 12 jam</p><div>{badge(v.active ? "Aktif" : "Nonaktif")}<strong>Kelola ↗</strong></div></div></Link>)}</div></>;
}

function FleetDetail({ slug }: { slug: string }) {
  const { data, setData } = useAdminDemo();
  const v = data.vehicles.find((item) => item.slug === slug);
  const [notice, setNotice] = useState("");
  if (!v) return <NotFound />;
  const orders = data.bookings.filter((b) => b.vehicle === slug && b.start >= day(-7) && b.status !== "Batal").sort((a, b) => a.start.localeCompare(b.start));
  function save(form: FormData) { const maintenance = Number(form.get("maintenance")); const price = Number(form.get("price")); if (!Number.isInteger(maintenance) || maintenance < 0 || maintenance > v!.unitCount || !Number.isFinite(price) || price < 0) { setNotice("Periksa jumlah perawatan dan tarif yang diisi."); return; } setData((prev) => ({ ...prev, vehicles: prev.vehicles.map((item) => item.slug === slug ? { ...item, maintenance, price, active: form.get("active") === "on" } : item) })); setNotice("Permintaan perubahan armada dikirim. Periksa hasil penyimpanan di atas."); }
  return <><Link href="/admin/armada" className="admin-back-link">← Kembali ke armada</Link>{title(v.name, `${v.category} · ${v.seats} kursi · ${v.unitCount} mobil`, badge(v.active ? "Aktif" : "Nonaktif"))}{notice && <p className="admin-notice" role="status">{notice}</p>}<div className="admin-detail-grid"><section className="admin-panel admin-form-panel"><div className="admin-detail-photo"><Image src={v.image} alt={v.name} width={700} height={400} /></div><h2>Ketersediaan model</h2><form action={save} className="admin-form-stack"><label>Tarif dengan sopir / 12 jam<input type="number" name="price" min="0" step="50000" defaultValue={v.price} key={`${slug}-${v.price}`} /></label><label>Mobil dalam perawatan<input type="number" name="maintenance" min="0" max={v.unitCount} defaultValue={v.maintenance} key={`${slug}-${v.maintenance}`} /><small>Jumlah ini mengurangi kapasitas yang bisa dipesan.</small></label><label className="admin-check"><input type="checkbox" name="active" defaultChecked={v.active} key={`${slug}-${v.active}`} /> Tampilkan sebagai model aktif</label><button type="submit" className="admin-primary">Simpan perubahan</button></form></section><section className="admin-panel admin-info-panel"><h2>Mobil fisik & pemilik</h2><div className="admin-compact-list">{data.units.filter((u) => u.vehicle === slug).map((u) => <Link href="/admin/pemilik" key={u.id}><span><strong>{u.plate}</strong><small>{data.owners.find((o) => o.id === u.ownerId)?.name}</small></span><span>?</span></Link>)}</div><h2>Perjalanan terkait</h2><div className="admin-compact-list">{orders.length ? orders.slice(0, 9).map((b) => <Link key={b.code} href={`/admin/pesanan/${b.code}`}><span><strong>{b.customer}</strong><small>{formatDate(b.start)} · {b.code}</small></span>{badge(b.status)}</Link>) : <p>Belum ada perjalanan mendatang.</p>}</div></section></div></>;
}

function Drivers() {
  const { data } = useAdminDemo();
  return <>{title("Sopir", "Ketersediaan tim dan perjalanan yang sedang ditangani.")}<div className="admin-driver-grid">{data.drivers.map((d) => { const assignments = data.bookings.filter((b) => b.driver === d.id && b.end >= day(0) && b.status !== "Batal" && b.status !== "Selesai"); return <Link href={`/admin/sopir/${d.id}`} className="admin-panel admin-driver-card" key={d.id}><div className="admin-driver-avatar">{d.name.split(" ").map((s) => s[0]).slice(0, 2).join("")}</div><div><span>{d.id}</span><h2>{d.name}</h2><p>{d.experience} pengalaman · {assignments.length} tugas mendatang</p></div>{badge(d.status)}</Link>; })}</div></>;
}

function DriverDetail({ id }: { id: string }) {
  const { data, setData } = useAdminDemo();
  const d = data.drivers.find((item) => item.id === id);
  if (!d) return <NotFound />;
  const orders = data.bookings.filter((b) => b.driver === id && b.end >= day(-7)).sort((a, b) => a.start.localeCompare(b.start));
  return <><Link href="/admin/sopir" className="admin-back-link">← Kembali ke sopir</Link>{title(d.name, `${d.experience} pengalaman · ${d.id}`, badge(d.status))}<div className="admin-detail-grid"><section className="admin-panel admin-form-panel"><h2>Profil dan ketersediaan</h2><p>Nomor kontak fiktif: {d.phone}</p><label>Status sopir<select value={d.status} onChange={(e) => setData((prev) => ({ ...prev, drivers: prev.drivers.map((item) => item.id === id ? { ...item, status: e.target.value as typeof d.status } : item) }))}><option>Tersedia</option><option>Cuti</option></select></label><p className="admin-hint">Sopir yang cuti tidak dapat dipilih untuk penugasan baru.</p></section><section className="admin-panel admin-info-panel"><h2>Jadwal tugas</h2><div className="admin-compact-list">{orders.length ? orders.slice(0, 10).map((b) => <Link key={b.code} href={`/admin/pesanan/${b.code}`}><span><strong>{vehicleName(data, b.vehicle)}</strong><small>{formatDate(b.start)} · {b.customer}</small></span>{badge(b.status)}</Link>) : <p>Belum ada tugas mendatang.</p>}</div></section></div></>;
}

function Customers() {
  const { data } = useAdminDemo();
  const [search, setSearch] = useState("");
  const customers = useMemo(() => Array.from(new Map(data.bookings.map((b) => [b.phone, b.customer])).entries()).map(([phone, name]) => ({ phone, name, bookings: data.bookings.filter((b) => b.phone === phone).sort(sortNewest) })).sort((a, b) => b.bookings.length - a.bookings.length), [data.bookings]);
  return <>{title("Pelanggan", "Riwayat perjalanan pelanggan dari pesanan contoh.")}<section className="admin-panel admin-list-panel"><div className="admin-filter-row"><input aria-label="Cari pelanggan" placeholder="Cari nama atau nomor..." value={search} onChange={(e) => setSearch(e.target.value)} /><span>{customers.length} pelanggan</span></div><div className="admin-customer-list">{customers.filter((c) => `${c.name} ${c.phone}`.toLowerCase().includes(search.toLowerCase())).map((c) => <details key={c.phone}><summary><span className="admin-customer-avatar">{c.name.charAt(0)}</span><span><strong>{c.name}</strong><small>{c.phone}</small></span><span>{c.bookings.length} pesanan</span><span>⌄</span></summary><div>{c.bookings.map((b) => <Link key={b.code} href={`/admin/pesanan/${b.code}`}>{b.code} · {vehicleName(data, b.vehicle)} · {formatDate(b.start)} <span>↗</span></Link>)}</div></details>)}</div></section></>;
}

function Reports() {
  const { data } = useAdminDemo();
  const [period, setPeriod] = useState(90);
  const [vehicle, setVehicle] = useState("Semua");
  const [status, setStatus] = useState("Semua");
  const [service, setService] = useState("Semua");
  const rows = data.bookings.filter((b) => b.created >= day(-period) && (vehicle === "Semua" || b.vehicle === vehicle) && (service === "Semua" || b.service === service) && (status === "Semua" || b.status === status)).sort(sortNewest);
  const confirmed = rows.filter((b) => activeStatuses.includes(b.status));
  function exportCsv() {
    const cells = [["Kode", "Tanggal dibuat", "Pelanggan", "Armada", "Layanan", "Mulai", "Selesai", "Status", "Estimasi"], ...rows.map((b) => [b.code, b.created, b.customer, vehicleName(data, b.vehicle), b.service, b.start, b.end, b.status, String(b.value)])];
    const csv = "\uFEFF" + cells.map((row) => row.map((cell) => `"${String(cell).replace(/^\s*[=+\-@]|^[\t\r\n]/, "'$&").replaceAll('"', '""')}"`).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = "kl-rent-car-laporan-demo.csv"; link.click(); URL.revokeObjectURL(url);
  }
  return <>{title("Laporan", "Baca angka sampai ke pesanan yang membentuknya.", <button className="admin-secondary" onClick={exportCsv}>↓ Ekspor CSV demo</button>)}<section className="admin-panel admin-list-panel"><div className="admin-filter-row"><select aria-label="Periode laporan" value={period} onChange={(e) => setPeriod(Number(e.target.value))}><option value="30">30 hari</option><option value="90">90 hari</option><option value="180">6 bulan</option></select><select aria-label="Armada laporan" value={vehicle} onChange={(e) => setVehicle(e.target.value)}><option>Semua</option>{data.vehicles.map((v) => <option key={v.slug} value={v.slug}>{v.name}</option>)}</select><select aria-label="Layanan laporan" value={service} onChange={(e) => setService(e.target.value)}><option>Semua</option><option>Dengan sopir</option><option>Lepas kunci</option></select><select aria-label="Status laporan" value={status} onChange={(e) => setStatus(e.target.value)}><option>Semua</option>{BOOKING_STATUSES.map((s) => <option key={s}>{s}</option>)}</select></div><div className="admin-report-kpis"><div><span>Pesanan masuk</span><strong>{rows.length}</strong></div><div><span>Terkonfirmasi / berjalan / selesai</span><strong>{confirmed.length}</strong></div><div><span>Potensi nilai · estimasi</span><strong>{money(confirmed.reduce((n, b) => n + b.value, 0))}</strong></div></div><BookingTable bookings={rows} data={data} /></section></>;
}

function NotFound() { return <div className="admin-empty-page"><h1>Halaman tidak ditemukan.</h1><p>Menu atau data demo ini tidak tersedia.</p><Link href="/admin">Kembali ke ringkasan ↗</Link></div>; }

function Ownership({ income = false }: { income?: boolean }) {
  const { data } = useAdminDemo();
  return income ? <><PortalTitle title="Pendapatan" description="Nilai rental, bagian pemilik, dan bagian rental dari perjalanan selesai." /><IncomeView data={data} admin /></> : <OwnersView data={data} />;
}

export default function AdminScreen() {
  const pathname = usePathname();
  const path = pathname.replace(/^\/admin\/?/, "").split("/").filter(Boolean);
  if (!path.length) return <Overview />;
  if (path[0] === "pemilik" && path.length === 1) return <Ownership />;
  if (path[0] === "pendapatan" && path.length === 1) return <Ownership income />;
  if (path[0] === "pesanan") return path[1] ? <OrderDetail code={decodeURIComponent(path[1])} /> : <Orders />;
  if (path[0] === "penawaran" && !path[1]) return <Quotes />;
  if (path[0] === "jadwal" && !path[1]) return <Schedule />;
  if (path[0] === "armada") return path[1] ? <FleetDetail slug={decodeURIComponent(path[1])} /> : <Fleet />;
  if (path[0] === "sopir") return path[1] ? <DriverDetail id={decodeURIComponent(path[1])} /> : <Drivers />;
  if (path[0] === "pelanggan" && !path[1]) return <Customers />;
  if (path[0] === "laporan" && !path[1]) return <Reports />;
  return <NotFound />;
}
