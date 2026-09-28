"use client";

import { useState } from "react";
import Image from "next/image";

const MENU = [
  { id: 1, name: "Miso Soup", price: 3.8, image: "/images/miso.jpg", desc: "Light, savory, made fresh to order." },
  { id: 2, name: "Corn Rice", price: 2.8, image: "/images/corn-rice.jpg", desc: "Slow-cooked rice with sweet corn." },
  { id: 3, name: "Egg Fried Rice", price: 9.8, image: "/images/egg-fried-rice.jpg", desc: "Classic wok-fried rice, savory and fragrant." },
  {
    id: 4,
    name: "Coca-Cola Braised Wings",
    price: 26.8,
    image: "/images/wings.jpg",
    desc: "A beloved home-style dish across mainland China. Wings slow-simmered in Coke with ginger and scallion.",
  },
  {
    id: 5,
    name: "Braised Pork Belly",
    price: 26.8,
    image: "/images/pork-belly.jpg",
    desc: "Slow-braised low and slow for maximum depth of flavor.",
    nutrition: { calories: 520, protein: "28g", fat: "38g", carbs: "12g" },
    allergens: "Soy",
  },
  { id: 6, name: "NY Strip Steak", price: 26.8, image: "/images/steak.jpg", desc: "Pan-seared to order, simple and clean." },
  { id: 7, name: "House Sour Plum Drink", price: 5.8, image: "/images/drink.jpg", desc: "Traditional homemade suanmeitang, cools the palate." },
  { id: 8, name: "Secret Ingredient Salmon", price: 26.8, image: "/images/salmon.jpg", desc: "Pan-seared salmon with a marinade I am not giving up easily. You will have to guess." },
];

export default function Home() {
  const [cart, setCart] = useState({});
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(null);

  function updateQty(id, qty) {
    setCart((prev) => ({ ...prev, [id]: Math.max(0, qty) }));
  }

  const total = MENU.reduce((sum, item) => sum + (cart[item.id] || 0) * item.price, 0);
  const hasItems = total > 0;

  async function handleCheckout() {
    setLoading(true);
    const items = MENU
      .filter((item) => (cart[item.id] || 0) > 0)
      .map((item) => ({ name: item.name, price: item.price, quantity: cart[item.id] }));

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
    const data = await res.json();
    window.location.href = data.url;
  }

  return (
    <div className="min-h-screen bg-[#fdf6ec]">
      {/* Hero */}
      <div className="bg-[#c8102e] text-white py-16 px-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-3">LaoWu Takeout</h1>
        <p className="text-red-50 text-lg max-w-xl mx-auto">
          The Chinese food Chinese people actually eat at home, not the Americanized menu you are used to.
        </p>
      </div>

      {/* Menu grid */}
      <div className="max-w-5xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {MENU.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative w-full h-48 bg-zinc-200">
              <Image src={item.image} alt={item.name} fill className="object-cover" />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <span className="font-semibold text-zinc-900">${item.price.toFixed(2)}</span>
              </div>
              <p className="text-sm text-zinc-500 mb-3">{item.desc}</p>

              {item.nutrition && (
                <div className="mb-3">
                  <button
                    onClick={() => setExpanded(expanded === item.id ? null : item.id)}
                    className="text-xs text-[#c8102e] underline"
                  >
                    {expanded === item.id ? "Hide nutrition" : "Nutrition info"}
                  </button>
                  {expanded === item.id && (
                    <div className="mt-2 text-xs text-zinc-500 bg-zinc-50 rounded-lg p-3 space-y-1">
                      <p className="italic">Estimated, not lab-tested</p>
                      <p>
                        {item.nutrition.calories} cal · {item.nutrition.protein} protein · {item.nutrition.fat} fat · {item.nutrition.carbs} carbs
                      </p>
                      {item.allergens && <p>Contains: {item.allergens}</p>}
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between">
                <label className="text-sm text-zinc-500">Qty</label>
                <input
                  type="number"
                  min="0"
                  value={cart[item.id] || ""}
                  placeholder="0"
                  onChange={(e) => updateQty(item.id, parseInt(e.target.value) || 0)}
                  className="w-16 border rounded-lg px-2 py-1 text-center"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* About Me */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex flex-col sm:flex-row items-center gap-8">
          <div className="relative w-full sm:w-72 h-72 flex-shrink-0 rounded-2xl overflow-hidden bg-zinc-200">
            <Image src="/images/about-me.jpg" alt="Cooking in the kitchen" fill className="object-cover" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">Why I am Doing This</h2>
            <p className="text-zinc-600 leading-relaxed">
              I have worked both sides of the restaurant industry, fast food and higher-end kitchens, and I have
              seen how it really works behind the scenes. I still remember watching a manager upcharge customers
              $1.99 for a tiny tray of sauce that cost pennies, and thinking: this is what people are paying for?
              <br />
              <br />
              I wanted to do the opposite. Every dish here is made the way I would cook for my own family: slow,
              honest, no shortcuts, no hidden upcharges. Traditional recipes, cooked fresh for your order, not
              sitting around waiting for one.
            </p>
          </div>
        </div>
      </div>

      {/* Signature Dishes */}
      <div className="max-w-4xl mx-auto px-4 pb-24">
        <h2 className="text-2xl font-bold text-center mb-8">Signature Dishes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div>
            <div className="relative w-full h-56 rounded-2xl overflow-hidden bg-zinc-200 mb-3">
              <Image src="/images/pork-belly.jpg" alt="Braised Pork Belly" fill className="object-cover" />
            </div>
            <h3 className="font-semibold text-lg mb-1">Braised Pork Belly</h3>
            <p className="text-sm text-zinc-600 leading-relaxed">
              A family recipe, simmered low and slow for nearly two hours until the fat turns silky and the sauce
              runs deep and glossy. No shortcuts. This is the dish that takes the longest, and it is worth every
              minute.
            </p>
          </div>
          <div>
            <div className="relative w-full h-56 rounded-2xl overflow-hidden bg-zinc-200 mb-3">
              <Image src="/images/wings.jpg" alt="Coca-Cola Braised Wings" fill className="object-cover" />
            </div>
            <h3 className="font-semibold text-lg mb-1">Coca-Cola Braised Wings</h3>
            <p className="text-sm text-zinc-600 leading-relaxed">
              A beloved home-style dish across mainland China. Wings slow-simmered in Coke with ginger and scallion
              until the sugars caramelize into a rich, savory glaze. You will not find it at most Chinese
              restaurants here, because they are not cooking the food people actually eat at home in China. This is.
            </p>
          </div>
        </div>
      </div>

      {/* Sticky checkout bar */}
      <div className="sticky bottom-0 bg-white border-t shadow-lg px-4 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="text-lg font-semibold">Total: ${total.toFixed(2)}</span>
          <button
            onClick={handleCheckout}
            disabled={!hasItems || loading}
            className="bg-[#c8102e] text-white px-8 py-3 rounded-full font-medium disabled:bg-zinc-300 disabled:cursor-not-allowed"
          >
            {loading ? "Simmering your order..." : "Checkout"}
          </button>
        </div>
      </div>

      {/* Lucky cat */}
      <div className="fixed bottom-24 right-4 w-20 h-20 cursor-pointer select-none z-50" title="Good luck!">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <ellipse cx="50" cy="72" rx="26" ry="20" fill="white" stroke="#c8102e" strokeWidth="2" />
          <circle cx="50" cy="42" r="20" fill="white" stroke="#c8102e" strokeWidth="2" />
          <path d="M32 30 L38 12 L46 28 Z" fill="white" stroke="#c8102e" strokeWidth="2" />
          <path d="M68 30 L62 12 L54 28 Z" fill="white" stroke="#c8102e" strokeWidth="2" />
          <circle cx="42" cy="40" r="2.5" fill="#222" />
          <circle cx="58" cy="40" r="2.5" fill="#222" />
          <path d="M47 46 Q50 49 53 46" stroke="#222" strokeWidth="1.5" fill="none" />
          <line x1="30" y1="45" x2="15" y2="43" stroke="#222" strokeWidth="1" />
          <line x1="30" y1="49" x2="15" y2="50" stroke="#222" strokeWidth="1" />
          <line x1="70" y1="45" x2="85" y2="43" stroke="#222" strokeWidth="1" />
          <line x1="70" y1="49" x2="85" y2="50" stroke="#222" strokeWidth="1" />
          <ellipse cx="50" cy="58" rx="10" ry="4" fill="#c8102e" />
          <circle cx="50" cy="58" r="3" fill="gold" />
          <g style={{ transformOrigin: "72px 62px", animation: "wave 1s ease-in-out infinite" }}>
            <ellipse cx="72" cy="62" rx="6" ry="14" fill="white" stroke="#c8102e" strokeWidth="2" />
          </g>
        </svg>
      </div>
    </div>
  );
}