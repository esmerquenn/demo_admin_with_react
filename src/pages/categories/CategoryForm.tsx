import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { ImagePlus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Loading } from '@/components/Loading'
import { useCategories, useCategory, useCreateCategory, useUpdateCategory } from '@/hooks/useCategories'

const categorySchema = z.object({
  name: z.string().min(2, 'Ad minimum 2 simvol olmalıdır'),
  slug: z
    .string()
    .min(2, 'Slug minimum 2 simvol olmalıdır')
    .regex(/^[a-z0-9-]+$/, 'Yalnız kiçik hərf, rəqəm və tire'),
  parent_id: z.number().nullable().optional(),
  image: z.string().nullable().optional(),
  sort_order: z.number().nullable().optional(),
  is_active: z.boolean().optional(),
})

type CategoryFormData = z.infer<typeof categorySchema>

interface CategoryFormProps {
  open: boolean
  onClose: () => void
  editId?: number | null
}

export function CategoryForm({ open, onClose, editId }: CategoryFormProps) {
  const isEdit = editId !== null && editId !== undefined
  const { data: categories } = useCategories()
  const { data: category, isLoading } = useCategory(editId ?? 0)
  const createMutation = useCreateCategory()
  const updateMutation = useUpdateCategory()

  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      slug: '',
      parent_id: null,
      image: null,
      sort_order: null,
      is_active: true,
    },
  })

  useEffect(() => {
    if (isEdit && category) {
      form.reset({
        name: category.name,
        slug: category.slug,
        parent_id: category.parent_id,
        image: category.image,
        sort_order: category.sort_order,
        is_active: category.is_active,
      })
      setImagePreview(category.image)
    } else if (!isEdit && open) {
      form.reset({
        name: '',
        slug: '',
        parent_id: null,
        image: null,
        sort_order: null,
        is_active: true,
      })
      setImagePreview(null)
    }
  }, [isEdit, category, form, open])

  const watchName = form.watch('name')
  useEffect(() => {
    if (!isEdit && watchName) {
      const slug = watchName
        .toLowerCase()
        .replace(/ə/g, 'e')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ç/g, 'c')
        .replace(/ğ/g, 'g')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
      form.setValue('slug', slug)
    }
  }, [watchName, isEdit, form])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        setImagePreview(base64)
        form.setValue('image', base64)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImagePreview(null)
    form.setValue('image', null)
  }

  const onSubmit = (data: CategoryFormData) => {
    const payload = {
      ...data,
      sort_order: data.sort_order ?? 0,
    }

    if (isEdit) {
      updateMutation.mutate(
        { id: editId!, data: payload },
        {
          onSuccess: () => {
            toast.success('Kateqoriya yeniləndi')
            onClose()
          },
          onError: () => toast.error('Xəta baş verdi'),
        }
      )
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          toast.success('Kateqoriya yaradıldı')
          onClose()
        },
        onError: () => toast.error('Xəta baş verdi'),
      })
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending
  const parentOptions = categories?.filter((c) => c.id !== editId) ?? []

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="flex h-full w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-md">
        <SheetHeader className="p-6 pb-0">
          <SheetTitle>
            {isEdit ? 'Kateqoriyanı redaktə et' : 'Yeni kateqoriya'}
          </SheetTitle>
          <SheetDescription>
            {isEdit ? 'Kateqoriya məlumatlarını yeniləyin' : 'Yeni kateqoriya əlavə edin'}
          </SheetDescription>
        </SheetHeader>

        {isEdit && isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Loading />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex min-h-0 flex-1 flex-col">
              <div className="flex-1 space-y-5 overflow-y-auto p-6 pt-4">
              {/* Şəkil */}
              <FormField
                control={form.control}
                name="image"
                render={() => (
                  <FormItem>
                    <FormLabel>Şəkil</FormLabel>
                    <FormControl>
                      <div className="space-y-3">
                        {imagePreview ? (
                          <div className="relative inline-block">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="h-32 w-32 rounded-lg border object-cover"
                            />
                            <button
                              type="button"
                              onClick={removeImage}
                              className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-white hover:bg-destructive/80"
                            >
                              <X className="size-4" />
                            </button>
                          </div>
                        ) : (
                          <label className="flex h-32 w-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition-colors hover:border-muted-foreground/50 hover:bg-muted">
                            <ImagePlus className="size-8 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">Şəkil seç</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Ad */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kateqoriya adı</FormLabel>
                    <FormControl>
                      <Input placeholder="Məsələn: Elektronika" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Slug */}
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL slug</FormLabel>
                    <FormControl>
                      <Input placeholder="elektronika" {...field} />
                    </FormControl>
                    <FormDescription>
                      Avtomatik yaradılır, dəyişə bilərsiniz
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Üst Kateqoriya */}
              <FormField
                control={form.control}
                name="parent_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Üst kateqoriya</FormLabel>
                    <Select
                      value={field.value?.toString() ?? ''}
                      onValueChange={(v) => field.onChange(v ? Number(v) : null)}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Ana kateqoriya olaraq qalsın" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">Ana kateqoriya</SelectItem>
                        {parentOptions.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id.toString()}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Sıra */}
              <FormField
                control={form.control}
                name="sort_order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sıralama nömrəsi</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        value={field.value ?? ''}
                        onChange={(e) => {
                          const val = e.target.value
                          field.onChange(val === '' ? null : Number(val))
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Boş buraxsanız avtomatik sırası olacaq
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Aktiv */}
              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="cursor-pointer">Aktiv status</FormLabel>
                      <FormDescription>
                        Kateqoriya saytda görünsün
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              </div>

              {/* Fixed Buttons */}
              <div className="border-t bg-background p-6">
                <div className="flex gap-3">
                  <Button type="submit" disabled={isPending} size="lg" className="flex-1">
                    {isPending ? 'Gözləyin...' : isEdit ? 'Yadda saxla' : 'Əlavə et'}
                  </Button>
                  <Button type="button" variant="outline" size="lg" onClick={onClose}>
                    Ləğv et
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        )}
      </SheetContent>
    </Sheet>
  )
}
