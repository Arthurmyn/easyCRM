'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { ExternalLink, TrendingUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const defaultProjects = [
  {
    id: '1',
    title: 'МегаСтрой — Корпоративный сайт',
    description: 'Разработали корпоративный сайт для строительной компании с каталогом объектов, личным кабинетом и CRM интеграцией.',
    image: null,
    category: 'Корпоративный сайт',
    stack: ['Bitrix', '1C', 'CRM'],
    result: 'Рост заявок на 340% за 3 месяца',
    gradient: 'from-blue-900/50 to-blue-800/30',
    accent: '#2563EB',
  },
  {
    id: '2',
    title: 'TechStore — Интернет-магазин',
    description: 'Создали интернет-магазин электроники с интеграцией 1С, системой лояльности и мобильным приложением.',
    image: null,
    category: 'Интернет-магазин',
    stack: ['Bitrix', '1C', 'iOS', 'Android'],
    result: 'Конверсия выросла с 1.2% до 4.8%',
    gradient: 'from-purple-900/50 to-purple-800/30',
    accent: '#9333ea',
  },
  {
    id: '3',
    title: 'LegalPro — CRM внедрение',
    description: 'Внедрили Bitrix24 для юридической фирмы: автоматизация воронки продаж, интеграция с телефонией.',
    image: null,
    category: 'CRM внедрение',
    stack: ['Bitrix24', 'Telephony', 'Email'],
    result: 'Скорость обработки заявок выросла в 5 раз',
    gradient: 'from-green-900/50 to-green-800/30',
    accent: '#16a34a',
  },
  {
    id: '4',
    title: 'FitLife — Landing Page',
    description: 'Разработали высококонверсионный лендинг для фитнес-клуба с онлайн-записью и интеграцией AmoCRM.',
    image: null,
    category: 'Landing Page',
    stack: ['Bitrix', 'AmoCRM', 'Tilda'],
    result: 'CTR рекламы вырос на 220%',
    gradient: 'from-orange-900/50 to-orange-800/30',
    accent: '#ea580c',
  },
  {
    id: '5',
    title: 'AutoParts — Каталог запчастей',
    description: 'Создали сложный каталог автозапчастей с фильтрацией по VIN, интеграцией с поставщиками.',
    image: null,
    category: 'Интернет-магазин',
    stack: ['Bitrix', '1C', 'TecDoc'],
    result: 'Оборот вырос на 180% за полгода',
    gradient: 'from-cyan-900/50 to-cyan-800/30',
    accent: '#0891b2',
  },
  {
    id: '6',
    title: 'MedClinic — Медицинский портал',
    description: 'Разработали портал для медицинской клиники с онлайн-записью, личными кабинетами пациентов.',
    image: null,
    category: 'Корпоративный сайт',
    stack: ['Bitrix', 'CRM', 'HIPAA'],
    result: 'Запись через сайт выросла до 75%',
    gradient: 'from-rose-900/50 to-rose-800/30',
    accent: '#e11d48',
  },
]

const categories = ['Все', 'Корпоративный сайт', 'Интернет-магазин', 'CRM внедрение', 'Landing Page']

export default function Cases() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [activeCategory, setActiveCategory] = useState('Все')

  const filtered = activeCategory === 'Все'
    ? defaultProjects
    : defaultProjects.filter((p) => p.category === activeCategory)

  return (
    <section id="cases" className="section-padding">
      <div className="container-custom">
        <div ref={ref} className="space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center space-y-4 max-w-2xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 glass px-4 py-1.5 rounded-full border border-primary/20">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-sm text-muted-foreground">Наши кейсы</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold">
              Проекты, которые{' '}
              <span className="text-gradient-blue">приносят результат</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Реальные кейсы с измеримыми показателями роста
            </p>
          </motion.div>

          {/* Filter tabs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex flex-wrap gap-2 justify-center"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-primary text-white shadow-glow'
                    : 'glass text-muted-foreground hover:text-foreground border border-white/10 hover:border-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>

          {/* Projects grid */}
          <motion.div
            layout
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                layout
              >
                <div className="glass-card rounded-2xl overflow-hidden group hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow h-full flex flex-col">
                  {/* Image/gradient area */}
                  <div className={`h-48 bg-gradient-to-br ${project.gradient} relative flex items-center justify-center`}>
                    <div className="absolute inset-0 flex items-center justify-center opacity-20">
                      <div className="w-32 h-32 rounded-full border-2 border-white/30" />
                      <div className="absolute w-20 h-20 rounded-full border border-white/20" />
                    </div>
                    <div className="relative text-center">
                      <div className="text-4xl font-black text-white/20 select-none">{project.category.slice(0, 2).toUpperCase()}</div>
                    </div>
                    <div className="absolute top-4 right-4">
                      <ExternalLink className="w-5 h-5 text-white/40 group-hover:text-white/80 transition-colors" />
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <Badge variant="secondary" className="text-xs">{project.category}</Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{project.description}</p>

                    {/* Stack */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.stack.map((tech) => (
                        <span key={tech} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-xs text-muted-foreground">
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Result */}
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-green-500/10 border border-green-500/20">
                      <TrendingUp className="w-4 h-4 text-green-400 shrink-0" />
                      <span className="text-xs text-green-400 font-medium">{project.result}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
