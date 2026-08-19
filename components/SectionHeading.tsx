type Props = {
  /** Level heading. Home punya satu H1 di hero, jadi section lain memakai H2. */
  as?: "h1" | "h2" | "h3";
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

/**
 * Heading section beserta divider marka jalan di bawahnya — satu-satunya
 * elemen dekoratif tematik situs ini, dipakai konsisten di seluruh halaman.
 */
export function SectionHeading({ as: Tag = "h2", eyebrow, title, description, align = "left" }: Props) {
  const centered = align === "center";
  return (
    <div className={centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow ? (
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-navy-700/70">{eyebrow}</p>
      ) : null}
      <Tag
        className={`font-display font-extrabold text-navy-900 ${
          Tag === "h1" ? "text-3xl sm:text-4xl lg:text-5xl" : "text-2xl sm:text-3xl"
        }`}
      >
        {title}
      </Tag>
      <div className={`road-divider mt-4 w-24 ${centered ? "mx-auto" : ""}`} aria-hidden="true" />
      {description ? <p className="mt-4 text-navy-700">{description}</p> : null}
    </div>
  );
}
