<template>
  <Card
    :class="cn('overflow-hidden border-l-4 transition-shadow hover:shadow-md', bandClass)"
  >
    <CardHeader class="gap-1 pb-3">
      <div class="flex items-center justify-between">
        <CardTitle class="text-base font-bold">
          {{ order.tableLabel }}
        </CardTitle>
        <StatusBadge :status="order.status" />
      </div>
      <div class="flex items-center justify-between text-xs text-muted-foreground">
        <span>{{ order.orderNumber }}</span>
        <span :class="cn('flex items-center gap-1 font-medium', waitTextClass)">
          <Clock class="size-3.5" />
          {{ wait }} min
        </span>
      </div>
    </CardHeader>
    <CardContent class="space-y-2 pb-3">
      <ul class="space-y-2">
        <li v-for="item in order.items" :key="item.id" class="text-sm">
          <div class="flex items-start justify-between gap-2">
            <span class="font-medium">
              <span class="text-primary">{{ item.quantity }}×</span>
              {{ item.name }}
            </span>
          </div>
          <p v-if="item.variantLabel" class="pl-5 text-xs text-muted-foreground">
            {{ item.variantLabel }}
          </p>
          <p
            v-if="item.notes"
            class="mt-0.5 ml-5 inline-block rounded bg-amber-500/15 px-1.5 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-300"
          >
            ⚠ {{ item.notes }}
          </p>
        </li>
      </ul>
    </CardContent>
    <CardFooter class="gap-2 border-t bg-muted/30 pt-3">
      <Button
        v-if="nextLabel"
        size="sm"
        class="flex-1"
        @click="$emit('advance', order.id)"
      >
        {{ nextLabel }}
      </Button>
      <Button v-else size="sm" variant="outline" class="flex-1" disabled>
        Done
      </Button>
    </CardFooter>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Clock } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { Order } from '@/data/types'
import { waitMinutes } from '@/data/orders'

const props = defineProps<{ order: Order }>()
defineEmits<{ advance: [id: string] }>()

const wait = computed(() => waitMinutes(props.order.placedAt))

// Wait-time colour band: green < 10 min, amber 10–20, red > 20.
const bandClass = computed(() => {
  if (wait.value > 20) return 'border-l-red-500'
  if (wait.value >= 10) return 'border-l-amber-500'
  return 'border-l-emerald-500'
})
const waitTextClass = computed(() => {
  if (wait.value > 20) return 'text-red-600 dark:text-red-400'
  if (wait.value >= 10) return 'text-amber-600 dark:text-amber-400'
  return 'text-emerald-600 dark:text-emerald-400'
})

const nextLabel = computed(() => {
  if (props.order.status === 'placed') return 'Start Preparing'
  if (props.order.status === 'preparing') return 'Mark Ready'
  return ''
})
</script>
