'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { api, Project } from '@/lib/api'
import { getToken } from '@/lib/auth'
import { toast } from '@/components/ui/toaster'

const empty: Partial<Project> = {
  title: '', description: '', image: '', category: '', link: '',
  stack: [], result: '', order: 0, published: true,
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState<Partial<Project>>(empty)
  const [editing, setEditing] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [stackInput, setStackInput] = useState('')

  const load = useCallback(async () => {
    const token = getToken()
    if (!token) return
    setLoading(true)
    try {
      const res = await api.getAdminProjects(token)
      setProjects(res.data)
    } catch {
      toast({ title: 'Ошибка загрузки', variant: 'error' })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const openCreate = () => {
    setForm(empty)
    setStackInput('')
    setEditing(null)
    setOpen(true)
  }

  const openEdit = (p: Project) => {
    setForm(p)
    setStackInput(p.stack.join(', '))
    setEditing(p.id)
    setOpen(true)
  }

  const handleSave = async () => {
    const token = getToken()
    if (!token) return
    setSaving(true)
    try {
      const data = { ...form, stack: stackInput.split(',').map((s) => s.trim()).filter(Boolean) }
      if (editing) {
        const res = await api.updateProject(token, editing, data)
        setProjects((prev) => prev.map((p) => (p.id === editing ? res.data : p)))
        toast({ title: 'Проект обновлён', variant: 'success' })
      } else {
        const res = await api.createProject(token, data)
        setProjects((prev) => [res.data, ...prev])
        toast({ title: 'Проект создан', variant: 'success' })
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
      await api.deleteProject(token, deleteId)
      setProjects((prev) => prev.filter((p) => p.id !== deleteId))
      toast({ title: 'Проект удалён', variant: 'success' })
    } catch {
      toast({ title: 'Ошибка удаления', variant: 'error' })
    } finally {
      setDeleteId(null)
    }
  }

  const togglePublished = async (p: Project) => {
    const token = getToken()
    if (!token) return
    try {
      const res = await api.updateProject(token, p.id, { published: !p.published })
      setProjects((prev) => prev.map((x) => (x.id === p.id ? res.data : x)))
    } catch {
      toast({ title: 'Ошибка', variant: 'error' })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Проекты</h1>
          <p className="text-muted-foreground text-sm mt-1">Всего: {projects.length}</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4" /> Добавить
        </Button>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="h-48 rounded-2xl bg-white/5 animate-pulse" />)}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project, i) => (
            <motion.div key={project.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className={`glass-card border-white/8 hover:border-white/15 transition-all ${!project.published ? 'opacity-60' : ''}`}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-semibold text-sm line-clamp-1">{project.title}</div>
                      <Badge variant="secondary" className="mt-1 text-xs">{project.category}</Badge>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => togglePublished(project)}>
                        {project.published ? <Eye className="w-3.5 h-3.5 text-green-400" /> : <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />}
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(project)}>
                        <Pencil className="w-3.5 h-3.5 text-blue-400" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setDeleteId(project.id)}>
                        <Trash2 className="w-3.5 h-3.5 text-red-400" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{project.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {project.stack.slice(0, 3).map((s) => (
                      <span key={s} className="text-xs px-2 py-0.5 rounded-md bg-primary/10 text-primary">{s}</span>
                    ))}
                    {project.stack.length > 3 && <span className="text-xs text-muted-foreground">+{project.stack.length - 3}</span>}
                  </div>
                  {project.result && (
                    <div className="text-xs text-green-400 border-t border-white/8 pt-2">📈 {project.result}</div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Form dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'Редактировать проект' : 'Новый проект'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {[
              { label: 'Название', key: 'title', placeholder: 'МегаСтрой — Корпоративный сайт' },
              { label: 'Категория', key: 'category', placeholder: 'Корпоративный сайт' },
              { label: 'Изображение (URL)', key: 'image', placeholder: '/images/project-1.jpg' },
              { label: 'Ссылка на проект', key: 'link', placeholder: 'https://example.com' },
              { label: 'Результат', key: 'result', placeholder: 'Рост заявок на 340%' },
            ].map(({ label, key, placeholder }) => (
              <div key={key} className="space-y-1.5">
                <Label>{label}</Label>
                <Input
                  placeholder={placeholder}
                  value={(form[key as keyof Project] as string) || ''}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                />
              </div>
            ))}
            <div className="space-y-1.5">
              <Label>Описание</Label>
              <Textarea
                placeholder="Описание проекта..."
                value={form.description || ''}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Стек (через запятую)</Label>
              <Input
                placeholder="Bitrix, 1C, CRM"
                value={stackInput}
                onChange={(e) => setStackInput(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="published"
                checked={form.published ?? true}
                onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
                className="accent-primary"
              />
              <Label htmlFor="published">Опубликован</Label>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Отмена</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Сохранение...' : editing ? 'Сохранить' : 'Создать'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete dialog */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Удалить проект?</DialogTitle></DialogHeader>
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
