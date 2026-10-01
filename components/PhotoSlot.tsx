import Image from "next/image";

/** Foto baru ditampilkan setelah ditempatkan di folder foto manual. */
export function manualPhoto(src: string): boolean {
  return src.startsWith("/images/manual/");
}

export function PhotoSlot({
  label,
  src,
  eager = false,
  className = "",
  sizes = "(max-width: 768px) 100vw, 50vw",
}: {
  label: string;
  src?: string;
  eager?: boolean;
  className?: string;
  sizes?: string;
}) {
  return (
    <div className={`relative overflow-hidden bg-[#E9E5DC] ${className}`}>
      {src && manualPhoto(src) ? (
        <Image src={src} alt={label} fill sizes={sizes} loading={eager ? "eager" : "lazy"} fetchPriority={eager ? "high" : undefined} className="object-cover" />
      ) : (
        <div className="absolute inset-0 flex flex-col justify-end p-5 text-[#5F5D58] sm:p-7">
          <p className="text-xs">Foto belum tersedia</p>
          <p className="mt-1 max-w-[80%] font-display text-base font-semibold text-[#151515] sm:text-lg">{label}</p>
        </div>
      )}
    </div>
  );
}
