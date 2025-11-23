import { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // Supaya gambar dari /public pasti muncul tanpa optimisasi
  },
}

export default nextConfig
