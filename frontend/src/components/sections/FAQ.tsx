'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const defaultFAQ = [
  {
    id: '1',
    question: 'Сколько стоит разработка сайта на Bitrix?',
    answer: 'Стоимость разработки зависит от сложности проекта. Корпоративный сайт — от 80 000 ₽, интернет-магазин — от 120 000 ₽, лендинг — от 30 000 ₽. Для точного расчёта оставьте заявку.',
  },
  {
    id: '2',
    question: 'Сколько времени занимает разработка?',
    answer: 'Лендинг — 1-2 недели, корпоративный сайт — 3-6 недель, интернет-магазин — 6-12 недель. Сроки зависят от объёма функционала и своевременности предоставления материалов.',
  },
  {
    id: '3',
    question: 'Вы официальный партнёр Bitrix?',
    answer: 'Да, easyCRM является сертифицированным партнёром 1С-Битрикс. Наши разработчики имеют официальные сертификаты и большой опыт работы с платформой.',
  },
  {
    id: '4',
    question: 'Что входит в поддержку сайта?',
    answer: 'Техническая поддержка включает: мониторинг работоспособности, обновление ПО, резервное копирование, исправление ошибок, консультации и мелкие доработки в рамках тарифа.',
  },
  {
    id: '5',
    question: 'Можете ли вы перенести существующий сайт на Bitrix?',
    answer: 'Да, мы выполняем миграцию сайтов с любых CMS на Bitrix. Переносим контент, структуру, сохраняем SEO-позиции и настраиваем все необходимые интеграции.',
  },
  {
    id: '6',
    question: 'Как проходит процесс внедрения Bitrix24 CRM?',
    answer: 'Процесс включает: анализ бизнес-процессов, настройку CRM и воронок продаж, интеграцию с телефонией и другими сервисами, обучение сотрудников и поддержку после запуска.',
  },
  {
    id: '7',
    question: 'Предоставляете ли вы гарантию на разработку?',
    answer: 'Да, мы предоставляем гарантию 12 месяцев на все разработанные сайты. В течение этого времени бесплатно исправляем ошибки, допущенные при разработке.',
  },
  {
    id: '8',
    question: 'Работаете ли вы с заказчиками из других городов?',
    answer: 'Да, мы работаем с клиентами по всей России и СНГ. Все коммуникации проходят онлайн — через видеозвонки, мессенджеры и систему управления проектами.',
  },
]

export default function FAQ() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="faq" className="section-padding">
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
              <span className="text-sm text-muted-foreground">FAQ</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold">
              Часто задаваемые{' '}
              <span className="text-gradient-blue">вопросы</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Ответы на самые популярные вопросы о нашей работе
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-3xl mx-auto"
          >
            <div className="glass-card rounded-2xl p-6">
              <Accordion type="single" collapsible className="w-full">
                {defaultFAQ.map((item) => (
                  <AccordionItem key={item.id} value={item.id}>
                    <AccordionTrigger>{item.question}</AccordionTrigger>
                    <AccordionContent>{item.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
