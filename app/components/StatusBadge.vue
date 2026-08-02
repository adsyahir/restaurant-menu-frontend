<template>
  <Badge :class="cn('border font-medium capitalize', classes)" variant="outline">
    <span :class="cn('mr-1.5 size-1.5 rounded-full', dotClass)" />
    {{ statusLabels[status] }}
  </Badge>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { OrderStatus } from '@/data/types'
import { statusLabels } from '@/data/orders'

const props = defineProps<{ status: OrderStatus }>()

const styleMap: Record<OrderStatus, { badge: string; dot: string }> = {
  placed: { badge: 'border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300', dot: 'bg-blue-500' },
  preparing: { badge: 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300', dot: 'bg-amber-500' },
  ready: { badge: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300', dot: 'bg-emerald-500' },
  served: { badge: 'border-violet-500/30 bg-violet-500/10 text-violet-700 dark:text-violet-300', dot: 'bg-violet-500' },
  paid: { badge: 'border-neutral-400/30 bg-neutral-500/10 text-neutral-600 dark:text-neutral-300', dot: 'bg-neutral-500' },
  cancelled: { badge: 'border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300', dot: 'bg-red-500' },
}

const classes = computed(() => styleMap[props.status].badge)
const dotClass = computed(() => styleMap[props.status].dot)
</script>
