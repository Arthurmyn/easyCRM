'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Zap, Palette, Search, Plug, Headphones, Lock } from 'lucide-react'

const advantages = [
  {
    icon: Zap,
    title: 'Быстрый запуск',
    description: 'Начинаем работу в течение 3 дней, первые результаты видны уже через 2 недели после старта проекта.',
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10 border-yellow-400/20',
  },
  {
    icon: Palette,
    title: 'Современный дизайн',
    description: 'Создаём UI уровня мировых SaaS-продуктов. Ваш сайт будет выгодно отличаться от конкурентов.',
    color: 'text-pink-400',
    bg: 'bg-pink-400/10 border-pink-400/20',
  },
  {
    icon: Search,
    title: 'SEO из коробки',
    description: 'Техническое SEO, быстрая загрузка и правильная структура — всё для высоких позиций в поиске.',
    color: 'text-green-400',
    bg: 'bg-green-400/10 border-green-400/20',
  },
  {
    icon: Plug,
    title: 'Интеграции',
    description: '1С, CRM, платёжные системы, службы доставки — подключаем любые сервисы для автоматизации бизнеса.',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10 border-blue-400/20',
  },
  {
    icon: Headphones,
    title: 'Поддержка 24/7',
    description: 'Наша команда всегда на связи. Время реакции на критические проблемы — не более 2 часов.',
    color: 'text-accent',
    bg: 'bg-accent/10 border-accent/20',
  },
  {
    icon: Lock,
    title: 'Безопасность',
    description: 'SSL, защита от XSS и инъекций, регулярные обновления и резервные копии ваших данных.',
    color: 'text-purple-400',
    bg: 'bg-purple-400/10 border-purple-400/20',
  },
]

export default function WhyUs() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="why-us" className="section-padding">
      <div className="container-custom">
        <div ref={ref} className="space-y-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center space-y-4 max-w-2xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 glass px-4 py-1.5 rounded-full border border-primary/20">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-sm text-muted-foreground">Почему easyCRM</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold">
              Выбирают нас за{' '}
              <span className="text-gradient-blue">результат</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Мы не просто делаем сайты — мы строим цифровую инфраструктуру для роста вашего бизнеса
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {advantages.map((adv, i) => (
              <motion.div
                key={adv.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <div className="glass-card rounded-2xl p-6 h-full group hover:border-primary/20 transition-all duration-300 hover:-translate-y-1">
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-4 ${adv.bg} transition-all duration-300 group-hover:scale-110`}>
                    <adv.icon className={`w-6 h-6 ${adv.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{adv.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{adv.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="glass rounded-2xl p-8 border border-primary/10 text-center space-y-4"
          >
            <p className="text-2xl font-bold">
              Готовы обсудить ваш проект?
            </p>
            <p className="text-muted-foreground">
              Оставьте заявку и получите бесплатную консультацию в течение 24 часов
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <div className="flex items-center gap-2 px-4 py-2 glass rounded-xl border border-white/10">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-sm text-muted-foreground">Бесплатная консультация</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 glass rounded-xl border border-white/10">
                <div className="w-2 h-2 rounded-full bg-blue-400" />
                <span className="text-sm text-muted-foreground">Расчёт за 24 часа</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 glass rounded-xl border border-white/10">
                <div className="w-2 h-2 rounded-full bg-yellow-400" />
                <span className="text-sm text-muted-foreground">Без обязательств</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
