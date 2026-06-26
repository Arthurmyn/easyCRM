'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Phone, Mail, MapPin, Send, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { api } from '@/lib/api'
import { toast } from '@/components/ui/toaster'

interface FormData {
  name: string
  phone: string
  email: string
  company: string
  message: string
}

export default function Contact() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    company: '',
    message: '',
  })
  const [errors, setErrors] = useState<Partial<FormData>>({})

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {}
    if (!form.name.trim() || form.name.length < 2) newErrors.name = 'Введите имя (минимум 2 символа)'
    if (!form.phone.trim() || form.phone.length < 10) newErrors.phone = 'Введите корректный телефон'
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Некорректный email'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsLoading(true)
    try {
      await api.createLead(form)
      setSuccess(true)
      toast({ title: 'Заявка отправлена!', description: 'Мы свяжемся с вами в ближайшее время.', variant: 'success' })
      setForm({ name: '', phone: '', email: '', company: '', message: '' })
    } catch (err) {
      toast({ title: 'Ошибка', description: err instanceof Error ? err.message : 'Попробуйте ещё раз', variant: 'error' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  return (
    <section id="contact" className="section-padding bg-secondary/30">
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
              <span className="text-sm text-muted-foreground">Связаться с нами</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold">
              Начнём ваш проект{' '}
              <span className="text-gradient-blue">прямо сейчас</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Оставьте заявку и получите бесплатную консультацию в течение 24 часов
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="glass-card rounded-3xl p-8">
                {success ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12 space-y-4"
                  >
                    <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto">
                      <CheckCircle className="w-8 h-8 text-green-400" />
                    </div>
                    <h3 className="text-2xl font-bold">Заявка отправлена!</h3>
                    <p className="text-muted-foreground">Мы свяжемся с вами в ближайшее время</p>
                    <Button variant="outline" onClick={() => setSuccess(false)}>Отправить ещё</Button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Имя *</Label>
                        <Input
                          id="name"
                          placeholder="Иван Иванов"
                          value={form.name}
                          onChange={handleChange('name')}
                          className={errors.name ? 'border-red-500/50' : ''}
                        />
                        {errors.name && <p className="text-xs text-red-400">{errors.name}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Телефон *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+7 (999) 123-45-67"
                          value={form.phone}
                          onChange={handleChange('phone')}
                          className={errors.phone ? 'border-red-500/50' : ''}
                        />
                        {errors.phone && <p className="text-xs text-red-400">{errors.phone}</p>}
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="ivan@company.ru"
                          value={form.email}
                          onChange={handleChange('email')}
                          className={errors.email ? 'border-red-500/50' : ''}
                        />
                        {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">Компания</Label>
                        <Input
                          id="company"
                          placeholder="ООО Ваша компания"
                          value={form.company}
                          onChange={handleChange('company')}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Комментарий</Label>
                      <Textarea
                        id="message"
                        placeholder="Расскажите о вашем проекте..."
                        value={form.message}
                        onChange={handleChange('message')}
                      />
                    </div>
                    <Button type="submit" size="lg" className="w-full group" disabled={isLoading}>
                      {isLoading ? (
                        <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      ) : (
                        <>
                          Отправить заявку
                          <Send className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
                    </p>
                  </form>
                )}
              </div>
            </motion.div>

            {/* Contact info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-8"
            >
              <div className="space-y-6">
                {[
                  {
                    icon: Phone,
                    label: 'Телефон',
                    value: '+7 (495) 123-45-67',
                    href: 'tel:+74951234567',
                    desc: 'Пн-Пт с 9:00 до 19:00',
                  },
                  {
                    icon: Mail,
                    label: 'Email',
                    value: 'info@easycrm.ru',
                    href: 'mailto:info@easycrm.ru',
                    desc: 'Отвечаем в течение 24 часов',
                  },
                  {
                    icon: MapPin,
                    label: 'Адрес',
                    value: 'г. Москва, ул. Пример, д. 1',
                    href: '#',
                    desc: 'офис 100, БЦ «Технопарк»',
                  },
                ].map((contact) => (
                  <a
                    key={contact.label}
                    href={contact.href}
                    className="flex items-start gap-4 group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-all">
                      <contact.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-0.5">{contact.label}</div>
                      <div className="font-semibold group-hover:text-primary transition-colors">{contact.value}</div>
                      <div className="text-sm text-muted-foreground">{contact.desc}</div>
                    </div>
                  </a>
                ))}
              </div>

              {/* Map placeholder */}
              <div className="glass-card rounded-2xl overflow-hidden h-64 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <MapPin className="w-8 h-8 text-primary mx-auto" />
                  <div className="text-sm text-muted-foreground">Карта офиса</div>
                  <div className="text-xs text-muted-foreground">г. Москва, ул. Пример, д. 1</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
