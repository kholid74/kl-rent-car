import Link from "next/link";

import type { Service } from "@/lib/content/services";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <Link
      href={`/layanan/${service.slug}`}
      className="group flex flex-col rounded-xl border border-road-200 bg-white p-6 transition-shadow hover:shadow-md"
    >
      <h3 className="font-display text-lg font-bold text-navy-900 group-hover:text-navy-700">
        {service.title}
      </h3>
      <div className="road-divider mt-3 w-20" aria-hidden="true" />
      <p className="mt-4 flex-1 text-sm text-navy-700">{service.summary}</p>
      <p className="tabular mt-5 font-display font-extrabold text-amber-500">{service.priceHint}</p>
    </Link>
  );
}
