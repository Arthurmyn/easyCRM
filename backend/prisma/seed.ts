import { PrismaClient, UserRole, LeadStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Users
  const adminPassword = await bcrypt.hash('admin123456', 12)
  const managerPassword = await bcrypt.hash('manager123456', 12)

  await prisma.user.upsert({
    where: { email: 'admin@easycrm.ru' },
    update: {},
    create: {
      name: 'Администратор',
      email: 'admin@easycrm.ru',
      password: adminPassword,
      role: UserRole.ADMIN,
    },
  })

  await prisma.user.upsert({
    where: { email: 'manager@easycrm.ru' },
    update: {},
    create: {
      name: 'Менеджер',
      email: 'manager@easycrm.ru',
      password: managerPassword,
      role: UserRole.MANAGER,
    },
  })

  // Services
  const services = [
    {
      title: 'Корпоративные сайты',
      description: 'Разрабатываем представительские сайты для бизнеса любого масштаба. Современный дизайн, быстрая загрузка и полная адаптивность.',
      icon: 'building2',
      price: 'от 80 000 ₽',
      order: 1,
    },
    {
      title: 'Интернет-магазины',
      description: 'Создаём интернет-магазины на Bitrix с интеграцией 1С, платёжными системами и системами доставки.',
      icon: 'shopping-cart',
      price: 'от 120 000 ₽',
      order: 2,
    },
    {
      title: 'Landing Page',
      description: 'Высококонверсионные посадочные страницы для продвижения товаров и услуг с A/B тестированием.',
      icon: 'layout',
      price: 'от 30 000 ₽',
      order: 3,
    },
    {
      title: 'Интеграция Bitrix24',
      description: 'Внедряем и настраиваем Bitrix24: CRM, задачи, воронки продаж, интеграция с телефонией и мессенджерами.',
      icon: 'git-merge',
      price: 'от 50 000 ₽',
      order: 4,
    },
    {
      title: 'CRM внедрение',
      description: 'Настраиваем CRM-систему под процессы вашего бизнеса. Обучение сотрудников и техническая поддержка.',
      icon: 'users',
      price: 'от 40 000 ₽',
      order: 5,
    },
    {
      title: 'Поддержка сайтов',
      description: 'Техническая поддержка и развитие ваших проектов: обновления, доработки, мониторинг и резервное копирование.',
      icon: 'shield-check',
      price: 'от 15 000 ₽/мес',
      order: 6,
    },
  ]

  for (const service of services) {
    await prisma.service.create({ data: service })
  }

  // Projects
  const projects = [
    {
      title: 'МегаСтрой — Корпоративный сайт',
      description: 'Разработали корпоративный сайт для строительной компании с каталогом объектов, личным кабинетом и CRM интеграцией.',
      image: '/images/project-1.jpg',
      category: 'Корпоративный сайт',
      link: 'https://example.com',
      stack: ['Bitrix', '1C', 'CRM'],
      result: 'Рост заявок на 340% за 3 месяца',
      order: 1,
    },
    {
      title: 'TechStore — Интернет-магазин',
      description: 'Создали интернет-магазин электроники с интеграцией 1С, системой лояльности и мобильным приложением.',
      image: '/images/project-2.jpg',
      category: 'Интернет-магазин',
      link: 'https://example.com',
      stack: ['Bitrix', '1C', 'iOS', 'Android'],
      result: 'Конверсия выросла с 1.2% до 4.8%',
      order: 2,
    },
    {
      title: 'LegalPro — CRM внедрение',
      description: 'Внедрили Bitrix24 для юридической фирмы: автоматизация воронки продаж, интеграция с телефонией.',
      image: '/images/project-3.jpg',
      category: 'CRM внедрение',
      link: 'https://example.com',
      stack: ['Bitrix24', 'Telephony', 'Email'],
      result: 'Скорость обработки заявок выросла в 5 раз',
      order: 3,
    },
    {
      title: 'FitLife — Landing Page',
      description: 'Разработали высококонверсионный лендинг для фитнес-клуба с онлайн-записью и интеграцией AmoCRM.',
      image: '/images/project-4.jpg',
      category: 'Landing Page',
      link: 'https://example.com',
      stack: ['Bitrix', 'AmoCRM', 'Tilda'],
      result: 'CTR рекламы вырос на 220%',
      order: 4,
    },
    {
      title: 'AutoParts — Каталог запчастей',
      description: 'Создали сложный каталог автозапчастей с фильтрацией по VIN, интеграцией с поставщиками и оптовыми ценами.',
      image: '/images/project-5.jpg',
      category: 'Интернет-магазин',
      link: 'https://example.com',
      stack: ['Bitrix', '1C', 'TecDoc'],
      result: 'Оборот вырос на 180% за полгода',
      order: 5,
    },
    {
      title: 'MedClinic — Медицинский портал',
      description: 'Разработали портал для медицинской клиники с онлайн-записью, личными кабинетами пациентов и врачей.',
      image: '/images/project-6.jpg',
      category: 'Корпоративный сайт',
      link: 'https://example.com',
      stack: ['Bitrix', 'CRM', 'HIPAA'],
      result: 'Запись через сайт выросла до 75%',
      order: 6,
    },
  ]

  for (const project of projects) {
    await prisma.project.create({ data: project })
  }

  // Reviews
  const reviews = [
    {
      author: 'Александр Петров',
      company: 'МегаСтрой',
      rating: 5,
      text: 'Команда easyCRM сделала нам отличный сайт в срок и даже раньше! Очень доволен результатом — конверсия выросла в разы. Буду обращаться ещё.',
      avatar: '/images/avatar-1.jpg',
    },
    {
      author: 'Мария Иванова',
      company: 'TechStore',
      rating: 5,
      text: 'Отличная команда профессионалов. Внедрили CRM под ключ, обучили всех сотрудников. Теперь не представляем работу без Bitrix24.',
      avatar: '/images/avatar-2.jpg',
    },
    {
      author: 'Дмитрий Соколов',
      company: 'LegalPro',
      rating: 5,
      text: 'Работаем с easyCRM уже 2 года. Всегда на связи, быстро решают любые вопросы. Рекомендую всем, кто ищет надёжного IT-партнёра.',
      avatar: '/images/avatar-3.jpg',
    },
    {
      author: 'Елена Козлова',
      company: 'FitLife',
      rating: 5,
      text: 'Сделали нам лендинг, который реально продаёт! За первый месяц количество заявок выросло в 3 раза. Профессионалы своего дела.',
      avatar: '/images/avatar-4.jpg',
    },
    {
      author: 'Игорь Новиков',
      company: 'AutoParts',
      rating: 5,
      text: 'Сложный проект — каталог с 500 000 позиций. Справились отлично, всё работает быстро и стабильно. Очень доволен сотрудничеством.',
      avatar: '/images/avatar-5.jpg',
    },
  ]

  for (const review of reviews) {
    await prisma.review.create({ data: review })
  }

  // FAQ
  const faqs = [
    {
      question: 'Сколько стоит разработка сайта на Bitrix?',
      answer: 'Стоимость разработки зависит от сложности проекта. Корпоративный сайт — от 80 000 ₽, интернет-магазин — от 120 000 ₽, лендинг — от 30 000 ₽. Для точного расчёта оставьте заявку.',
      order: 1,
    },
    {
      question: 'Сколько времени занимает разработка?',
      answer: 'Лендинг — 1-2 недели, корпоративный сайт — 3-6 недель, интернет-магазин — 6-12 недель. Сроки зависят от объёма функционала и своевременности предоставления материалов.',
      order: 2,
    },
    {
      question: 'Вы официальный партнёр Bitrix?',
      answer: 'Да, easyCRM является сертифицированным партнёром 1С-Битрикс. Наши разработчики имеют официальные сертификаты и большой опыт работы с платформой.',
      order: 3,
    },
    {
      question: 'Что входит в поддержку сайта?',
      answer: 'Техническая поддержка включает: мониторинг работоспособности, обновление ПО, резервное копирование, исправление ошибок, консультации и мелкие доработки в рамках тарифа.',
      order: 4,
    },
    {
      question: 'Можете ли вы перенести существующий сайт на Bitrix?',
      answer: 'Да, мы выполняем миграцию сайтов с любых CMS на Bitrix. Переносим контент, структуру, сохраняем SEO-позиции и настраиваем все необходимые интеграции.',
      order: 5,
    },
    {
      question: 'Как проходит процесс внедрения Bitrix24 CRM?',
      answer: 'Процесс включает: анализ бизнес-процессов, настройку CRM и воронок продаж, интеграцию с телефонией и другими сервисами, обучение сотрудников и поддержку после запуска.',
      order: 6,
    },
    {
      question: 'Предоставляете ли вы гарантию на разработку?',
      answer: 'Да, мы предоставляем гарантию 12 месяцев на все разработанные сайты. В течение этого времени бесплатно исправляем ошибки, допущенные при разработке.',
      order: 7,
    },
    {
      question: 'Работаете ли вы с заказчиками из других городов?',
      answer: 'Да, мы работаем с клиентами по всей России и СНГ. Все коммуникации проходят онлайн — через видеозвонки, мессенджеры и систему управления проектами.',
      order: 8,
    },
  ]

  for (const faq of faqs) {
    await prisma.fAQ.create({ data: faq })
  }

  // Sample leads
  const leads = [
    {
      name: 'Алексей Морозов',
      phone: '+7 (999) 123-45-67',
      email: 'morozov@company.ru',
      company: 'ООО Ромашка',
      message: 'Нужен корпоративный сайт с каталогом продукции',
      status: LeadStatus.NEW,
    },
    {
      name: 'Светлана Орлова',
      phone: '+7 (999) 234-56-78',
      email: 'orlova@shop.ru',
      company: 'Модный магазин',
      message: 'Хотим интернет-магазин одежды с интеграцией 1С',
      status: LeadStatus.IN_PROGRESS,
    },
    {
      name: 'Виктор Смирнов',
      phone: '+7 (999) 345-67-89',
      email: 'smirnov@legal.ru',
      company: 'Юридическая фирма',
      message: 'Внедрение Bitrix24 для отдела продаж',
      status: LeadStatus.COMPLETED,
    },
  ]

  for (const lead of leads) {
    await prisma.lead.create({ data: lead })
  }

  console.log('✅ Database seeded successfully!')
  console.log('')
  console.log('👤 Admin credentials:')
  console.log('   Email: admin@easycrm.ru')
  console.log('   Password: admin123456')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
