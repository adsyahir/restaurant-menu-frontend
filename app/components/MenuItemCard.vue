<template>
  <Card class="group relative flex flex-col overflow-hidden pt-0">
    <div class="relative aspect-[4/3] overflow-hidden bg-muted">
      <!-- Placeholder food image: gradient + emoji, since we have no real assets -->
      <div
        class="flex size-full items-center justify-center bg-gradient-to-br from-amber-100 to-orange-200 text-5xl dark:from-amber-950 dark:to-orange-900"
      >
        {{ emoji }}
      </div>
      <div
        v-if="!item.isAvailable"
        class="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-[2px]"
      >
        <Badge variant="destructive" class="text-sm">Sold Out</Badge>
      </div>
    </div>

    <CardHeader class="gap-1">
      <div class="flex items-start justify-between gap-2">
        <CardTitle class="text-base leading-tight">{{ item.name }}</CardTitle>
        <span class="shrink-0 font-bold text-primary">{{ rm(item.basePrice) }}</span>
      </div>
      <CardDescription class="line-clamp-2">{{ item.description }}</CardDescription>
    </CardHeader>

    <CardContent class="mt-auto flex flex-col gap-3">
      <DietaryTags :tags="item.dietaryTags" />
      <Button class="w-full" :disabled="!item.isAvailable" variant="secondary">
        <Plus class="size-4" />
        {{ item.isAvailable ? 'Add to Order' : 'Unavailable' }}
      </Button>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Plus } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { MenuItem } from '@/composables/api/services/menuItems'
import { rm } from '@/lib/format'

const props = defineProps<{ item: MenuItem }>()

// A tiny bit of visual delight in lieu of real photography. Keyed loosely on
// the category name/id; falls back to a generic plate.
const emojiMap: Record<string, string> = {
  rice: '🍚',
  main: '🍛',
  snack: '🥟',
  sweet: '🍧',
  drink: '🧋',
}
const emoji = computed(
  () => emojiMap[String(props.item.categoryId)] ?? '🍽️',
)
</script>
