import type { Testimonial } from "@/lib/content/testimonials";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`Penilaian ${rating} dari 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg
          key={n}
          viewBox="0 0 24 24"
          className={`size-4 ${n <= rating ? "text-amber-500" : "text-road-200"}`}
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="m12 2 2.9 6.26 6.85.72-5.1 4.6 1.42 6.72L12 16.9 5.93 20.3l1.42-6.72-5.1-4.6 6.85-.72Z" />
        </svg>
      ))}
    </div>
  );
}

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="flex h-full flex-col rounded-xl border border-road-200 bg-white p-6">
      <Stars rating={testimonial.rating} />
      <blockquote className="mt-4 flex-1 text-navy-700">
        <p>&ldquo;{testimonial.quote}&rdquo;</p>
      </blockquote>
      <figcaption className="mt-5 border-t border-road-200 pt-4">
        <p className="font-semibold text-navy-900">{testimonial.name}</p>
        <p className="text-sm text-navy-700/70">{testimonial.context}</p>
      </figcaption>
    </figure>
  );
}
