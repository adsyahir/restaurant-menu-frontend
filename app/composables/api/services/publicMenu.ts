import { publicApi } from '../axios'
import type { Category } from './categories'
import type { MenuItem } from './menuItems'

export interface PublicMenuWorkspace {
  name: string
  slug: string
  emoji: string
  cuisine: string | null
  currency: string
}

export interface PublicMenu {
  workspace: PublicMenuWorkspace
  categories: Category[]
  items: MenuItem[]
}

/** Public customer menu for a restaurant, by workspace slug (QR landing). */
export function bySlug(slug: string): Promise<PublicMenu> {
  return publicApi.get<PublicMenu>(`/menu/${slug}`).then((r) => r.data)
}
