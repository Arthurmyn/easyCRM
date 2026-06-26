'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Plus, Pencil, Trash2, Eye, EyeOff, GripVertical } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { api, Service } from '@/lib/api'
import { getToken } from '@/lib/auth'
import { toast } from '@/components/ui/toaster'

const empty: Partial<Service> = { title: '', description: '', icon: 'star', price: '', order: 0, published: true }

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState<Partial<Service>>(empty)
  const [editing, setEditing] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    const token = getToken()
    if (!token) return
    setLoading(true)
    try {
      const res = await api.getAdminServices(token)
      setServices(res.data)
    } catch {
      toast({ title: 'Ошибка загрузки', variant: 'error' })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const openCreate = () => { setForm(empty); setEditing(null); setOpen(true) }
  const openEdit = (s: Service) => { setForm(s); setEditing(s.id); setOpen(true) }

  const handleSave = async () => {
    const token = getToken()
    if (!token) return
    setSaving(true)
    try {
      if (editing) {
        const res = await api.updateService(token, editing, form)
        setServices((prev) => prev.map((s) => (s.id === editing ? res.data : s)))
        toast({ title: 'Услуга обновлена', variant: 'success' })
      } else {
        const res = await api.createService(token, form)
        setServices((prev) => [...prev, res.data])
        toast({ title: 'Услуга создана', variant: 'success' })
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
      await api.deleteService(token, deleteId)
      setServices((prev) => prev.filter((s) => s.id !== deleteId))
      toast({ title: 'Услуга удалена', variant: 'success' })
    } catch {
      toast({ title: 'Ошибка удаления', variant: 'error' })
    } finally {
      setDeleteId(null)
    }
  }

  const togglePublished = async (s: Service) => {
    const token = getToken()
    if (!token) return
    try {
      const res = await api.updateService(token, s.id, { published: !s.published })
      setServices((prev) => prev.map((x) => (x.id === s.id ? res.data : x)))
    } catch { toast({ title: 'Ошибка', variant: 'error' }) }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Услуги</h1>
          <p className="text-muted-foreground text-sm mt-1">Всего: {services.length}</p>
        </div>
        <Button onClick={openCreate}><Plus className="w-4 h-4" /> Добавить</Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => <div key={i} className="h-20 rounded-2xl bg-white/5 animate-pulse" />)}
        </div>
      ) : (
        <div className="space-y-3">
          {services.map((service, i) => (
            <motion.div key={service.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
              <Card className={`glass-card border-white/8 hover:border-white/15 transition-all ${!service.published ? 'opacity-60' : ''}`}>
                <CardContent className="p-4 flex items-center gap-4">
                  <GripVertical className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-lg shrink-0">
                    🎯
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{service.title}</div>
                    <div className="text-xs text-muted-foreground truncate mt-0.5">{service.description}</div>
                  </div>
                  {service.price && (
                    <div className="text-sm text-primary font-medium shrink-0 hidden sm:block">{service.price}</div>
                  )}
                  <div className="flex gap-1 shrink-0">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => togglePublished(service)}>
                      {service.published ? <Eye className="w-3.5 h-3.5 text-green-400" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(service)}>
                      <Pencil className="w-3.5 h-3.5 text-blue-400" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setDeleteId(service.id)}>
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
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing ? 'Редактировать услугу' : 'Новая услуга'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            {[
              { label: 'Название', key: 'title', placeholder: 'Корпоративные сайты' },
              { label: 'Иконка (lucide name)', key: 'icon', placeholder: 'building2' },
              { label: 'Цена', key: 'price', placeholder: 'от 80 000 ₽' },
              { label: 'Порядок', key: 'order', placeholder: '1', type: 'number' },
            ].map(({ label, key, placeholder, type }) => (
              <div key={key} className="space-y-1.5">
                <Label>{label}</Label>
                <Input
                  type={type || 'text'}
                  placeholder={placeholder}
                  value={(form[key as keyof Service] as string | number) || ''}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: type === 'number' ? Number(e.target.value) : e.target.value }))}
                />
              </div>
            ))}
            <div className="space-y-1.5">
              <Label>Описание</Label>
              <Textarea
                placeholder="Описание услуги..."
                value={form.description || ''}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="pub" checked={form.published ?? true} onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))} className="accent-primary" />
              <Label htmlFor="pub">Опубликована</Label>
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
          <DialogHeader><DialogTitle>Удалить услугу?</DialogTitle></DialogHeader>
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
