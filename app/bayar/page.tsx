"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

// Helper format
const formatRp = (n: number) => "Rp " + n.toLocaleString("id-ID");

// Generate decorative barcode
function generateBarcodeDataUrl(seed: string) {
  const codes = Array.from(seed).map(c => c.charCodeAt(0));
  const bars: number[] = [];
  for (let i = 0; i < 60; i++) {
    bars.push((codes[i % codes.length] + i * 37) % 8);
  }

  const width = 300;
  const height = 80;
  const barWidth = Math.floor(width / bars.length);
  let rects = "";
  bars.forEach((b, i) => {
    const h = 10 + b * 8;
    const y = (height - h) / 2;
    const x = i * barWidth;
    rects += `<rect x="${x}" y="${y}" width="${barWidth - 1}" height="${h}" fill="#111"/>`;
  });

  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}' viewBox='0 0 ${width} ${height}'>
    <rect width='100%' height='100%' fill='white'/>
    ${rects}
    <text x='50%' y='95%' font-size='10' text-anchor='middle' fill='#333'>${seed}</text>
  </svg>`;
  if (typeof window !== "undefined" && window.btoa) return `data:image/svg+xml;base64,${window.btoa(svg)}`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

export default function BayarPage() {
  const router = useRouter();
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [menus, setMenus] = useState<Record<string, { name: string; price: number; img: string }[]>>({});
  const [customerName, setCustomerName] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [loading, setLoading] = useState(true);

  const TAX = 10000;
  const DISCOUNT_THRESHOLD = 100000;
  const DISCOUNT_RATE = 0.1;

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    const savedMenus = localStorage.getItem("menus");
    const savedName = localStorage.getItem("customerName");
    const savedTable = localStorage.getItem("tableNumber");

    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedMenus) setMenus(JSON.parse(savedMenus));
    if (savedName) setCustomerName(savedName);
    if (savedTable) setTableNumber(savedTable);

    setCurrentDate(new Date().toLocaleString());
    setLoading(false);
  }, []);

  const subtotal = useMemo(() => {
    return Object.entries(cart).reduce((sum, [name, qty]) => {
      const item = Object.values(menus).flat().find(m => m.name === name);
      return sum + (item ? item.price * qty : 0);
    }, 0);
  }, [cart, menus]);

  const discount = subtotal >= DISCOUNT_THRESHOLD ? Math.round(subtotal * DISCOUNT_RATE) : 0;
  const tax = subtotal > 0 ? TAX : 0;
  const totalToPay = Math.max(subtotal - discount + tax, 0);
  const neededForDiscount = subtotal >= DISCOUNT_THRESHOLD ? 0 : DISCOUNT_THRESHOLD - subtotal;

  const barcodeSeed = useMemo(() => {
    const namePart = customerName ? customerName.replace(/\s+/g, "_").slice(0, 12) : "GUEST";
    const tablePart = tableNumber ? `T${tableNumber}` : "T-";
    return `GCOAN|${namePart}|${tablePart}|${totalToPay}`;
  }, [customerName, tableNumber, totalToPay]);

  const barcodeDataUrl = useMemo(() => generateBarcodeDataUrl(barcodeSeed), [barcodeSeed]);

  const handleKembali = () => {
    localStorage.setItem("cart", JSON.stringify(cart));
    router.push("/");
  };

  const handleBayarSekarang = () => {
    if (!customerName.trim()) {
      alert("Tolong isi nama terlebih dahulu sebelum membayar.");
      return;
    }
    alert("🎉 Pembayaran berhasil! Terima kasih 😋");
    localStorage.removeItem("cart");
    router.push("/");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-xl font-bold text-gray-600">
        Memuat data...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-blue-100 to-blue-200 flex justify-center py-6 px-4">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4 text-blue-600 text-center">🥳 Checkout Gacoan Fun 🥳</h1>

        <div className="bg-white rounded-3xl p-5 shadow-xl flex flex-col gap-5">
          {/* Customer Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="text-sm text-gray-600">Atas Nama</label>
              <input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Nama pembeli"
                className="w-full mt-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Nomor Meja</label>
              <input
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                placeholder="No. meja (opsional)"
                className="w-full mt-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </div>

          {/* Top row */}
          <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4">
            <div>
              <div className="text-sm text-gray-500">Tanggal</div>
              <div className="font-semibold text-gray-800">{currentDate}</div>
              {customerName && <div className="text-sm text-gray-600 mt-1">Nama: <span className="font-medium">{customerName}</span></div>}
              {tableNumber && <div className="text-sm text-gray-600">Meja: <span className="font-medium">{tableNumber}</span></div>}
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="bg-white p-2 rounded-md shadow-sm flex flex-col items-center">
                <img src={barcodeDataUrl} alt="barcode" className="w-full max-w-[260px] h-[70px] object-contain" />
                <div className="text-xs text-gray-500 mt-1">Tunjukkan kode ini ke kasir</div>
              </div>

              <div className="text-right">
                <div className="text-xs text-gray-500">Payment ID</div>
                <div className="font-mono font-semibold text-sm text-gray-700 break-words">{barcodeSeed}</div>
              </div>
            </div>
          </div>

          {/* Cart items */}
          <div className="flex flex-col gap-3">
            {Object.entries(cart).map(([name, qty]) => {
              if (qty === 0) return null;
              const item = Object.values(menus).flat().find(m => m.name === name);
              if (!item) return null;
              return (
                <div key={name} className="flex flex-col md:flex-row justify-between items-center bg-blue-50 rounded-2xl p-3 shadow-sm">
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <img src={item.img} alt={name} className="w-16 h-16 rounded-lg object-cover shadow" />
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-800">{name}</span>
                      <span className="text-sm text-gray-500">Harga: {formatRp(item.price)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-3 md:mt-0">
                    <div className="text-right mr-2">
                      <div className="font-semibold text-gray-800">{formatRp(item.price * qty)}</div>
                      <div className="text-xs text-gray-500">{qty} x {formatRp(item.price)}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => setCart(prev => ({ ...prev, [name]: Math.max(prev[name] - 1, 0) }))} className="border-red-500 text-red-500 hover:bg-red-100 rounded-full">➖</Button>
                      <div className="w-8 text-center font-medium">{qty}</div>
                      <Button size="sm" variant="outline" onClick={() => setCart(prev => ({ ...prev, [name]: prev[name] + 1 }))} className="border-blue-500 text-blue-500 hover:bg-blue-100 rounded-full">➕</Button>
                    </div>
                  </div>
                </div>
              )
            })}
            {Object.values(cart).every(v => v === 0) && (
              <div className="text-center py-8 text-gray-500">Keranjang kosong — tambahkan menu dulu ya 🍜</div>
            )}
          </div>

          {/* Pricing */}
          <div className="bg-gray-50 rounded-xl p-4 shadow-inner">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold text-gray-800">{formatRp(subtotal)}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Diskon {subtotal >= DISCOUNT_THRESHOLD ? `( ${Math.round(DISCOUNT_RATE * 100)}% )` : ""}</span>
              <span className={`font-semibold ${discount > 0 ? "text-green-600" : "text-gray-500"}`}>{discount > 0 ? `- ${formatRp(discount)}` : "-"}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Pajak (flat)</span>
              <span className="font-semibold text-gray-800">{tax > 0 ? formatRp(tax) : "-"}</span>
            </div>
            <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between items-center">
              <span className="text-lg font-bold text-gray-800">Total Bayar</span>
              <span className="text-xl font-extrabold text-blue-600">{formatRp(totalToPay)}</span>
            </div>

            {subtotal > 0 && neededForDiscount > 0 && (
              <div className="mt-3 text-sm text-yellow-800">
                Tambah <strong>{formatRp(neededForDiscount)}</strong> lagi untuk dapatkan diskon {Math.round(DISCOUNT_RATE * 100)}% 🎉
              </div>
            )}
            {subtotal >= DISCOUNT_THRESHOLD && (
              <div className="mt-3 text-sm text-green-700">
                Yeay! Kamu mendapat diskon {Math.round(DISCOUNT_RATE * 100)}% 🎊
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col md:flex-row gap-3">
            <Button className="flex-1 bg-blue-400 hover:bg-blue-300 text-white font-bold rounded-2xl py-3" onClick={handleKembali}>⬅️ Kembali</Button>
            <Button className="flex-1 bg-green-500 hover:bg-green-400 text-white font-bold rounded-2xl py-3" onClick={handleBayarSekarang}>💳 Bayar Sekarang</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
