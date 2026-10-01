import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import OwnerShell from "@/components/OwnerShell";
import { IncomeView, PortalTitle, RentalTable, Status, UnitCards } from "@/components/OwnershipViews";
import { getDemoSession } from "@/lib/demo-session";
import { readDemo } from "@/lib/demo-store";
import { day, formatDate, money } from "@/lib/admin-demo";
import { monthKey, ownerData, ownerIncome, unitStatus } from "@/lib/ownership";
import "../../admin/admin.css";

export default async function OwnerPage({ params }: { params: Promise<{ path?: string[] }> }) {
  const session = await getDemoSession();
  if (session?.role !== "owner" || !session.ownerId) redirect("/demo");
  const data = ownerData(await readDemo(session.id), session.ownerId);
  const owner = data.owners[0];
  if (!owner) notFound();
  const { path = [] } = await params;
  const upcoming = data.bookings.filter((b) => ["Menunggu", "Dikonfirmasi", "Berjalan"].includes(b.status) && b.end >= day(0)).sort((a, b) => a.start.localeCompare(b.start));
  const history = data.bookings.filter((b) => ["Selesai", "Batal"].includes(b.status)).sort((a, b) => b.end.localeCompare(a.end));
  let content;
  if (!path.length) {
    const income = data.bookings.filter((b) => b.end.startsWith(monthKey())).reduce((n, b) => n + ownerIncome(b), 0);
    content = <><PortalTitle title={`Selamat datang, ${owner.name.split(" ")[0]}.`} description="Pantau kendaraan dan hasil kemitraan Anda bersama KL Rent Car." /><div className="portal-welcome"><div><p className="admin-kicker">TRANSPARAN DI SETIAP PERJALANAN</p><h2>Kendaraan Anda.<br />Kami yang mengelola.</h2><p>Jadwal, perjalanan, dan bagian pendapatan Anda selalu dalam satu pandangan.</p></div><span>Akses lihat saja<br /><strong>{formatDate(day(0))}</strong></span></div><div className="admin-kpi-grid portal-summary">{[
      ["Kendaraan saya", String(data.units.length), "kendaraan"], ["Sedang disewa", String(data.units.filter((u) => unitStatus(data, u) === "Sedang Disewa").length), "jadwal"], ["Tersedia", String(data.units.filter((u) => unitStatus(data, u) === "Tersedia").length), "kendaraan"], ["Booking mendatang", String(upcoming.filter((b) => b.start > day(0) && b.status !== "Berjalan").length), "jadwal"], ["Pendapatan bulan ini", money(income), "pendapatan"],
    ].map(([label, value, href]) => <Link key={label} href={`/pemilik/${href}`} className="admin-kpi"><span>{label}</span><strong>{value}</strong><small>Lihat rincian ↗</small></Link>)}</div><div className="admin-section-line"><div><h2>Kendaraan dalam pengelolaan</h2><p>Status terbaru mobil titipan Anda.</p></div><Link href="/pemilik/kendaraan">Lihat semua ↗</Link></div><UnitCards data={data} units={data.units.slice(0, 3)} /><section className="admin-panel portal-section"><div className="admin-panel-head"><h3>Perjalanan aktif & berikutnya</h3><Link href="/pemilik/jadwal">Lihat jadwal ↗</Link></div><RentalTable data={data} bookings={upcoming.slice(0, 5)} /></section></>;
  } else if (path[0] === "kendaraan" && path.length === 1) {
    content = <><PortalTitle title="Kendaraan saya" description={`${data.units.length} kendaraan milik ${owner.name} dalam pengelolaan KL Rent Car.`} /><UnitCards data={data} /></>;
  } else if (path[0] === "kendaraan" && path.length === 2) {
    const unit = data.units.find((u) => u.id === path[1]);
    if (!unit) notFound();
    const model = data.vehicles.find((v) => v.slug === unit.vehicle)!;
    const rows = data.bookings.filter((b) => b.unitId === unit.id);
    const active = rows.filter((b) => b.status === "Berjalan");
    const next = upcoming.filter((b) => b.unitId === unit.id && b.status !== "Berjalan");
    content = <><Link href="/pemilik/kendaraan" className="admin-back-link">← Kendaraan saya</Link><PortalTitle title={model.name} description={`${unit.plate} · Milik ${owner.name}`} /><div className="admin-detail-grid"><section className="admin-panel admin-form-panel"><div className="admin-detail-photo"><Image src={model.image} alt={model.name} width={700} height={400} /></div><Status value={unitStatus(data, unit)} /><p className="admin-hint">{model.category} · {model.seats} kursi · Nomor polisi {unit.plate}</p></section><section className="admin-panel admin-info-panel"><h2>Hasil kemitraan</h2><dl><div><dt>Pendapatan bulan ini</dt><dd>{money(rows.filter((b) => b.end.startsWith(monthKey())).reduce((n, b) => n + ownerIncome(b), 0))}</dd></div><div><dt>Total pendapatan tercatat</dt><dd>{money(rows.reduce((n, b) => n + ownerIncome(b), 0))}</dd></div><div><dt>Bagian pemilik</dt><dd>{owner.share}% dari nilai rental</dd></div><div><dt>Perjalanan selesai</dt><dd>{rows.filter((b) => b.status === "Selesai").length} perjalanan</dd></div></dl><p className="admin-hint">Pendapatan dari perjalanan selesai; belum dikurangi biaya operasional.</p></section></div><section className="admin-panel portal-section"><h2>Booking aktif</h2><RentalTable data={data} bookings={active} /></section><section className="admin-panel portal-section"><h2>Booking berikutnya</h2><RentalTable data={data} bookings={next} /></section><section className="admin-panel portal-section"><h2>Riwayat penyewaan</h2><RentalTable data={data} bookings={history.filter((b) => b.unitId === unit.id)} financial /></section></>;
  } else if (path.length === 1 && path[0] === "jadwal") {
    content = <><PortalTitle title="Jadwal booking" description="Perjalanan aktif dan mendatang, diurutkan berdasarkan tanggal mulai. Status menunggu masih memerlukan konfirmasi rental." /><section className="admin-panel"><RentalTable data={data} bookings={upcoming} /></section></>;
  } else if (path.length === 1 && path[0] === "riwayat") {
    content = <><PortalTitle title="Riwayat penyewaan" description="Perjalanan selesai dan dibatalkan untuk kendaraan Anda." /><section className="admin-panel"><RentalTable data={data} bookings={history} financial /></section></>;
  } else if (path.length === 1 && path[0] === "pendapatan") {
    content = <><PortalTitle title="Pendapatan" description="Lihat hasil kemitraan dari setiap kendaraan dan perjalanan." /><IncomeView data={data} /></>;
  } else notFound();
  return <OwnerShell name={owner.name}>{content}</OwnerShell>;
}
