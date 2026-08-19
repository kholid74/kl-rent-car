type Chip = { label: string };

export function TrustChips({ chips, tone = "light" }: { chips: Chip[]; tone?: "light" | "dark" }) {
  const skin =
    tone === "dark"
      ? "border-white/25 bg-white/10 text-white"
      : "border-road-200 bg-road-100 text-navy-700";

  return (
    <ul className="flex flex-wrap gap-2">
      {chips.map((c) => (
        <li
          key={c.label}
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium ${skin}`}
        >
          <svg viewBox="0 0 24 24" className="size-4 shrink-0 text-amber-500" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m5 13 4 4L19 7" />
          </svg>
          {c.label}
        </li>
      ))}
    </ul>
  );
}
