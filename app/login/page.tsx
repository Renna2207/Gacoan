"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import Image from "next/image"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    if (isLoggedIn) router.replace("/dashboard")
    else setLoading(false)
  }, [router])

  if (loading) return <div className="flex justify-center items-center min-h-screen text-gray-500">Loading...</div>

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (username && password) {
      localStorage.setItem("isLoggedIn", "true")
      router.replace("/dashboard")
    } else {
      alert("Isi username & password dulu ya")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-50 via-yellow-50 to-pink-100">
      <div className="bg-white shadow-2xl rounded-3xl p-10 w-[360px] text-center border border-gray-200">
        <div className="flex justify-center mb-6">
          <Image
            src="/logo/logo-gacoan.jpg"
            alt="Logo Gacoan"
            width={100}
            height={100}
            className="rounded-full object-contain drop-shadow-lg"
            priority
          />
        </div>

        <h1 className="text-2xl font-extrabold text-pink-600 mb-2">Selamat Datang di Gacoan</h1>
        <p className="text-gray-500 mb-6">Masuk untuk pemesanan online</p>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-pink-300 outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-pink-300 outline-none"
          />
          <button
            type="submit"
            className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-xl transition-all shadow-md"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}
