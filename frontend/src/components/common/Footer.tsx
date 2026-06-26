import Link from 'next/link'
import { Zap, Phone, Mail, MapPin, ExternalLink } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-white/8 bg-secondary/50">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold">
                easy<span className="text-gradient-blue">CRM</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Разрабатываем сайты на Bitrix и внедряем CRM-системы для роста вашего бизнеса.
            </p>
            <div className="flex items-center gap-2">
              <div className="px-2 py-1 rounded-md bg-primary/10 border border-primary/20 text-xs text-primary font-medium">
                Bitrix Partner
              </div>
              <div className="px-2 py-1 rounded-md bg-accent/10 border border-accent/20 text-xs text-accent font-medium">
                Gold
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Услуги</h3>
            <ul className="space-y-2">
              {[
                'Корпоративные сайты',
                'Интернет-магазины',
                'Landing Page',
                'Интеграция Bitrix24',
                'CRM внедрение',
                'Поддержка сайтов',
              ].map((item) => (
                <li key={item}>
                  <a href="#services" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Компания</h3>
            <ul className="space-y-2">
              {[
                { label: 'О компании', href: '#about' },
                { label: 'Кейсы', href: '#cases' },
                { label: 'Отзывы', href: '#reviews' },
                { label: 'FAQ', href: '#faq' },
                { label: 'Контакты', href: '#contact' },
              ].map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacts */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Контакты</h3>
            <ul className="space-y-3">
              <li>
                <a href="tel:+74951234567" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Phone className="w-4 h-4 text-primary" />
                  +7 (495) 123-45-67
                </a>
              </li>
              <li>
                <a href="mailto:info@easycrm.ru" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Mail className="w-4 h-4 text-primary" />
                  info@easycrm.ru
                </a>
              </li>
              <li>
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span>г. Москва, ул. Пример, д. 1, офис 100</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} easyCRM. Все права защищены.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <a href="/privacy" className="hover:text-foreground transition-colors">Политика конфиденциальности</a>
            <Link href="/admin" className="flex items-center gap-1 hover:text-foreground transition-colors">
              Админ <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
