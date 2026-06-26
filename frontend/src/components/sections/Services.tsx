'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Building2, ShoppingCart, Layout, GitMerge, Users, Shield, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const iconMap: Record<string, React.ElementType> = {
  'building2': Building2,
  'shopping-cart': ShoppingCart,
  'layout': Layout,
  'git-merge': GitMerge,
  'users': Users,
  'shield-check': Shield,
}

const defaultServices = [
  {
    id: '1',
    title: 'Корпоративные сайты',
    description: 'Разрабатываем представительские сайты для бизнеса любого масштаба. Современный дизайн, быстрая загрузка и полная адаптивность.',
    icon: 'building2',
    price: 'от 80 000 ₽',
  },
  {
    id: '2',
    title: 'Интернет-магазины',
    description: 'Создаём интернет-магазины на Bitrix с интеграцией 1С, платёжными системами и системами доставки.',
    icon: 'shopping-cart',
    price: 'от 120 000 ₽',
  },
  {
    id: '3',
    title: 'Landing Page',
    description: 'Высококонверсионные посадочные страницы для продвижения товаров и услуг с A/B тестированием.',
    icon: 'layout',
    price: 'от 30 000 ₽',
  },
  {
    id: '4',
    title: 'Интеграция Bitrix24',
    description: 'Внедряем и настраиваем Bitrix24: CRM, задачи, воронки продаж, интеграция с телефонией и мессенджерами.',
    icon: 'git-merge',
    price: 'от 50 000 ₽',
  },
  {
    id: '5',
    title: 'CRM внедрение',
    description: 'Настраиваем CRM-систему под процессы вашего бизнеса. Обучение сотрудников и техническая поддержка.',
    icon: 'users',
    price: 'от 40 000 ₽',
  },
  {
    id: '6',
    title: 'Поддержка сайтов',
    description: 'Техническая поддержка и развитие ваших проектов: обновления, доработки, мониторинг и резервное копирование.',
    icon: 'shield-check',
    price: 'от 15 000 ₽/мес',
  },
]

export default function Services() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const handleContactClick = () => {
    const el = document.querySelector('#contact')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="services" className="section-padding bg-secondary/30">
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
              <span className="text-sm text-muted-foreground">Наши услуги</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold">
              Всё что нужно для{' '}
              <span className="text-gradient-blue">цифрового роста</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Комплексные решения для вашего бизнеса: от разработки сайта до полного внедрения CRM
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {defaultServices.map((service, i) => {
              const Icon = iconMap[service.icon] || Building2
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                >
                  <div className="glass-card rounded-2xl p-6 h-full group hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow cursor-pointer">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-3 group-hover:text-primary transition-colors">{service.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">{service.description}</p>
                    {service.price && (
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-sm font-semibold text-accent">{service.price}</span>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center"
          >
            <Button size="lg" onClick={handleContactClick} className="group">
              Получить консультацию
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
