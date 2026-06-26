import type { Metadata } from 'next'
import Navbar from '@/components/common/Navbar'
import Footer from '@/components/common/Footer'
import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Services from '@/components/sections/Services'
import WhyUs from '@/components/sections/WhyUs'
import Process from '@/components/sections/Process'
import Cases from '@/components/sections/Cases'
import Reviews from '@/components/sections/Reviews'
import FAQ from '@/components/sections/FAQ'
import Contact from '@/components/sections/Contact'

export const metadata: Metadata = {
  title: 'easyCRM — Разработка сайтов на Bitrix и внедрение CRM под ключ',
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <WhyUs />
        <Process />
        <Cases />
        <Reviews />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
