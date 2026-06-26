'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Plus, Pencil, Trash2, Eye, EyeOff, Star } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { api, Review } from '@/lib/api'
import { getToken } from '@/lib/auth'
import { toast } from '@/components/ui/toaster'
import { formatDateShort } from '@/lib/utils'

const empty: Partial<Review> = { author: '', company: '', rating: 5, text: '', avatar: '', published: true }

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState<Partial<Review>>(empty)
  const [editing, setEditing] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    const token = getToken()
    if (!token) return
    setLoading(true)
    try {
      const res = await api.getAdminReviews(token)
      setReviews(res.data)
    } catch {
      toast({ title: 'Ошибка загрузки', variant: 'error' })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const openCreate = () => { setForm(empty); setEditing(null); setOpen(true) }
  const openEdit = (r: Review) => { setForm(r); setEditing(r.id); setOpen(true) }

  const handleSave = async () => {
    const token = getToken()
    if (!token) return
    setSaving(true)
    try {
      if (editing) {
        const res = await api.updateReview(token, editing, form)
        setReviews((prev) => prev.map((r) => (r.id === editing ? res.data : r)))
        toast({ title: 'Отзыв обновлён', variant: 'success' })
      } else {
        const res = await api.createReview(token, form)
        setReviews((prev) => [res.data, ...prev])
        toast({ title: 'Отзыв создан', variant: 'success' })
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
      await api.deleteReview(token, deleteId)
      setReviews((prev) => prev.filter((r) => r.id !== deleteId))
      toast({ title: 'Отзыв удалён', variant: 'success' })
    } catch {
      toast({ title: 'Ошибка удаления', variant: 'error' })
    } finally {
      setDeleteId(null)
    }
  }

  const togglePublished = async (r: Review) => {
    const token = getToken()
    if (!token) return
    try {
      const res = await api.updateReview(token, r.id, { published: !r.published })
      setReviews((prev) => prev.map((x) => (x.id === r.id ? res.data : x)))
    } catch { toast({ title: 'Ошибка', variant: 'error' }) }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Отзывы</h1>
          <p className="text-muted-foreground text-sm mt-1">Всего: {reviews.length}</p>
        </div>
        <Button onClick={openCreate}><Plus className="w-4 h-4" /> Добавить</Button>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="h-40 rounded-2xl bg-white/5 animate-pulse" />)}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reviews.map((review, i) => (
            <motion.div key={review.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className={`glass-card border-white/8 ${!review.published ? 'opacity-60' : ''}`}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                        {review.author[0]}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{review.author}</div>
                        <div className="text-xs text-muted-foreground">{review.company}</div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => togglePublished(review)}>
                        {review.published ? <Eye className="w-3.5 h-3.5 text-green-400" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(review)}>
                        <Pencil className="w-3.5 h-3.5 text-blue-400" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setDeleteId(review.id)}>
                        <Trash2 className="w-3.5 h-3.5 text-red-400" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className={`w-3.5 h-3.5 ${j < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-3">{review.text}</p>
                  <div className="text-xs text-muted-foreground/50">{formatDateShort(review.createdAt)}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing ? 'Редактировать отзыв' : 'Новый отзыв'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            {[
              { label: 'Имя автора', key: 'author', placeholder: 'Александр Петров' },
              { label: 'Компания', key: 'company', placeholder: 'ООО Ромашка' },
              { label: 'Аватар (URL)', key: 'avatar', placeholder: '/images/avatar.jpg' },
            ].map(({ label, key, placeholder }) => (
              <div key={key} className="space-y-1.5">
                <Label>{label}</Label>
                <Input placeholder={placeholder} value={(form[key as keyof Review] as string) || ''} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} />
              </div>
            ))}
            <div className="space-y-1.5">
              <Label>Рейтинг (1–5)</Label>
              <Input type="number" min={1} max={5} value={form.rating || 5} onChange={(e) => setForm((f) => ({ ...f, rating: Number(e.target.value) }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Текст отзыва</Label>
              <Textarea placeholder="Отличная команда..." value={form.text || ''} onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))} />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="pub-r" checked={form.published ?? true} onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))} className="accent-primary" />
              <Label htmlFor="pub-r">Опубликован</Label>
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
          <DialogHeader><DialogTitle>Удалить отзыв?</DialogTitle></DialogHeader>
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
