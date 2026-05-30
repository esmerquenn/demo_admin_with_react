import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/DataTable'
import { PageLoading } from '@/components/Loading'
import { PageError } from '@/components/Error'
import { useCategories, useDeleteCategory } from '@/hooks/useCategories'
import { createColumns } from './columns'
import { CategoryForm } from './CategoryForm'

export function Component() {
  const { data: categories, isLoading, isError, refetch } = useCategories()
  const deleteCategory = useDeleteCategory()

  // Sheet state: null = bağlı, undefined = yeni, number = redaktə
  const [editId, setEditId] = useState<number | null | undefined>(null)
  const isSheetOpen = editId !== null

  const columns = useMemo(
    () =>
      createColumns(
        (id) => deleteCategory.mutate(id),
        (id) => setEditId(id) // Redaktə üçün
      ),
    [deleteCategory]
  )

  if (isLoading) return <PageLoading />
  if (isError) return <PageError onRetry={() => refetch()} />

  return (
    <div>
      {/* Başlıq */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Kateqoriyalar</h1>
          <p className="text-sm text-muted-foreground">
            Bütün kateqoriyaları idarə edin
          </p>
        </div>
        <Button size="lg" onClick={() => setEditId(undefined)}>
          <Plus className="mr-2 size-4" />
          Yeni Kateqoriya
        </Button>
      </div>

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={categories ?? []}
        searchKey="name"
        searchPlaceholder="Kateqoriya axtar..."
      />

      {/* Create/Edit Sheet */}
      <CategoryForm
        open={isSheetOpen}
        onClose={() => setEditId(null)}
        editId={editId === undefined ? null : editId}
      />
    </div>
  )
}
