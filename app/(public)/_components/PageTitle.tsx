export function PageTitle({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) {
  return (
    <header className="max-w-3xl">
      {eyebrow ? <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-navy-700/70">{eyebrow}</p> : null}
      <h1 className="font-display text-3xl font-extrabold text-navy-900 sm:text-4xl">{title}</h1>
      <div className="road-divider mt-4 w-24" aria-hidden="true" />
      {description ? <p className="mt-4 text-lg text-navy-700">{description}</p> : null}
    </header>
  );
}
