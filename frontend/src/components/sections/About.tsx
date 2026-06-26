'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Trophy, Briefcase, Headphones, Award } from 'lucide-react'

const stats = [
  {
    icon: Trophy,
    value: '8 лет',
    label: 'Опыта работы',
    description: 'Разрабатываем сайты и внедряем CRM с 2016 года',
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10 border-yellow-400/20',
  },
  {
    icon: Briefcase,
    value: '150+',
    label: 'Проектов',
    description: 'Успешно реализованных проектов для бизнеса',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10 border-blue-400/20',
  },
  {
    icon: Headphones,
    value: '24/7',
    label: 'Поддержка',
    description: 'Техническая поддержка в любое время суток',
    color: 'text-green-400',
    bg: 'bg-green-400/10 border-green-400/20',
  },
  {
    icon: Award,
    value: 'Gold',
    label: 'Bitrix Partner',
    description: 'Официальный золотой партнёр 1С-Битрикс',
    color: 'text-accent',
    bg: 'bg-accent/10 border-accent/20',
  },
]

export default function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="about" className="section-padding">
      <div className="container-custom">
        <div ref={ref} className="space-y-16">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center space-y-4 max-w-2xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 glass px-4 py-1.5 rounded-full border border-primary/20">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-sm text-muted-foreground">О компании</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold">
              Мы помогаем бизнесу{' '}
              <span className="text-gradient-blue">расти онлайн</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              easyCRM — команда профессионалов в разработке сайтов на Bitrix и внедрении CRM-систем.
              Мы создаём инструменты, которые реально работают на результат.
            </p>
          </motion.div>

          {/* Stats grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="glass-card rounded-2xl p-6 h-full hover:border-primary/30 transition-all duration-300 group hover:-translate-y-1">
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-4 ${stat.bg} transition-all duration-300 group-hover:scale-110`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className={`text-3xl font-bold mb-1 ${stat.color}`}>{stat.value}</div>
                  <div className="text-base font-semibold mb-2">{stat.label}</div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{stat.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Extra info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="glass rounded-2xl p-8 border border-primary/10 grid md:grid-cols-3 gap-8"
          >
            {[
              {
                title: 'Полный цикл',
                description: 'От анализа задачи до запуска и поддержки. Берём на себя весь процесс.',
              },
              {
                title: 'Чистый код',
                description: 'Пишем масштабируемый код по стандартам. Каждый проект — долгосрочный актив.',
              },
              {
                title: 'Быстрый старт',
                description: 'Начинаем работу в течение 3 дней. Первые результаты — через 2 недели.',
              },
            ].map((item) => (
              <div key={item.title} className="space-y-2">
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
