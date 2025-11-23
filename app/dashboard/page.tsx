"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Dashboard() {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState("mie");
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [checkedLogin, setCheckedLogin] = useState(false);

  // ✅ Cek login
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      router.replace("/login"); // redirect ke login
    } else {
      setCheckedLogin(true); // login valid → tampilkan dashboard
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    router.replace("/login");
  };
  const toggleDarkMode = () => setDarkMode(!darkMode);

  const menus: Record<string, { name: string; price: number; img: string }[]> = {
    mie: [
      { name: "Mie Gacoan Lv 1", price: 10000, img: "mie1.jpg" },
      { name: "Mie Gacoan Lv 2", price: 11000, img: "mie2.jpg" },
      { name: "Mie Gacoan Lv 3", price: 12000, img: "mie3.jpg" },
      { name: "Mie Gacoan Lv 4", price: 13000, img: "mie4.jpg" },
      { name: "Mie Gacoan Lv 5", price: 14000, img: "mie5.jpg" },
      { name: "Mie Gacoan Lv 6", price: 15000, img: "mie6.jpg" },
      { name: "Mie Gacoan Lv 7", price: 16000, img: "mie7.jpg" },
      { name: "Mie Gacoan Lv 8", price: 17000, img: "mie8.jpg" },
    ],
    hompimpa: [
      { name: "Mie Hompimpa Lv 1", price: 10000, img: "hompimpa1.jpg" },
      { name: "Mie Hompimpa Lv 2", price: 11000, img: "hompimpa2.jpg" },
      { name: "Mie Hompimpa Lv 3", price: 12000, img: "hompimpa3.jpg" },
      { name: "Mie Hompimpa Lv 4", price: 13000, img: "hompimpa4.jpg" },
      { name: "Mie Hompimpa Lv 5", price: 14000, img: "hompimpa5.jpg" },
      { name: "Mie Hompimpa Lv 6", price: 15000, img: "hompimpa6.jpg" },
      { name: "Mie Hompimpa Lv 7", price: 16000, img: "hompimpa7.jpg" },
      { name: "Mie Hompimpa Lv 8", price: 17000, img: "hompimpa8.jpg" },
    ],
    dimsum: [
      { name: "Udang Keju", price: 15000, img: "udang-keju.jpg" },
      { name: "Udang Rambutan", price: 15000, img: "udang-rambutan.jpg" },
      { name: "Dimsum Ayam", price: 12000, img: "dimsum-ayam.jpg" },
      { name: "Pangsit Goreng", price: 12000, img: "pangsit-goreng.jpg" },
      { name: "Bakpao", price: 12000, img: "aneka-bakpao.jpg" },
    ],
    minuman: [
      { name: "Es Teh", price: 5000, img: "es-teh.jpg" },
      { name: "Es Gobak Sodor", price: 8000, img: "es-cendol.jpg" },
      { name: "Es Petak Umpet", price: 10000, img: "es-buah.jpg" },
      { name: "Es Teklek", price: 12000, img: "es-teklek.jpg" },
      { name: "Es Sluku Batok", price: 12000, img: "es-slukubatok.jpg" },
    ],
    eskrim: [
      { name: "Es Krim Varian Cone", price: 12000, img: "semua-variant.jpg" },
      { name: "Es Krim Coklat", price: 12000, img: "eskrim-coklat.jpg" },
      { name: "Es Krim Pilih Varian", price: 12000, img: "semua-varian.jpg" },
    ],
    paket: [
      { name: "Paket 1: Lv1 + Udang Keju + Es Teh", price: 25000, img: "menupaket.jpg" },
      { name: "Paket 2: Lv4 + Pangsit + Es Krim", price: 30000, img: "menu-paket.jpg" },
      { name: "Paket 3: Lv8 + Udang Rambutan + Es Sluku Batok", price: 35000, img: "menu-paket1.jpg" },
    ],
  };

  const addToCart = (name: string) =>
    setCart((prev) => ({ ...prev, [name]: (prev[name] || 0) + 1 }));

  const removeFromCart = (name: string) =>
    setCart((prev) => ({ ...prev, [name]: Math.max((prev[name] || 0) - 1, 0) }));

  const filteredMenus = menus[activeMenu].filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const total = Object.entries(cart).reduce((sum, [name, qty]) => {
    const item = Object.values(menus).flat().find((m) => m.name === name);
    return sum + (item ? item.price * qty : 0);
  }, 0);

  // ✅ Loading sampai cek login selesai
  if (!checkedLogin) {
    return (
      <div className="flex justify-center items-center min-h-screen text-xl font-semibold text-gray-700 dark:text-gray-200">
        Memeriksa login...
      </div>
    );
  }

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 dark:from-gray-700 dark:via-gray-800 dark:to-gray-900">
        {/* SIDEBAR */}
        <div
          className={`${
            sidebarOpen ? "w-72" : "w-20"
          } bg-blue-200 dark:bg-gray-800 text-gray-800 dark:text-gray-100 transition-all duration-300 shadow-lg flex flex-col`}
        >
          <div className="flex items-center justify-between p-5 border-b border-blue-300 dark:border-gray-700">
            {sidebarOpen && (
              <Image
                src="/logo2/gacoan.jpg"
                alt="Logo"
                width={60}
                height={60}
                className="rounded-xl shadow-sm"
              />
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-700 dark:text-gray-100 text-2xl"
            >
              {sidebarOpen ? "⬅️" : "➡️"}
            </button>
          </div>

          <div className="flex-1 pt-5 space-y-3 overflow-y-auto">
            {[
              ["mie", "🍜 Mie Gacoan"],
              ["hompimpa", "🍜 Mie Hompimpa"],
              ["dimsum", "🥟 Dimsum"],
              ["minuman", "🥤 Minuman"],
              ["eskrim", "🍦 Es Krim"],
              ["paket", "🍱 Paket"],
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveMenu(key)}
                className={`w-full px-5 py-4 rounded-r-full text-lg transition-all ${
                  activeMenu === key
                    ? "bg-blue-300 dark:bg-gray-600 font-bold shadow-md"
                    : "hover:bg-blue-100 dark:hover:bg-gray-700"
                }`}
              >
                {sidebarOpen ? label : label[0]}
              </button>
            ))}
          </div>

          <div className="p-5 mt-auto border-t border-blue-300 dark:border-gray-700 space-y-3">
            <button
              onClick={handleLogout}
              className="w-full py-3 bg-red-300 hover:bg-red-400 rounded-lg font-bold shadow-sm text-lg"
            >
              Logout 🚪
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-full py-3 bg-gray-300 hover:bg-gray-400 rounded-lg font-bold shadow-sm text-lg"
            >
              {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
            </button>
          </div>
        </div>

        {/* MAIN */}
        <div className="flex-1 flex flex-col">
          {/* HEADER */}
          <div className="p-5 bg-white/70 dark:bg-gray-900/60 backdrop-blur-md shadow-sm flex justify-between items-center border-b border-blue-200 dark:border-gray-700">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 drop-shadow">
              🍽️ Menu Gacoan
            </h1>
            <input
              type="text"
              placeholder="🔍 Cari menu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-5 py-3 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-300 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 text-lg"
            />
          </div>

          {/* GRID MENU */}
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredMenus.map((item) => (
              <div
                key={item.name}
                className="bg-white/90 dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.04]"
              >
                <Image
                  src={`/menu/${item.img}`}
                  alt={item.name}
                  width={350}
                  height={220}
                  className="rounded-t-2xl h-48 w-full object-cover"
                />
                <div className="p-5 text-center">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-lg">{item.name}</h3>
                  <p className="text-blue-700 dark:text-green-300 font-semibold mt-2">
                    Rp {item.price.toLocaleString()}
                  </p>
                  <div className="flex justify-center items-center gap-4 mt-4">
                    <Button
                      onClick={() => removeFromCart(item.name)}
                      className="bg-red-300 hover:bg-red-400 text-lg"
                    >
                      ➖
                    </Button>
                    <span className="font-semibold w-8 text-center dark:text-gray-100 text-lg">
                      {cart[item.name] || 0}
                    </span>
                    <Button
                      onClick={() => addToCart(item.name)}
                      className="bg-blue-300 hover:bg-blue-400 text-lg"
                    >
                      ➕
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* FOOTER */}
          <div className="p-6 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md shadow-inner border-t border-blue-200 dark:border-gray-700 flex justify-between">
            <p className="text-xl font-bold text-gray-800 dark:text-gray-100">
              Total: Rp {total.toLocaleString()}
            </p>
            <Button
              onClick={() => router.push("/bayar")}
              className="bg-green-300 hover:bg-green-400 shadow text-gray-800 dark:text-gray-100 font-bold px-8 py-3 text-lg"
            >
              Bayar Sekarang 💳
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
