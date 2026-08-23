export const GOOGLE_REVIEWS = {
  placeName: "El Bahja Grillades",
  placeCity: "Montpellier",
  rating: 4.2,
  reviewCount: 500,
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=El+Bahja+Grillades+63+Avenue+de+Palavas+Montpellier",
  reviews: [
    {
      author: "Hayate H.",
      rating: 5,
      text: "C'est mon adresse préférée à Montpellier à faire à chaque passage. Les grillades sont délicieux. Je recommande les yeux fermés.",
      source: "Google",
    },
    {
      author: "Eric S.",
      rating: 5,
      text: "Très bonne, bien servie. Viande de très bonne qualité et fraîche.",
      source: "Google",
    },
    {
      author: "Lamia B.",
      rating: 5,
      text: "Franchement, chaque fois qu'on mange là-bas on est toujours satisfait. Très propre et le service au top. Rien à dire.",
      source: "Google",
    },
    {
      author: "EJA A.",
      rating: 5,
      text: "Sandwich brochette juste magnifique à 5€ avec frites. Seul problème : il est tellement bon que le restaurant est blindé, mais on patiente — ça vaut le détour.",
      source: "Google",
    },
  ],
} as const;
