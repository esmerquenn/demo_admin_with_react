export interface Category {
  id: number
  parent_id: number | null
  name: string
  slug: string
  image: string | null
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CategoryCreate {
  parent_id?: number | null
  name: string
  slug: string
  image?: string | null
  sort_order?: number
  is_active?: boolean
}

export interface CategoryUpdate extends Partial<CategoryCreate> {}
