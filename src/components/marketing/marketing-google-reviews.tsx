import { GOOGLE_REVIEWS } from "@/components/marketing/google-reviews-data";

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} sur 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className={`h-3.5 w-3.5 ${i < rating ? "fill-[#fbbc04] text-[#fbbc04]" : "fill-white/10 text-white/10"}`}
          aria-hidden
        >
          <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  );
}

function GoogleMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export function MarketingGoogleReviews() {
  const { placeName, placeCity, rating, reviewCount, mapsUrl, reviews } = GOOGLE_REVIEWS;

  return (
    <section id="avis" className="border-y border-white/[0.05] bg-astor-surface/50 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-astor-accent">
              <GoogleMark className="h-4 w-4" />
              Avis Google
            </p>
            <h2 className="font-display mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ce que disent les clients
              <br className="hidden sm:block" />
              chez {placeName}
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-zinc-500">
              Avis publics réels de clients sur Google — restaurant pilote ASTOR à {placeCity}.
            </p>
          </div>

          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-5 py-4 transition hover:border-white/15 hover:bg-white/[0.05]"
          >
            <GoogleMark className="h-8 w-8 shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-2xl font-bold text-white">{rating.toFixed(1)}</span>
                <StarRow rating={Math.round(rating)} />
              </div>
              <p className="mt-0.5 text-xs text-zinc-500">
                {reviewCount}+ avis · Voir sur Google Maps →
              </p>
            </div>
          </a>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {reviews.map((review) => (
            <article
              key={`${review.author}-${review.text.slice(0, 24)}`}
              className="flex flex-col rounded-2xl border border-white/[0.07] bg-gradient-to-b from-white/[0.04] to-transparent p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-astor-accent/20 text-sm font-semibold text-astor-accent-bright">
                    {review.author.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{review.author}</p>
                    <p className="text-[11px] text-zinc-500">Avis {review.source}</p>
                  </div>
                </div>
                <StarRow rating={review.rating} />
              </div>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-zinc-300">{review.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
