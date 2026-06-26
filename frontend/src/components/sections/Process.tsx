'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Search, PenTool, Figma, Code, TestTube, Rocket } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: Search,
    title: 'Анализ',
    description: 'Изучаем ваш бизнес, конкурентов и цели. Формируем техническое задание и стратегию.',
    duration: '1-3 дня',
  },
  {
    number: '02',
    icon: PenTool,
    title: 'Проектирование',
    description: 'Разрабатываем архитектуру, структуру сайта и прототипы всех ключевых страниц.',
    duration: '3-7 дней',
  },
  {
    number: '03',
    icon: Figma,
    title: 'Дизайн',
    description: 'Создаём уникальный дизайн в Figma, согласовываем с вами каждый экран.',
    duration: '7-14 дней',
  },
  {
    number: '04',
    icon: Code,
    title: 'Разработка',
    description: 'Вёрстка и программирование по стандартам Bitrix. Подключаем все необходимые интеграции.',
    duration: '14-45 дней',
  },
  {
    number: '05',
    icon: TestTube,
    title: 'Тестирование',
    description: 'QA-тестирование на всех устройствах, нагрузочное тестирование и проверка безопасности.',
    duration: '3-7 дней',
  },
  {
    number: '06',
    icon: Rocket,
    title: 'Запуск',
    description: 'Публикуем сайт, настраиваем аналитику, обучаем команду и переходим к поддержке.',
    duration: '1-2 дня',
  },
]

export default function Process() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="process" className="section-padding bg-secondary/30">
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
              <span className="text-sm text-muted-foreground">Как мы работаем</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold">
              Прозрачный{' '}
              <span className="text-gradient-blue">процесс</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Чёткая методология разработки без сюрпризов. Вы всегда знаете, на каком этапе находится ваш проект.
            </p>
          </motion.div>

          {/* Timeline */}
          <div className="relative">
            {/* Connector line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-primary/20 to-transparent hidden sm:block md:-translate-x-px" />

            <div className="space-y-8">
              {steps.map((step, i) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`relative grid md:grid-cols-2 gap-8 items-center ${i % 2 === 0 ? '' : 'md:flex-row-reverse'}`}
                >
                  {/* Content */}
                  <div className={`${i % 2 === 0 ? 'md:text-right md:pr-12' : 'md:col-start-2 md:pl-12'}`}>
                    <div className="glass-card rounded-2xl p-6 group hover:border-primary/30 transition-all duration-300 hover:-translate-y-0.5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-all">
                          <step.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">{step.duration}</div>
                          <div className="text-base font-semibold">{step.title}</div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                    </div>
                  </div>

                  {/* Step number bubble */}
                  <div className={`absolute left-0 md:left-1/2 md:-translate-x-1/2 flex items-center justify-center ${i % 2 === 0 ? '' : ''}`}>
                    <div className="w-12 h-12 rounded-full glass border border-primary/30 flex items-center justify-center shadow-glow">
                      <span className="text-sm font-bold text-gradient-blue">{step.number}</span>
                    </div>
                  </div>

                  {/* Empty column for alternating */}
                  {i % 2 === 0 && <div className="hidden md:block" />}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
