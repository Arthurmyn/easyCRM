'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Plus, Pencil, Trash2, Shield, UserCheck } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { api, User } from '@/lib/api'
import { getToken, getUser } from '@/lib/auth'
import { toast } from '@/components/ui/toaster'
import { formatDateShort, roleLabels } from '@/lib/utils'

const empty = { name: '', email: '', password: '', role: 'MANAGER' as User['role'] }

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState(empty)
  const [editing, setEditing] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const currentUser = getUser()

  const load = useCallback(async () => {
    const token = getToken()
    if (!token) return
    setLoading(true)
    try {
      const res = await api.getUsers(token)
      setUsers(res.data)
    } catch {
      toast({ title: 'Ошибка загрузки', variant: 'error' })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const openCreate = () => { setForm(empty); setEditing(null); setOpen(true) }
  const openEdit = (u: User) => {
    setForm({ name: u.name, email: u.email, password: '', role: u.role })
    setEditing(u.id)
    setOpen(true)
  }

  const handleSave = async () => {
    const token = getToken()
    if (!token) return
    setSaving(true)
    try {
      const data = { ...form, ...(editing && !form.password ? { password: undefined } : {}) }
      if (editing) {
        const res = await api.updateUser(token, editing, data)
        setUsers((prev) => prev.map((u) => (u.id === editing ? res.data : u)))
        toast({ title: 'Пользователь обновлён', variant: 'success' })
      } else {
        const res = await api.createUser(token, data)
        setUsers((prev) => [res.data, ...prev])
        toast({ title: 'Пользователь создан', variant: 'success' })
      }
      setOpen(false)
    } catch (e: unknown) {
      toast({ title: e instanceof Error ? e.message : 'Ошибка', variant: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    const token = getToken()
    if (!token) return
    try {
      await api.deleteUser(token, deleteId)
      setUsers((prev) => prev.filter((u) => u.id !== deleteId))
      toast({ title: 'Пользователь удалён', variant: 'success' })
    } catch (e: unknown) {
      toast({ title: e instanceof Error ? e.message : 'Ошибка', variant: 'error' })
    } finally {
      setDeleteId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Пользователи</h1>
          <p className="text-muted-foreground text-sm mt-1">Всего: {users.length}</p>
        </div>
        <Button onClick={openCreate}><Plus className="w-4 h-4" /> Добавить</Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <div key={i} className="h-20 rounded-2xl bg-white/5 animate-pulse" />)}
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((user, i) => (
            <motion.div key={user.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <Card className="glass-card border-white/8 hover:border-white/15 transition-all">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary shrink-0">
                    {user.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{user.name}</span>
                      {user.id === currentUser?.id && (
                        <Badge variant="accent" className="text-xs">Вы</Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">{user.email}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${
                      user.role === 'ADMIN' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-blue-500/10 text-blue-400'
                    }`}>
                      {user.role === 'ADMIN' ? <Shield className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
                      {roleLabels[user.role]}
                    </div>
                    <span className="text-xs text-muted-foreground hidden sm:block">{formatDateShort(user.createdAt)}</span>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(user)}>
                      <Pencil className="w-3.5 h-3.5 text-blue-400" />
                    </Button>
                    <Button
                      variant="ghost" size="icon" className="h-7 w-7"
                      disabled={user.id === currentUser?.id}
                      onClick={() => setDeleteId(user.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-400" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editing ? 'Редактировать пользователя' : 'Новый пользователь'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            {[
              { label: 'Имя', key: 'name', placeholder: 'Иван Иванов' },
              { label: 'Email', key: 'email', placeholder: 'user@easycrm.ru', type: 'email' },
              { label: editing ? 'Новый пароль (оставьте пустым чтобы не менять)' : 'Пароль', key: 'password', placeholder: '••••••••', type: 'password' },
            ].map(({ label, key, placeholder, type }) => (
              <div key={key} className="space-y-1.5">
                <Label>{label}</Label>
                <Input
                  type={type || 'text'}
                  placeholder={placeholder}
                  value={form[key as keyof typeof form]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                />
              </div>
            ))}
            <div className="space-y-1.5">
              <Label>Роль</Label>
              <Select value={form.role} onValueChange={(v) => setForm((f) => ({ ...f, role: v as User['role'] }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Администратор</SelectItem>
                  <SelectItem value="MANAGER">Менеджер</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Отмена</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? 'Сохранение...' : editing ? 'Сохранить' : 'Создать'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Удалить пользователя?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Это действие нельзя отменить.</p>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteId(null)}>Отмена</Button>
            <Button variant="destructive" onClick={handleDelete}>Удалить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
