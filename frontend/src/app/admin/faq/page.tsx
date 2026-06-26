'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Plus, Pencil, Trash2, Eye, EyeOff, ChevronDown } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { api, FAQ } from '@/lib/api'
import { getToken } from '@/lib/auth'
import { toast } from '@/components/ui/toaster'

const empty: Partial<FAQ> = { question: '', answer: '', order: 0, published: true }

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState<Partial<FAQ>>(empty)
  const [editing, setEditing] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)

  const load = useCallback(async () => {
    const token = getToken()
    if (!token) return
    setLoading(true)
    try {
      const res = await api.getAdminFAQ(token)
      setFaqs(res.data)
    } catch {
      toast({ title: 'Ошибка загрузки', variant: 'error' })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const openCreate = () => { setForm(empty); setEditing(null); setOpen(true) }
  const openEdit = (f: FAQ) => { setForm(f); setEditing(f.id); setOpen(true) }

  const handleSave = async () => {
    const token = getToken()
    if (!token) return
    setSaving(true)
    try {
      if (editing) {
        const res = await api.updateFAQ(token, editing, form)
        setFaqs((prev) => prev.map((f) => (f.id === editing ? res.data : f)))
        toast({ title: 'FAQ обновлён', variant: 'success' })
      } else {
        const res = await api.createFAQ(token, form)
        setFaqs((prev) => [...prev, res.data])
        toast({ title: 'FAQ создан', variant: 'success' })
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
      await api.deleteFAQ(token, deleteId)
      setFaqs((prev) => prev.filter((f) => f.id !== deleteId))
      toast({ title: 'FAQ удалён', variant: 'success' })
    } catch {
      toast({ title: 'Ошибка удаления', variant: 'error' })
    } finally {
      setDeleteId(null)
    }
  }

  const togglePublished = async (faq: FAQ) => {
    const token = getToken()
    if (!token) return
    try {
      const res = await api.updateFAQ(token, faq.id, { published: !faq.published })
      setFaqs((prev) => prev.map((x) => (x.id === faq.id ? res.data : x)))
    } catch { toast({ title: 'Ошибка', variant: 'error' }) }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">FAQ</h1>
          <p className="text-muted-foreground text-sm mt-1">Всего: {faqs.length} вопросов</p>
        </div>
        <Button onClick={openCreate}><Plus className="w-4 h-4" /> Добавить</Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => <div key={i} className="h-14 rounded-2xl bg-white/5 animate-pulse" />)}
        </div>
      ) : (
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <motion.div key={faq.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Card className={`glass-card border-white/8 hover:border-white/15 transition-all ${!faq.published ? 'opacity-60' : ''}`}>
                <CardContent className="p-0">
                  <div
                    className="flex items-center gap-3 p-4 cursor-pointer"
                    onClick={() => setExpanded(expanded === faq.id ? null : faq.id)}
                  >
                    <span className="w-6 h-6 rounded-md bg-primary/20 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                      {faq.order || i + 1}
                    </span>
                    <span className="flex-1 text-sm font-medium">{faq.question}</span>
                    <div className="flex gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => togglePublished(faq)}>
                        {faq.published ? <Eye className="w-3.5 h-3.5 text-green-400" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(faq)}>
                        <Pencil className="w-3.5 h-3.5 text-blue-400" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setDeleteId(faq.id)}>
                        <Trash2 className="w-3.5 h-3.5 text-red-400" />
                      </Button>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${expanded === faq.id ? 'rotate-180' : ''}`} />
                  </div>
                  {expanded === faq.id && (
                    <div className="px-4 pb-4 pt-0">
                      <div className="text-sm text-muted-foreground border-t border-white/8 pt-3">{faq.answer}</div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing ? 'Редактировать FAQ' : 'Новый FAQ'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Вопрос</Label>
              <Input placeholder="Сколько стоит разработка сайта?" value={form.question || ''} onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Ответ</Label>
              <Textarea placeholder="Подробный ответ..." value={form.answer || ''} onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Порядок</Label>
              <Input type="number" value={form.order || 0} onChange={(e) => setForm((f) => ({ ...f, order: Number(e.target.value) }))} />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="pub-faq" checked={form.published ?? true} onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))} className="accent-primary" />
              <Label htmlFor="pub-faq">Опубликован</Label>
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
          <DialogHeader><DialogTitle>Удалить вопрос?</DialogTitle></DialogHeader>
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
