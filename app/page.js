"use client";

import { useState } from "react";

const MENU = [
  { id: 1, name: "Kung Pao Chicken", price: 12.99 },
  { id: 2, name: "Beef Chow Mein", price: 13.99 },
  { id: 3, name: "Vegetable Fried Rice", price: 10.99 },
  { id: 4, name: "Spring Rolls (4pc)", price: 6.99 },
];

export default function Home() {
  const [cart, setCart] = useState({});
  const [loading, setLoading] = useState(false);

  function updateQty(id, qty) {
    setCart((prev) => ({ ...prev, [id]: Math.max(0, qty) }));
  }

  const total = MENU.reduce((sum, item) => {
    return sum + (cart[item.id] || 0) * item.price;
  }, 0);

  const hasItems = total > 0;

  async function handleCheckout() {
    setLoading(true);

    const items = MENU
      .filter((item) => (cart[item.id] || 0) > 0)
      .map((item) => ({
        name: item.name,
        price: item.price,
        quantity: cart[item.id],
      }));

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });

    const data = await res.json();
    window.location.href = data.url;
  }

  return (
    <div className="min-h-screen bg-zinc-50 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold text-center mb-6">LaoWu Takeout</h1>

        <div className="flex flex-col gap-4">
          {MENU.map((item) => (
            <div key={item.id} className="flex items-center justify-between border-b pb-3">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-zinc-500">${item.price.toFixed(2)}</p>
              </div>
              <input
                type="number"
                min="0"
                value={cart[item.id] || 0}
                onChange={(e) => updateQty(item.id, parseInt(e.target.value) || 0)}
                className="w-16 border rounded px-2 py-1 text-center"
              />
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>

        <button
          onClick={handleCheckout}
          disabled={!hasItems || loading}
          className="mt-4 w-full bg-black text-white py-3 rounded-lg font-medium disabled:bg-zinc-300 disabled:cursor-not-allowed"
        >
          {loading ? "Loading..." : "Checkout"}
        </button>
      </div>
    </div>
  );
}