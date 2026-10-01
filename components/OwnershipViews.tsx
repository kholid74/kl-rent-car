import Link from "next/link";
import Image from "next/image";
import { day, formatDate, money, type Booking, type DemoData, type PhysicalUnit } from "@/lib/admin-demo";
import { duration, monthKey, ownerIncome, unitStatus } from "@/lib/ownership";

export function PortalTitle({ title, description }: { title: string; description: string }) {
  return <div className="admin-page-heading"><div><p className="admin-kicker">KL RENT CAR / KEMITRAAN</p><h1>{title}</h1><p>{description}</p></div></div>;
}
export function Status({ value }: { value: string }) {
  return <span className={`admin-badge status-${value.toLowerCase().replaceAll(" ", "-")}`}>{value}</span>;
}
export function RentalTable({ data, bookings, admin = false, financial = false }: { data: DemoData; bookings: Booking[]; admin?: boolean; financial?: boolean }) {
  if (!bookings.length) return <p className="admin-empty">Belum ada perjalanan pada periode ini.</p>;
  return <div className="admin-table-scroll"><table className="admin-table"><thead><tr><th>Pesanan / kendaraan</th>{admin && <th>Pemilik</th>}<th>Periode sewa</th><th>Durasi</th><th>Status</th>{financial && <><th>Nilai rental</th><th>Bagian pemilik</th>{admin && <th>Bagian rental</th>}</>}</tr></thead><tbody>{bookings.map((b) => {
    const unit = data.units.find((u) => u.id === b.unitId);
    return <tr key={b.code}><td><Link className="admin-table-link" href={admin ? `/admin/pesanan/${b.code}` : `/pemilik/kendaraan/${unit?.id}`}>{data.vehicles.find((v) => v.slug === b.vehicle)?.name}</Link><small>{unit?.plate} · {b.code}</small></td>{admin && <td>{data.owners.find((o) => o.id === unit?.ownerId)?.name}</td>}<td>{formatDate(b.start)}<small>s.d. {formatDate(b.end)}</small></td><td>{duration(b)} hari</td><td><Status value={b.status} /></td>{financial && <><td>{money(b.value)}</td><td>{money(ownerIncome(b))}<small>{b.ownerRate}% · {b.status === "Selesai" ? "Tercatat" : "Belum menjadi pendapatan"}</small></td>{admin && <td>{money(b.status === "Selesai" ? b.value - ownerIncome(b) : 0)}</td>}</>}</tr>;
  })}</tbody></table></div>;
}

export function UnitCards({ data, units = data.units }: { data: DemoData; units?: PhysicalUnit[] }) {
  return <div className="admin-fleet-grid">{units.map((unit) => {
    const model = data.vehicles.find((v) => v.slug === unit.vehicle)!;
    const active = data.bookings.find((b) => b.unitId === unit.id && b.status === "Berjalan");
    const next = data.bookings.filter((b) => b.unitId === unit.id && ["Menunggu", "Dikonfirmasi"].includes(b.status) && b.end >= day(0)).sort((a, b) => a.start.localeCompare(b.start))[0];
    return <Link href={`/pemilik/kendaraan/${unit.id}`} key={unit.id} className="admin-fleet-card"><div className="admin-fleet-image"><Image src={model.image} alt={model.name} width={420} height={250} /></div><div className="admin-fleet-copy"><span>{model.category} · {model.seats} kursi</span><h2>{model.name}</h2><p className="portal-plate">{unit.plate}</p><div><Status value={unitStatus(data, unit)} /><strong>Lihat detail ↗</strong></div><p>{active ? `Disewa sampai ${formatDate(active.end)}` : next ? `${next.status}: ${formatDate(next.start)}` : "Belum ada booking mendatang"}</p></div></Link>;
  })}</div>;
}

export function IncomeView({ data, admin = false }: { data: DemoData; admin?: boolean }) {
  const completed = data.bookings.filter((b) => b.status === "Selesai").sort((a, b) => b.end.localeCompare(a.end));
  const monthly = Array.from({ length: 6 }, (_, i) => {
    const month = monthKey(i - 5);
    const rows = completed.filter((b) => b.end.startsWith(month));
    return { month, owner: rows.reduce((n, b) => n + ownerIncome(b), 0), gross: rows.reduce((n, b) => n + b.value, 0) };
  });
  const current = monthly[5]; const previous = monthly[4];
  const max = Math.max(1, ...monthly.map((m) => m.owner));
  return <>
    <div className="admin-kpi-grid portal-income-kpis">{[
      ["Bagian pemilik bulan ini", current.owner], ["Bagian pemilik bulan lalu", previous.owner],
      ...(admin ? [["Nilai rental bulan ini", current.gross], ["Bagian rental bulan ini", current.gross - current.owner]] : []),
    ].map(([label, value]) => <div className="admin-kpi" key={label}><span>{label}</span><strong>{money(Number(value))}</strong><small>Perjalanan selesai</small></div>)}</div>
    <p className="admin-hint">Pendapatan dicatat pada tanggal selesai sewa. Nilai rental dibagi sesuai persentase kesepakatan saat booking; belum dikurangi biaya operasional dan bukan bukti transfer. Booking menunggu, berjalan, dan batal belum menjadi pendapatan.</p>
    <section className="admin-panel portal-section"><div className="admin-panel-head"><div><h3>Bagian pemilik · 6 bulan terakhir</h3><p>Nominal tetap terlihat tanpa mengandalkan warna grafik</p></div></div><div className="portal-income-chart">{monthly.map((m) => <div key={m.month}><strong>{money(m.owner)}</strong><div className="portal-income-track"><span style={{ height: `${m.owner / max * 100}%` }} /></div><small>{new Intl.DateTimeFormat("id-ID", { month: "short", year: "2-digit" }).format(new Date(`${m.month}-01T12:00:00`))}</small></div>)}</div></section>
    <section className="admin-panel portal-section"><h2>Pendapatan per kendaraan <small>· bulan ini</small></h2><div className="admin-table-scroll"><table className="admin-table"><thead><tr><th>Kendaraan</th>{admin && <th>Pemilik</th>}<th>Perjalanan selesai</th><th>Nilai rental</th><th>Bagian pemilik</th>{admin && <th>Bagian rental</th>}</tr></thead><tbody>{data.units.map((u) => {
      const rows = completed.filter((b) => b.unitId === u.id && b.end.startsWith(monthKey()));
      const gross = rows.reduce((n, b) => n + b.value, 0); const share = rows.reduce((n, b) => n + ownerIncome(b), 0);
      return <tr key={u.id}><td>{data.vehicles.find((v) => v.slug === u.vehicle)?.name}<small>{u.plate}</small></td>{admin && <td>{data.owners.find((o) => o.id === u.ownerId)?.name}</td>}<td>{rows.length}</td><td>{money(gross)}</td><td>{money(share)}</td>{admin && <td>{money(gross - share)}</td>}</tr>;
    })}</tbody></table></div></section>
    {admin && <section className="admin-panel portal-section"><h2>Pendapatan per pemilik · bulan ini</h2><div className="admin-table-scroll"><table className="admin-table"><thead><tr><th>Pemilik</th><th>Nilai rental</th><th>Bagian pemilik</th><th>Bagian rental</th></tr></thead><tbody>{data.owners.map((o) => { const rows = completed.filter((b) => b.end.startsWith(monthKey()) && data.units.some((u) => u.id === b.unitId && u.ownerId === o.id)); const gross = rows.reduce((n, b) => n + b.value, 0); const share = rows.reduce((n, b) => n + ownerIncome(b), 0); return <tr key={o.id}><td>{o.name}</td><td>{money(gross)}</td><td>{money(share)}</td><td>{money(gross - share)}</td></tr>; })}</tbody></table></div></section>}
    <section className="admin-panel portal-section"><h2>Riwayat pendapatan terbaru</h2><RentalTable data={data} bookings={completed.slice(0, 20)} financial admin={admin} /></section>
  </>;
}

export function OwnersView({ data }: { data: DemoData }) {
  return <><PortalTitle title="Pemilik kendaraan" description="Kemitraan, mobil titipan, dan pembagian hasil dalam satu pandangan." /><div className="portal-owner-list">{data.owners.map((owner) => {
    const units = data.units.filter((u) => u.ownerId === owner.id);
    const income = data.bookings.filter((b) => b.end.startsWith(monthKey()) && units.some((u) => u.id === b.unitId)).reduce((n, b) => n + ownerIncome(b), 0);
    return <section key={owner.id} className="admin-panel portal-section"><div className="admin-panel-head"><div><h3>{owner.name}</h3><p>Kontak demo: +{owner.phone} · Bagian pemilik {owner.share}%</p></div><span>{money(income)} / bulan ini</span></div><p className="admin-hint">{units.length} kendaraan · {units.filter((u) => unitStatus(data, u) !== "Perawatan").length} kendaraan aktif · {units.filter((u) => unitStatus(data, u) === "Sedang Disewa").length} sedang disewa</p><div className="admin-compact-list">{units.map((u) => <Link key={u.id} href={`/admin/armada/${u.vehicle}`}><span><strong>{data.vehicles.find((v) => v.slug === u.vehicle)?.name}</strong><small>{u.plate}</small></span><Status value={unitStatus(data, u)} /></Link>)}</div></section>;
  })}</div></>;
}
