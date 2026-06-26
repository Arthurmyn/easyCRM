'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Play, Star, TrendingUp, Users, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'

const floatingStats = [
  { icon: TrendingUp, label: 'Рост продаж', value: '+340%', color: 'text-green-400' },
  { icon: Users, label: 'Клиентов', value: '150+', color: 'text-blue-400' },
  { icon: Award, label: 'Партнёр', value: 'Gold', color: 'text-yellow-400' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function Hero() {
  const handleAnchorClick = (href: string) => {
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Background */}
      <div className="absolute inset-0 hero-gradient" />
      <div className="absolute inset-0 grid-bg opacity-50" />

      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/15 rounded-full blur-3xl animate-glow" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <div className="space-y-8">
            {/* Badge */}
            <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible">
              <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full border border-primary/20">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-sm text-muted-foreground">Официальный партнёр</span>
                <span className="text-sm font-semibold text-foreground">1С-Битрикс</span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible" className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
                Создаём сайты на{' '}
                <span className="text-gradient-blue">Bitrix</span>
                {' '}и внедряем{' '}
                <span className="relative">
                  <span className="text-gradient-blue">CRM</span>
                  <span className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-primary to-accent opacity-50" />
                </span>
                {' '}для роста бизнеса
              </h1>
            </motion.div>

            {/* Description */}
            <motion.p
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="text-lg text-muted-foreground leading-relaxed max-w-lg"
            >
              Разрабатываем корпоративные сайты и интернет-магазины, внедряем Bitrix24 CRM под ключ.
              Быстрый запуск, современный дизайн и полная поддержка.
            </motion.p>

            {/* CTAs */}
            <motion.div
              custom={3}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                size="xl"
                onClick={() => handleAnchorClick('#contact')}
                className="group"
              >
                Оставить заявку
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                size="xl"
                variant="outline"
                onClick={() => handleAnchorClick('#cases')}
                className="group"
              >
                <Play className="w-5 h-5 text-primary" />
                Смотреть кейсы
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              custom={4}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-3 gap-6 pt-4"
            >
              {[
                { value: '150+', label: 'Проектов' },
                { value: '8 лет', label: 'Опыта' },
                { value: '98%', label: 'Довольных' },
              ].map((stat) => (
                <div key={stat.label} className="space-y-1">
                  <div className="text-2xl font-bold text-gradient-blue">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Dashboard illustration */}
          <motion.div
            initial={{ opacity: 0, x: 60, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative hidden lg:block"
          >
            {/* Main dashboard card */}
            <div className="relative">
              <div className="glass-card rounded-3xl p-6 glow-border shadow-card">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">CRM Dashboard</div>
                    <div className="text-lg font-semibold">Аналитика продаж</div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-xs text-green-400 font-medium">Онлайн</span>
                  </div>
                </div>

                {/* Chart bars */}
                <div className="flex items-end gap-2 h-32 mb-6">
                  {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                    <motion.div
                      key={i}
                      className="flex-1 rounded-t-sm bg-gradient-to-t from-primary/80 to-primary/20"
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ delay: 0.5 + i * 0.05, duration: 0.5, ease: 'easeOut' }}
                    />
                  ))}
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Заявки', value: '248', change: '+12%', up: true },
                    { label: 'Клиенты', value: '1,840', change: '+8%', up: true },
                    { label: 'Выручка', value: '₽2.4M', change: '+24%', up: true },
                  ].map((m) => (
                    <div key={m.label} className="glass rounded-xl p-3">
                      <div className="text-xs text-muted-foreground">{m.label}</div>
                      <div className="text-base font-bold mt-1">{m.value}</div>
                      <div className="text-xs text-green-400 mt-0.5">{m.change}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating stat cards */}
              {floatingStats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + i * 0.2, duration: 0.4 }}
                  className={`absolute glass rounded-xl px-3 py-2 shadow-card border border-white/10 ${
                    i === 0 ? '-top-4 -left-8' : i === 1 ? 'top-1/2 -right-8' : '-bottom-4 left-8'
                  }`}
                  style={{ animation: `float ${3 + i}s ease-in-out infinite`, animationDelay: `${i * 0.5}s` }}
                >
                  <div className="flex items-center gap-2">
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                    <div>
                      <div className="text-xs text-muted-foreground">{stat.label}</div>
                      <div className={`text-sm font-bold ${stat.color}`}>{stat.value}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <div className="w-px h-12 bg-gradient-to-b from-transparent to-primary/50" />
        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
      </motion.div>
    </section>
  )
}
