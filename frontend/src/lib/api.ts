const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

interface FetchOptions extends RequestInit {
  token?: string
}

async function fetchAPI<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { token, ...fetchOptions } = options

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(fetchOptions.headers as Record<string, string>),
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Ошибка запроса')
  }

  return data
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    fetchAPI<{ success: boolean; data: { token: string; user: User } }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  me: (token: string) =>
    fetchAPI<{ success: boolean; data: User }>('/api/auth/me', { token }),

  // Public
  getProjects: () => fetchAPI<{ success: boolean; data: Project[] }>('/api/projects'),
  getServices: () => fetchAPI<{ success: boolean; data: Service[] }>('/api/services'),
  getReviews: () => fetchAPI<{ success: boolean; data: Review[] }>('/api/reviews'),
  getFAQ: () => fetchAPI<{ success: boolean; data: FAQ[] }>('/api/faq'),

  createLead: (data: LeadForm) =>
    fetchAPI<{ success: boolean; message: string }>('/api/leads', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Admin
  getStats: (token: string) =>
    fetchAPI<{ success: boolean; data: Stats }>('/api/stats', { token }),

  getLeads: (token: string, params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : ''
    return fetchAPI<{ success: boolean; data: Lead[]; pagination: Pagination }>(`/api/leads${query}`, { token })
  },

  updateLeadStatus: (token: string, id: string, status: string) =>
    fetchAPI<{ success: boolean; data: Lead }>(`/api/leads/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
      token,
    }),

  deleteLead: (token: string, id: string) =>
    fetchAPI<{ success: boolean }>(`/api/leads/${id}`, { method: 'DELETE', token }),

  getAdminProjects: (token: string) =>
    fetchAPI<{ success: boolean; data: Project[] }>('/api/projects/admin', { token }),

  createProject: (token: string, data: Partial<Project>) =>
    fetchAPI<{ success: boolean; data: Project }>('/api/projects', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    }),

  updateProject: (token: string, id: string, data: Partial<Project>) =>
    fetchAPI<{ success: boolean; data: Project }>(`/api/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      token,
    }),

  deleteProject: (token: string, id: string) =>
    fetchAPI<{ success: boolean }>(`/api/projects/${id}`, { method: 'DELETE', token }),

  getAdminServices: (token: string) =>
    fetchAPI<{ success: boolean; data: Service[] }>('/api/services/admin', { token }),

  createService: (token: string, data: Partial<Service>) =>
    fetchAPI<{ success: boolean; data: Service }>('/api/services', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    }),

  updateService: (token: string, id: string, data: Partial<Service>) =>
    fetchAPI<{ success: boolean; data: Service }>(`/api/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      token,
    }),

  deleteService: (token: string, id: string) =>
    fetchAPI<{ success: boolean }>(`/api/services/${id}`, { method: 'DELETE', token }),

  getAdminReviews: (token: string) =>
    fetchAPI<{ success: boolean; data: Review[] }>('/api/reviews/admin', { token }),

  createReview: (token: string, data: Partial<Review>) =>
    fetchAPI<{ success: boolean; data: Review }>('/api/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    }),

  updateReview: (token: string, id: string, data: Partial<Review>) =>
    fetchAPI<{ success: boolean; data: Review }>(`/api/reviews/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      token,
    }),

  deleteReview: (token: string, id: string) =>
    fetchAPI<{ success: boolean }>(`/api/reviews/${id}`, { method: 'DELETE', token }),

  getAdminFAQ: (token: string) =>
    fetchAPI<{ success: boolean; data: FAQ[] }>('/api/faq/admin', { token }),

  createFAQ: (token: string, data: Partial<FAQ>) =>
    fetchAPI<{ success: boolean; data: FAQ }>('/api/faq', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    }),

  updateFAQ: (token: string, id: string, data: Partial<FAQ>) =>
    fetchAPI<{ success: boolean; data: FAQ }>(`/api/faq/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      token,
    }),

  deleteFAQ: (token: string, id: string) =>
    fetchAPI<{ success: boolean }>(`/api/faq/${id}`, { method: 'DELETE', token }),

  getUsers: (token: string) =>
    fetchAPI<{ success: boolean; data: User[] }>('/api/users', { token }),

  createUser: (token: string, data: Partial<User> & { password?: string }) =>
    fetchAPI<{ success: boolean; data: User }>('/api/users', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    }),

  updateUser: (token: string, id: string, data: Partial<User> & { password?: string }) =>
    fetchAPI<{ success: boolean; data: User }>(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      token,
    }),

  deleteUser: (token: string, id: string) =>
    fetchAPI<{ success: boolean }>(`/api/users/${id}`, { method: 'DELETE', token }),
}

// Types
export interface User {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'MANAGER'
  createdAt: string
}

export interface Lead {
  id: string
  name: string
  phone: string
  email?: string
  company?: string
  message?: string
  status: 'NEW' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED'
  createdAt: string
}

export interface LeadForm {
  name: string
  phone: string
  email?: string
  company?: string
  message?: string
}

export interface Project {
  id: string
  title: string
  description: string
  image: string
  category: string
  link?: string
  stack: string[]
  result?: string
  order: number
  published: boolean
  createdAt: string
}

export interface Service {
  id: string
  title: string
  description: string
  icon: string
  price?: string
  order: number
  published: boolean
}

export interface Review {
  id: string
  author: string
  company: string
  rating: number
  text: string
  avatar?: string
  published: boolean
  createdAt: string
}

export interface FAQ {
  id: string
  question: string
  answer: string
  order: number
  published: boolean
}

export interface Stats {
  totalLeads: number
  newLeads: number
  totalProjects: number
  totalUsers: number
  recentLeads: Lead[]
  leadsByStatus: { status: string; count: number }[]
  leadsByMonth: { month: string; count: number }[]
}

export interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
}
