import type { Metadata } from 'next'
import './globals.css'
import Providers from '@/components/Providers'
import Navbar from '@/components/Navbar'

export const metadata: Metadata = {
  title: 'KickZone — Football for Kids',
  description: 'The coolest football site for kids. League tables, player values, interviews and live match discussions!',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-dark-900">
        <Providers>
          <Navbar />
          <main>{children}</main>
          <footer className="border-t border-white/5 py-8 mt-16 text-center text-white/30 text-sm">
            <p>⚽ KickZone — Made for young football fans everywhere 🌍</p>
          </footer>
        </Providers>
      </body>
    </html>
  )
}
