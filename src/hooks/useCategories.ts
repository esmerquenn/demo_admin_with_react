import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Category, CategoryCreate, CategoryUpdate } from '@/types/category'

const KEY = ['categories']

// Mock data - backend hazır olanda silinəcək
const mockCategories: Category[] = [
  {
    id: 1,
    parent_id: null,
    name: 'Elektronika',
    slug: 'elektronika',
    image: null,
    sort_order: 1,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    parent_id: 1,
    name: 'Telefonlar',
    slug: 'telefonlar',
    image: null,
    sort_order: 2,
    is_active: true,
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
  },
  {
    id: 3,
    parent_id: null,
    name: 'Geyim',
    slug: 'geyim',
    image: null,
    sort_order: 3,
    is_active: false,
    created_at: '2024-01-03T00:00:00Z',
    updated_at: '2024-01-03T00:00:00Z',
  },
]

// Backend hazır olanda bunu aktivləşdir:
// const fetchCategories = () => api.get<Category[]>('/categories').then((r) => r.data)

export const useCategories = () =>
  useQuery({
    queryKey: KEY,
    // Backend hazır olanda dəyiş: queryFn: fetchCategories
    queryFn: () => Promise.resolve(mockCategories),
  })

export const useCategory = (id: number) =>
  useQuery({
    queryKey: [...KEY, id],
    // Backend: queryFn: () => api.get<Category>(`/categories/${id}`).then((r) => r.data)
    queryFn: () => Promise.resolve(mockCategories.find((c) => c.id === id)),
    enabled: !!id,
  })

export const useCreateCategory = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CategoryCreate) =>
      api.post<Category>('/categories', data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}

export const useUpdateCategory = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CategoryUpdate }) =>
      api.put<Category>(`/categories/${id}`, data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}

export const useDeleteCategory = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.delete(`/categories/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}
