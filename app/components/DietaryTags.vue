<template>
  <div class="flex flex-wrap gap-1.5">
    <Badge
      v-for="tag in tags"
      :key="tag"
      variant="secondary"
      :class="cn('gap-1 text-xs font-normal', tagClass(tag))"
    >
      <component :is="iconFor(tag)" class="size-3" />
      {{ dietaryTagLabels[tag] }}
    </Badge>
  </div>
</template>

<script setup lang="ts">
import { Flame, Leaf, Sprout, Nut, Fish, BadgeCheck } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { DietaryTag } from '@/data/types'
import { dietaryTagLabels } from '@/data/menu'

defineProps<{ tags: DietaryTag[] }>()

const icons: Record<DietaryTag, unknown> = {
  halal: BadgeCheck,
  vegetarian: Leaf,
  vegan: Sprout,
  spicy: Flame,
  'contains-nuts': Nut,
  seafood: Fish,
}

const colors: Record<DietaryTag, string> = {
  halal: 'text-emerald-700 dark:text-emerald-300',
  vegetarian: 'text-green-700 dark:text-green-300',
  vegan: 'text-lime-700 dark:text-lime-300',
  spicy: 'text-red-700 dark:text-red-300',
  'contains-nuts': 'text-amber-700 dark:text-amber-300',
  seafood: 'text-sky-700 dark:text-sky-300',
}

function iconFor(tag: DietaryTag) {
  return icons[tag]
}
function tagClass(tag: DietaryTag) {
  return colors[tag]
}
</script>
