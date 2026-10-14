import { request } from "./apiClient.js";
import { ENDPOINTS } from "./endpoints.js";
import { SAMPLE_BEST_SELLERS, SAMPLE_PIZZA, SAMPLE_POPULAR } from "../data/sampleMenu.js";

const CITY_ID = import.meta.env.VITE_CITY_ID || "118";

function normalise(record, index) {
  const image =
    record?.images?.[0]?.url || record?.images?.[0] || record?.image || record?.logo || null;
  return {
    id: String(record?.restaurant_id ?? record?.id ?? `r${index}`),
    name: record?.restaurant_name ?? record?.name ?? "Restaurant",
    price: Number(record?.avg_cost_for_two ?? record?.price ?? 0),
    date: record?.city_name ?? record?.location ?? "",
    items: Number(record?.items_count ?? 1),
    image,
    emoji: "🍽️",
  };
}

export async function getHomeData() {
  try {
    const data = await request({ ...ENDPOINTS.restaurants, query: { city_id: CITY_ID }, auth: true });
    const list = Array.isArray(data) ? data : data?.data ?? data?.results ?? [];
    if (Array.isArray(list) && list.length >= 2) {
      const cards = list.map(normalise);
      return {
        bestSellers: cards.slice(0, 4),
        popular: cards.slice(4, 10).length ? cards.slice(4, 10) : cards.slice(0, 4),
        source: "api",
      };
    }
  } catch (err) {
    if (err.status === 401) throw err;
    console.warn("[restaurantService] API unavailable, using local sample data:", err.message);
  }
  return { bestSellers: SAMPLE_BEST_SELLERS, popular: SAMPLE_POPULAR, source: "sample" };
}

// Complete list mapping all items with their specific details and portions
const ALL_ITEMS = [
  {
    id: "s1",
    name: "Salmon Sushi",
    price: 103.0,
    image: "/images/sushi.jpg.png",
    emoji: "🍣",
    description: "Fresh premium salmon sushi rolls served with wasabi and soy sauce.",
    portions: [
      { id: "personal", label: "Personal (4 Pieces)", price: 0 },
      { id: "medium", label: "Medium (8 Pieces)", price: 5 },
      { id: "familiar", label: "Familiar (12 Pieces)", price: 10 },
      { id: "jumbo", label: "Jumbo (16 Pieces)", price: 15 },
    ],
  },
  {
    id: "s2",
    name: "Indian Thali",
    price: 50.0,
    image: "/images/curry.jpg.png",
    emoji: "🍛",
    description: "Traditional rich Indian curry served with steaming hot basmati rice.",
    portions: [
      { id: "personal", label: "Regular Bowl", price: 0 },
      { id: "medium", label: "Medium Combo", price: 3 },
      { id: "familiar", label: "Family Pack", price: 7 },
      { id: "jumbo", label: "Jumbo Feast", price: 12 },
    ],
  },
  {
    id: "s3",
    name: "Veg Lasagna",
    price: 12.99,
    image: "/images/lasagna.jpg.png",
    emoji: "🍝",
    description: "Layers of pasta with rich tomato sauce, vegetables, and melted cheese.",
    portions: [
      { id: "personal", label: "Single Slice", price: 0 },
      { id: "medium", label: "Medium Tray", price: 4 },
      { id: "familiar", label: "Family Tray", price: 8 },
      { id: "jumbo", label: "Party Tray", price: 14 },
    ],
  },
  {
    id: "s4",
    name: "Berry Cupcake",
    price: 8.2,
    image: "/images/cupcake.jpg.png",
    emoji: "🧁",
    description: "Soft vanilla cupcake topped with sweet cream and fresh mixed berries.",
    portions: [
      { id: "personal", label: "1 Piece", price: 0 },
      { id: "medium", label: "Box of 4", price: 5 },
      { id: "familiar", label: "Box of 6", price: 9 },
      { id: "jumbo", label: "Box of 12", price: 18 },
    ],
  },
  {
    id: "p1",
    name: "Strawberry Shake",
    price: 20.0,
    image: "/images/shake.jpg.png",
    emoji: "🥤",
    description: "Creamy strawberry milkshake topped with whipped cream and fresh strawberries.",
    portions: [
      { id: "personal", label: "Regular (300ml)", price: 0 },
      { id: "medium", label: "Large (500ml)", price: 3 },
      { id: "familiar", label: "Family Size (1L)", price: 6 },
      { id: "jumbo", label: "Party Pitcher (1.5L)", price: 10 },
    ],
  },
  {
    id: "p2",
    name: "Chicken Burger",
    price: 20.0,
    image: "/images/burger.jpg.png",
    emoji: "🍔",
    description: "Juicy grilled chicken patty with fresh lettuce, tomatoes, and special sauce.",
    portions: [
      { id: "personal", label: "Single Patty", price: 0 },
      { id: "medium", label: "Double Patty", price: 4 },
      { id: "familiar", label: "Triple Stack", price: 8 },
      { id: "jumbo", label: "Mega Burger", price: 12 },
    ],
  },
  {
    id: "pizza",
    name: "Pepperoni Pizza",
    price: 14.0,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591",
    emoji: "🍕",
    description: "Experience our delicious new dish with extra cheese and pepperoni slices.",
    portions: [
      { id: "personal", label: "Personal (4 Slides)", price: 0 },
      { id: "medium", label: "Medium (8 Slides)", price: 3 },
      { id: "familiar", label: "Familiar (10 Slides)", price: 6 },
      { id: "jumbo", label: "Jumbo (12 Slides)", price: 10 },
    ],
  },
];

export async function getItem(id) {
  const found = ALL_ITEMS.find((i) => String(i.id) === String(id));
  return found ? { ...found, requestedId: id } : { ...SAMPLE_PIZZA, requestedId: id };
}