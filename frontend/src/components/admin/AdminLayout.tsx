'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard,
  MessageSquare,
  FolderOpen,
  Wrench,
  Star,
  HelpCircle,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Zap,
  ChevronRight,
} from 'lucide-react'
import { getUser, clearAuth } from '@/lib/auth'
import type { User } from '@/lib/api'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { href: '/admin/leads', icon: MessageSquare, label: 'Заявки' },
  { href: '/admin/projects', icon: FolderOpen, label: 'Проекты' },
  { href: '/admin/services', icon: Wrench, label: 'Услуги' },
  { href: '/admin/reviews', icon: Star, label: 'Отзывы' },
  { href: '/admin/faq', icon: HelpCircle, label: 'FAQ' },
  { href: '/admin/users', icon: Users, label: 'Пользователи' },
  { href: '/admin/settings', icon: Settings, label: 'Настройки' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    if (isLoginPage) return
    const u = getUser()
    if (!u) {
      router.push('/admin/login')
      return
    }
    setUser(u)
  }, [router, isLoginPage])

  const handleLogout = () => {
    clearAuth()
    router.push('/admin/login')
  }

  if (isLoginPage) return <>{children}</>
  if (!user) return null

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <>
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside
          className={cn(
            'fixed top-0 left-0 bottom-0 z-50 w-64 flex flex-col glass border-r border-white/8 transition-transform duration-300 lg:relative lg:translate-x-0',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          {/* Logo */}
          <div className="p-6 border-b border-white/8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-glow">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold">
                easy<span className="text-gradient-blue">CRM</span>
              </span>
            </Link>
            <div className="mt-3 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-muted-foreground">Админ-панель</span>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group',
                    isActive
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                  )}
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  {item.label}
                  {isActive && <ChevronRight className="w-3 h-3 ml-auto" />}
                </Link>
              )
            })}
          </nav>

          {/* User */}
          <div className="p-4 border-t border-white/8">
            <div className="glass-card rounded-xl p-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{user.name}</div>
                  <div className="text-xs text-muted-foreground">{user.role === 'ADMIN' ? 'Администратор' : 'Менеджер'}</div>
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-muted-foreground hover:text-red-400 hover:bg-red-500/5 transition-all"
            >
              <LogOut className="w-4 h-4" />
              Выйти
            </button>
          </div>
        </aside>
      </>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center gap-4 p-4 glass border-b border-white/8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-semibold">easyCRM Admin</span>
          {sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="ml-auto p-2 rounded-lg text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
