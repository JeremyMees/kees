import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import PageTitle from '@/components/PageTitle'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`
          ${geistSans.variable} ${geistMono.variable} antialiased
          flex flex-col min-h-dvh max-h-dvh justify-between
        `}
      >
        <main className="flex-1 flex flex-col overflow-hidden">
          <PageTitle />
          {children}
        </main>
        <Navigation />
      </body>
    </html>
  )
}
