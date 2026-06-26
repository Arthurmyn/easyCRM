'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Save, KeyRound, User, Bell, Globe } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getUser } from '@/lib/auth'
import { toast } from '@/components/ui/toaster'

export default function SettingsPage() {
  const user = getUser()
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', email: user?.email || '' })
  const [passwordForm, setPasswordForm] = useState({ current: '', newPass: '', confirm: '' })
  const [saving, setSaving] = useState(false)

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      toast({ title: 'Профиль обновлён', description: 'Изменения сохранены', variant: 'success' })
    }, 800)
  }

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordForm.newPass !== passwordForm.confirm) {
      toast({ title: 'Пароли не совпадают', variant: 'error' })
      return
    }
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      setPasswordForm({ current: '', newPass: '', confirm: '' })
      toast({ title: 'Пароль изменён', variant: 'success' })
    }, 800)
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Настройки</h1>
        <p className="text-muted-foreground text-sm mt-1">Управление профилем и параметрами системы</p>
      </div>

      {/* Profile */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Card className="glass-card border-white/8">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <User className="w-4 h-4 text-primary" /> Профиль
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary">
                  {user?.name?.[0] || 'A'}
                </div>
                <div>
                  <div className="font-medium">{user?.name}</div>
                  <div className="text-sm text-muted-foreground">{user?.email}</div>
                  <div className="text-xs text-primary mt-1">{user?.role === 'ADMIN' ? 'Администратор' : 'Менеджер'}</div>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <Label>Имя</Label>
                  <Input value={profileForm.name} onChange={(e) => setProfileForm((f) => ({ ...f, name: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label>Email</Label>
                  <Input type="email" value={profileForm.email} onChange={(e) => setProfileForm((f) => ({ ...f, email: e.target.value }))} />
                </div>
              </div>
              <Button type="submit" disabled={saving}>
                <Save className="w-4 h-4" /> {saving ? 'Сохранение...' : 'Сохранить'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Password */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="glass-card border-white/8">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-primary" /> Смена пароля
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSavePassword} className="space-y-4">
              {[
                { label: 'Текущий пароль', key: 'current' },
                { label: 'Новый пароль', key: 'newPass' },
                { label: 'Подтверждение', key: 'confirm' },
              ].map(({ label, key }) => (
                <div key={key} className="space-y-1.5">
                  <Label>{label}</Label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={passwordForm[key as keyof typeof passwordForm]}
                    onChange={(e) => setPasswordForm((f) => ({ ...f, [key]: e.target.value }))}
                  />
                </div>
              ))}
              <Button type="submit" disabled={saving}>
                <Save className="w-4 h-4" /> {saving ? 'Сохранение...' : 'Изменить пароль'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* System info */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Card className="glass-card border-white/8">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary" /> Информация о системе
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { label: 'Версия', value: '1.0.0' },
                { label: 'Платформа', value: 'easyCRM v1' },
                { label: 'API URL', value: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000' },
                { label: 'Статус', value: '● Работает', className: 'text-green-400' },
              ].map(({ label, value, className }) => (
                <div key={label} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <span className="text-sm text-muted-foreground">{label}</span>
                  <span className={`text-sm font-medium ${className || ''}`}>{value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
