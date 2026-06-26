import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://easycrm.ru'),
  title: {
    default: 'easyCRM — Разработка сайтов на Bitrix и внедрение CRM',
    template: '%s | easyCRM',
  },
  description:
    'Создаём корпоративные сайты и интернет-магазины на Bitrix, внедряем Bitrix24 CRM под ключ. Официальный партнёр 1С-Битрикс. Быстрый запуск, современный дизайн, поддержка.',
  keywords: [
    'разработка сайтов Bitrix',
    'Bitrix24 внедрение',
    'CRM для бизнеса',
    'интернет-магазин Bitrix',
    'корпоративный сайт',
    'easyCRM',
    '1С-Битрикс партнёр',
  ],
  authors: [{ name: 'easyCRM', url: 'https://easycrm.ru' }],
  creator: 'easyCRM',
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: 'https://easycrm.ru',
    title: 'easyCRM — Разработка сайтов на Bitrix и внедрение CRM',
    description: 'Создаём сайты на Bitrix и внедряем CRM для роста бизнеса. Официальный партнёр 1С-Битрикс.',
    siteName: 'easyCRM',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'easyCRM' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'easyCRM — Разработка сайтов на Bitrix',
    description: 'Создаём сайты на Bitrix и внедряем CRM для роста бизнеса.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large' },
  },
  alternates: { canonical: 'https://easycrm.ru' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
