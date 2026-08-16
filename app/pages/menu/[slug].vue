<template>
  <div class="space-y-6">
    <div class="space-y-1 text-center">
      <div class="text-4xl">{{ workspace?.emoji ?? '🍜' }}</div>
      <h1 class="text-3xl font-bold tracking-tight">{{ workspace?.name ?? 'Our Menu' }}</h1>
      <p class="text-muted-foreground">
        {{ workspace?.cuisine ? `${workspace.cuisine} · ` : '' }}Freshly made to order.
      </p>
    </div>

    <p v-if="error" class="py-16 text-center text-sm text-destructive">{{ error }}</p>
    <p v-else-if="loading" class="py-16 text-center text-muted-foreground">Loading…</p>

    <template v-else>
      <!-- Search + filters -->
      <div class="space-y-3">
        <div class="relative mx-auto max-w-xl">
          <Search class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input v-model="search" placeholder="Search dishes… (e.g. nasi lemak)" class="pl-9" />
        </div>

        <div class="flex flex-wrap items-center justify-center gap-2">
          <Button
            v-for="c in categoryFilters"
            :key="c.value"
            size="sm"
            :variant="category === c.value ? 'default' : 'outline'"
            @click="category = c.value"
          >
            {{ c.label }}
          </Button>
        </div>

        <div class="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          <div class="flex flex-wrap items-center gap-2">
            <span class="text-xs font-medium text-muted-foreground">Dietary:</span>
            <Badge
              v-for="(label, tag) in dietaryTagLabels"
              :key="tag"
              :variant="activeTags.has(tag) ? 'default' : 'outline'"
              class="cursor-pointer select-none"
              @click="toggleTag(tag)"
            >
              {{ label }}
            </Badge>
          </div>
          <Separator orientation="vertical" class="hidden !h-5 sm:block" />
          <div class="flex items-center gap-2">
            <span class="text-xs font-medium text-muted-foreground">Max price:</span>
            <Select v-model="maxPrice">
              <SelectTrigger class="h-8 w-32 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="999">Any price</SelectItem>
                <SelectItem value="10">Under RM10</SelectItem>
                <SelectItem value="15">Under RM15</SelectItem>
                <SelectItem value="20">Under RM20</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <p class="text-center text-sm text-muted-foreground">
        {{ results.length }} {{ results.length === 1 ? 'dish' : 'dishes' }}
      </p>

      <!-- Grid -->
      <div v-if="results.length" class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <MenuItemCard v-for="item in results" :key="item.id" :item="item" />
      </div>
      <div v-else class="py-16 text-center text-muted-foreground">
        No dishes match your filters. Try clearing some.
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Search } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { dietaryTagLabels } from '@/data/menu'
import type { DietaryTag } from '@/data/types'
import { api } from '@/composables/api'
import type { Category } from '@/composables/api/services/categories'
import type { MenuItem } from '@/composables/api/services/menuItems'
import type { PublicMenuWorkspace } from '@/composables/api/services/publicMenu'

definePageMeta({ layout: 'public' })

const route = useRoute()

const search = ref('')
const category = ref<number | 'all'>('all')
const activeTags = ref<Set<DietaryTag>>(new Set())
const maxPrice = ref('999')

const workspace = ref<PublicMenuWorkspace | null>(null)
const categories = ref<Category[]>([])
const menuItems = ref<MenuItem[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    const menu = await api.publicMenu.bySlug(String(route.params.slug))
    workspace.value = menu.workspace
    categories.value = menu.categories
    menuItems.value = menu.items
  } catch {
    error.value = 'This menu could not be found. Check the link or scan the QR code again.'
  } finally {
    loading.value = false
  }
})

const categoryFilters = computed(() => [
  { label: 'All', value: 'all' as const },
  ...categories.value.map((c) => ({ label: c.name, value: c.id })),
])

function toggleTag(tag: DietaryTag) {
  const next = new Set(activeTags.value)
  next.has(tag) ? next.delete(tag) : next.add(tag)
  activeTags.value = next
}

const results = computed(() =>
  menuItems.value.filter((item) => {
    const q = search.value.trim().toLowerCase()
    const matchesSearch =
      !q ||
      item.name.toLowerCase().includes(q) ||
      (item.description ?? '').toLowerCase().includes(q)
    const matchesCat = category.value === 'all' || item.categoryId === category.value
    const matchesTags = [...activeTags.value].every((t) => item.dietaryTags.includes(t))
    const matchesPrice = item.basePrice <= Number(maxPrice.value)
    return matchesSearch && matchesCat && matchesTags && matchesPrice
  }),
)
</script>
