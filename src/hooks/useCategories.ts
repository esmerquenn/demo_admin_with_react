import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Category, CategoryCreate, CategoryUpdate } from '@/types/category'

const KEY = ['categories']

export const useCategories = () =>
  useQuery({
    queryKey: KEY,
    queryFn: () => api.get<Category[]>('/categories').then((r) => r.data),
  })

export const useCategory = (id: number) =>
  useQuery({
    queryKey: [...KEY, id],
    queryFn: () => api.get<Category>(`/categories/${id}`).then((r) => r.data),
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
