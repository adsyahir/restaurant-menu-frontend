<template>
  <div class="flex flex-wrap gap-1.5">
    <Badge
      v-for="tag in tags"
      :key="tag"
      variant="secondary"
      :class="cn('gap-1 text-xs font-normal', tagClass(tag))"
    >
      <component :is="iconFor(tag)" class="size-3" />
      {{ labelFor(tag) }}
    </Badge>
  </div>
</template>

<script setup lang="ts">
import { Flame, Leaf, Sprout, Nut, Fish, BadgeCheck, Tag } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { dietaryTagLabels } from '@/data/menu'

// Tags come from the API as free-form strings; unknown values still render.
defineProps<{ tags: string[] }>()

const icons: Record<string, unknown> = {
  halal: BadgeCheck,
  vegetarian: Leaf,
  vegan: Sprout,
  spicy: Flame,
  'contains-nuts': Nut,
  seafood: Fish,
}

const colors: Record<string, string> = {
  halal: 'text-emerald-700 dark:text-emerald-300',
  vegetarian: 'text-green-700 dark:text-green-300',
  vegan: 'text-lime-700 dark:text-lime-300',
  spicy: 'text-red-700 dark:text-red-300',
  'contains-nuts': 'text-amber-700 dark:text-amber-300',
  seafood: 'text-sky-700 dark:text-sky-300',
}

function iconFor(tag: string) {
  return icons[tag] ?? Tag
}
function tagClass(tag: string) {
  return colors[tag] ?? 'text-muted-foreground'
}
function labelFor(tag: string) {
  return (dietaryTagLabels as Record<string, string>)[tag] ?? tag
}
</script>
