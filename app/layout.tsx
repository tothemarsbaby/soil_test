import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Soil Test - Generational House',
  description: 'Determine if soil on your land is suitable for concrete lite material based homes',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
