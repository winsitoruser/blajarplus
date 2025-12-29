import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ChatBoxWrapper } from '@/components/ChatBoxWrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Blajarplus - Platform Pembelajaran Online',
  description: 'Marketplace untuk menghubungkan pelajar dengan pengajar berkualitas di Indonesia',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        {children}
        <ChatBoxWrapper />
      </body>
    </html>
  )
}
