'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'

const defaultReviews = [
  {
    id: '1',
    author: 'Александр Петров',
    company: 'МегаСтрой',
    rating: 5,
    text: 'Команда easyCRM сделала нам отличный сайт в срок и даже раньше! Очень доволен результатом — конверсия выросла в разы. Буду обращаться ещё.',
    initials: 'АП',
    color: 'bg-blue-500',
  },
  {
    id: '2',
    author: 'Мария Иванова',
    company: 'TechStore',
    rating: 5,
    text: 'Отличная команда профессионалов. Внедрили CRM под ключ, обучили всех сотрудников. Теперь не представляем работу без Bitrix24.',
    initials: 'МИ',
    color: 'bg-purple-500',
  },
  {
    id: '3',
    author: 'Дмитрий Соколов',
    company: 'LegalPro',
    rating: 5,
    text: 'Работаем с easyCRM уже 2 года. Всегда на связи, быстро решают любые вопросы. Рекомендую всем, кто ищет надёжного IT-партнёра.',
    initials: 'ДС',
    color: 'bg-green-500',
  },
  {
    id: '4',
    author: 'Елена Козлова',
    company: 'FitLife',
    rating: 5,
    text: 'Сделали нам лендинг, который реально продаёт! За первый месяц количество заявок выросло в 3 раза. Профессионалы своего дела.',
    initials: 'ЕК',
    color: 'bg-orange-500',
  },
  {
    id: '5',
    author: 'Игорь Новиков',
    company: 'AutoParts',
    rating: 5,
    text: 'Сложный проект — каталог с 500 000 позиций. Справились отлично, всё работает быстро и стабильно. Очень доволен сотрудничеством.',
    initials: 'ИН',
    color: 'bg-cyan-500',
  },
]

export default function Reviews() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(0)

  const prev = () => {
    setDirection(-1)
    setCurrent((c) => (c === 0 ? defaultReviews.length - 1 : c - 1))
  }

  const next = () => {
    setDirection(1)
    setCurrent((c) => (c === defaultReviews.length - 1 ? 0 : c + 1))
  }

  const review = defaultReviews[current]

  return (
    <section id="reviews" className="section-padding bg-secondary/30">
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
              <span className="text-sm text-muted-foreground">Отзывы клиентов</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold">
              Что говорят{' '}
              <span className="text-gradient-blue">наши клиенты</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-3xl mx-auto"
          >
            <div className="glass-card rounded-3xl p-10 relative">
              <Quote className="absolute top-8 right-8 w-12 h-12 text-primary/10" />

              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={current}
                  custom={direction}
                  initial={{ opacity: 0, x: direction * 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -40 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="space-y-6"
                >
                  {/* Stars */}
                  <div className="flex gap-1">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>

                  {/* Text */}
                  <p className="text-lg md:text-xl text-foreground/90 leading-relaxed font-light italic">
                    &ldquo;{review.text}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full ${review.color} flex items-center justify-center text-white font-bold text-sm`}>
                      {review.initials}
                    </div>
                    <div>
                      <div className="font-semibold">{review.author}</div>
                      <div className="text-sm text-muted-foreground">{review.company}</div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8">
                <div className="flex gap-2">
                  {defaultReviews.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i) }}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === current ? 'w-8 bg-primary' : 'w-1.5 bg-white/20 hover:bg-white/40'
                      }`}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={prev}
                    className="w-10 h-10 rounded-xl glass border border-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-white/20 transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={next}
                    className="w-10 h-10 rounded-xl glass border border-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-white/20 transition-all"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* All reviews mini */}
            <div className="grid grid-cols-5 gap-3 mt-6">
              {defaultReviews.map((r, i) => (
                <button
                  key={r.id}
                  onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i) }}
                  className={`glass-card rounded-xl p-3 text-left transition-all duration-200 ${i === current ? 'border-primary/40' : 'opacity-50 hover:opacity-75'}`}
                >
                  <div className={`w-8 h-8 rounded-full ${r.color} flex items-center justify-center text-white text-xs font-bold mb-1`}>
                    {r.initials}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">{r.author}</div>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
