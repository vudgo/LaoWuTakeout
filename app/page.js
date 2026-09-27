"use client";

import { useState } from "react";
import Image from "next/image";

const MENU = [
  { id: 1, name: "Miso Soup", price: 3.80, image: "/images/miso.jpg", desc: "Light, savory, made fresh to order." },
  { id: 2, name: "Corn Rice", price: 2.80, image: "/images/corn-rice.jpg", desc: "Slow-cooked rice with sweet corn." },
  { id: 3, name: "Egg Fried Rice", price: 10.80, image: "/images/egg-fried-rice.jpg", desc: "Classic wok-fried rice, savory and fragrant." },
  { id: 4, name: "Chicken Wings", price: 21.80, image: "/images/wings.jpg", desc: "Crispy skin, juicy inside, house marinade." },
  { id: 5, name: "Braised Pork Belly", price: 26.80, image: "/images/pork-belly.jpg", desc: "Slow-braised low and slow for maximum depth of flavor." },
  { id: 6, name: "NY Strip Steak", price: 28.80, image: "/images/steak.jpg", desc: "Pan-seared to order, simple and clean." },
  { id: 7, name: "House Sour Plum Drink", price: 5.80, image: "/images/drink.jpg", desc: "Traditional homemade 酸梅汤, cools the palate." },
];

export default function Home() {
  const [cart, setCart] = useState({});
  const [loading, setLoading] = useState(false);

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
    <div className="min-h-screen bg-zinc-50">

      

      {/* Hero */}
      <div className="bg-zinc-900 text-white py-16 px-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-2">LaoWu Takeout</h1>
        <p className="text-zinc-300 text-lg">Homemade. Slow-cooked. Delivered fresh.</p>
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
              <div className="flex items-center justify-between">
                <label className="text-sm text-zinc-500">Qty</label>
                <input
                  type="number"
                  min="0"
                  value={cart[item.id] || 0}
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
            <Image
              src="/images/about-me.jpg"
              alt="Cooking in the kitchen"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">Why I'm Doing This</h2>
            <p className="text-zinc-600 leading-relaxed">
              I've worked both sides of the restaurant industry — fast food and higher-end
              kitchens — and I've seen how the sausage actually gets made. Literally, in some
              cases. I still remember watching a manager upcharge customers $1.99 for a tiny tray
              of sauce that cost pennies, and thinking: this is what people are paying for?
              <br /><br />
              That stuck with me. I wanted to do the opposite — every dish here is made the way
              I'd cook for my own family: slow, honest, no shortcuts, no upcharges hidden in the
              fine print. Traditional recipes, cooked fresh for your order, not sitting around
              waiting for one.
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
            className="bg-black text-white px-8 py-3 rounded-full font-medium disabled:bg-zinc-300 disabled:cursor-not-allowed"
          >
            {loading ? "Loading..." : "Checkout"}
          </button>
        </div>
      </div>
    </div>
  );
}