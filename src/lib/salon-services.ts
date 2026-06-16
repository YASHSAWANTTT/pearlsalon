/** Pearl Beauty & Spa Salon — official rate card */
export const SERVICE_CATEGORY_ORDER = [
  "Facials",
  "D-Tan",
  "Normal Waxing",
  "Rica Waxing",
  "Bleach",
  "Threading",
  "Head Massage",
  "Polishing",
] as const;

export type SalonServiceCategory = (typeof SERVICE_CATEGORY_ORDER)[number];

type RateCardEntry = {
  name: string;
  price: number;
  durationMinutes: number;
};

type RateCardCategory = {
  category: SalonServiceCategory;
  services: RateCardEntry[];
};

export const RATE_CARD: RateCardCategory[] = [
  {
    category: "Facials",
    services: [
      { name: "Fruit Facial", price: 550, durationMinutes: 45 },
      { name: "Herbal Facial", price: 650, durationMinutes: 45 },
      { name: "Almond Facial", price: 900, durationMinutes: 50 },
      { name: "Chocolate Facial", price: 1000, durationMinutes: 55 },
      { name: "Wine Facial", price: 1000, durationMinutes: 55 },
      { name: "D-Tan Facial", price: 1000, durationMinutes: 55 },
      { name: "Gold Facial", price: 1200, durationMinutes: 60 },
      { name: "Lotus Facial", price: 1200, durationMinutes: 60 },
      { name: "Hydra Facial", price: 2000, durationMinutes: 75 },
      { name: "Real Fruit Facial", price: 2500, durationMinutes: 90 },
      { name: "O3+ Facial (with all machine)", price: 3500, durationMinutes: 120 },
    ],
  },
  {
    category: "D-Tan",
    services: [
      { name: "Face D-Tan", price: 350, durationMinutes: 30 },
      { name: "Full Back D-Tan", price: 450, durationMinutes: 45 },
      { name: "Half Back D-Tan", price: 250, durationMinutes: 30 },
    ],
  },
  {
    category: "Normal Waxing",
    services: [
      { name: "Full Hand Waxing", price: 200, durationMinutes: 25 },
      { name: "Half Leg Waxing", price: 200, durationMinutes: 25 },
      { name: "Underarms", price: 90, durationMinutes: 15 },
      { name: "Full Leg Waxing", price: 450, durationMinutes: 40 },
      { name: "Bikini", price: 800, durationMinutes: 45 },
      { name: "Full Face Wax", price: 250, durationMinutes: 25 },
    ],
  },
  {
    category: "Rica Waxing",
    services: [
      { name: "Full Hand Waxing", price: 400, durationMinutes: 30 },
      { name: "Half Leg Waxing", price: 400, durationMinutes: 30 },
      { name: "Underarms (Peel Wax)", price: 200, durationMinutes: 20 },
      { name: "Full Leg", price: 750, durationMinutes: 50 },
      { name: "Bikini (Peel Off Wax)", price: 1500, durationMinutes: 55 },
      { name: "Full Face (Peel Wax)", price: 550, durationMinutes: 35 },
      { name: "Nose Waxing", price: 50, durationMinutes: 10 },
    ],
  },
  {
    category: "Bleach",
    services: [
      { name: "Full Body Bleach", price: 2000, durationMinutes: 90 },
      { name: "Hand Bleach", price: 300, durationMinutes: 25 },
      { name: "Half Leg Bleach", price: 300, durationMinutes: 25 },
      { name: "Full Leg Bleach", price: 600, durationMinutes: 40 },
      { name: "Half Back Bleach", price: 300, durationMinutes: 30 },
      { name: "Half Back Oxylife", price: 350, durationMinutes: 30 },
      { name: "Full Back Bleach", price: 500, durationMinutes: 40 },
      { name: "Full Back Oxylife", price: 550, durationMinutes: 40 },
      { name: "Face Bleach", price: 350, durationMinutes: 25 },
    ],
  },
  {
    category: "Threading",
    services: [
      { name: "Eyebrow", price: 50, durationMinutes: 10 },
      { name: "Upper Lips", price: 30, durationMinutes: 10 },
      { name: "Forehead", price: 30, durationMinutes: 10 },
      { name: "Chin", price: 30, durationMinutes: 10 },
      { name: "Side Lock", price: 50, durationMinutes: 15 },
      { name: "Full Face", price: 120, durationMinutes: 25 },
    ],
  },
  {
    category: "Head Massage",
    services: [
      { name: "Coconut Oil", price: 350, durationMinutes: 30 },
      { name: "Almond Oil", price: 400, durationMinutes: 30 },
      { name: "Olive Oil", price: 450, durationMinutes: 35 },
      { name: "Mix Oil", price: 500, durationMinutes: 35 },
    ],
  },
  {
    category: "Polishing",
    services: [
      { name: "Full Body Polishing", price: 3000, durationMinutes: 120 },
      { name: "Full Fruit Body Polishing", price: 3500, durationMinutes: 120 },
      { name: "Hand Polishing", price: 350, durationMinutes: 30 },
      { name: "Half Leg Polishing", price: 350, durationMinutes: 30 },
      { name: "Full Leg Polishing", price: 600, durationMinutes: 45 },
      { name: "Half Back Polishing", price: 500, durationMinutes: 40 },
      { name: "Full Back Polishing", price: 700, durationMinutes: 50 },
      { name: "Front Polishing", price: 650, durationMinutes: 45 },
      { name: "Stomach Polishing", price: 200, durationMinutes: 20 },
    ],
  },
];

export function buildSeedServices() {
  let sortOrder = 0;

  return RATE_CARD.flatMap(({ category, services }) =>
    services.map((service) => {
      sortOrder += 1;
      return {
        name: service.name,
        description: null,
        durationMinutes: service.durationMinutes,
        price: service.price.toFixed(2),
        category,
        sortOrder,
        isActive: true,
      };
    })
  );
}
