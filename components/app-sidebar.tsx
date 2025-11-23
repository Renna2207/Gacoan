"use client"

import { FC } from "react"
import Image from "next/image"

interface SidebarProps {
  activeMenu: string
  setActiveMenu: (menu: string) => void
}

export const Sidebar: FC<SidebarProps> = ({ activeMenu, setActiveMenu }) => {
  const menus = [
    { key: "mie", label: "Mie Gacoan" },
    { key: "hompimpa", label: "Hompimpa" },
    { key: "dimsum", label: "Dimsum" },
    { key: "minuman", label: "Minuman" },
    { key: "eskrim", label: "Es Krim" },
    { key: "paket", label: "Paket" },
  ]

  return (
    <div className="w-64 h-screen bg-blue-700 text-white flex flex-col shadow-lg">
      {/* Logo */}
      <div className="flex flex-col items-center p-4 border-b border-blue-600">
        <Image
          src="/logo2/gacoan.jpg"  
          alt="Logo Gacoan"
          width={96}
          height={96}
          className="mb-2 rounded-md shadow-md object-cover"
        />
        <p className="text-yellow-300 font-semibold text-lg">GACOAN</p>
      </div>

      {/* Menu */}
      <div className="flex-1 flex flex-col justify-between overflow-y-auto mt-2">
        <div className="space-y-1">
          {menus.map((menu) => (
            <button
              key={menu.key}
              onClick={() => setActiveMenu(menu.key)}
              className={`w-full text-left px-4 py-3 border-l-4 transition-all duration-200 text-base font-medium rounded-r-md ${
                activeMenu === menu.key
                  ? "border-yellow-300 bg-blue-500 font-bold"
                  : "border-transparent hover:bg-blue-600"
              }`}
            >
              {menu.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
