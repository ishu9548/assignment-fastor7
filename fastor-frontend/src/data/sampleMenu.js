// Content shown in the Figma design. Used as a fallback when the API returns no usable data.
export const SAMPLE_BEST_SELLERS = [
  { id: "s1", name: "Salmon Sushi", price: 103.0, image: "/images/sushi.jpg.png", emoji: "🍣" },
  { id: "s2", name: "Indian Thali", price: 50.0, image: "/images/curry.jpg.png", emoji: "🍛" },
  { id: "s3", name: "Veg Lasagna", price: 12.99, image: "/images/lasagna.jpg.png", emoji: "🍝" },
  { id: "s4", name: "Berry Cupcake", price: 8.2, image: "/images/cupcake.jpg.png", emoji: "🧁" },
];

export const SAMPLE_POPULAR = [
  { id: "p1", name: "Strawberry Shake", price: 20.0, date: "29 Nov, 01:20 pm", items: 2, image: "/images/shake.jpg.png", emoji: "🥤" },
  { id: "p2", name: "Chicken Burger", price: 20.0, date: "17 Oct, 01:20 pm", items: 1, image: "/images/burger.jpg.png", emoji: "🍔" },
];

export const SAMPLE_PIZZA = {
  id: "pizza",
  name: "Pepperoni Pizza",
  price: 14.0,
  image: "https://images.unsplash.com/photo-1513104890138-7c749659a591",
  emoji: "🍕",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
  portions: [
    { id: "personal", label: "Personal (4 Slides)", price: 0 },
    { id: "medium", label: "Medium (8 Slides)", price: 3 },
    { id: "familiar", label: "Familiar (10 Slides)", price: 6 },
    { id: "jumbo", label: "Jumbo (12 Slides)", price: 10 },
  ],
};