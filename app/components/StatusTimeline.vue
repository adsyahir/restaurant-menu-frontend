<template>
  <ol :class="cn('flex', vertical ? 'flex-col gap-0' : 'items-start justify-between')">
    <li
      v-for="(step, i) in steps"
      :key="step.status"
      :class="cn('relative', vertical ? 'flex gap-4 pb-8 last:pb-0' : 'flex flex-1 flex-col items-center text-center')"
    >
      <!-- connector -->
      <span
        v-if="i < steps.length - 1"
        :class="
          cn(
            'bg-border',
            vertical
              ? 'absolute left-4 top-9 h-full w-0.5 -translate-x-1/2'
              : 'absolute left-1/2 top-4 h-0.5 w-full',
            step.done && 'bg-primary',
          )
        "
      />
      <!-- node -->
      <span
        :class="
          cn(
            'z-10 flex size-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
            step.done
              ? 'border-primary bg-primary text-primary-foreground'
              : step.current
                ? 'border-primary bg-background text-primary'
                : 'border-border bg-background text-muted-foreground',
          )
        "
      >
        <Check v-if="step.done" class="size-4" />
        <component :is="step.icon" v-else class="size-4" />
      </span>
      <div :class="vertical ? 'pt-1' : 'mt-2'">
        <p
          :class="
            cn(
              'text-sm font-medium',
              step.current ? 'text-primary' : step.done ? 'text-foreground' : 'text-muted-foreground',
            )
          "
        >
          {{ statusLabels[step.status] }}
        </p>
        <p v-if="step.current" class="text-xs text-muted-foreground">In progress</p>
      </div>
    </li>
  </ol>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  Check,
  ClipboardList,
  CookingPot,
  BellRing,
  UtensilsCrossed,
  CreditCard,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import type { OrderStatus } from '@/data/types'
import { statusLabels, statusFlow } from '@/data/orders'

const props = defineProps<{
  status: OrderStatus
  vertical?: boolean
}>()

const iconMap: Record<OrderStatus, unknown> = {
  placed: ClipboardList,
  preparing: CookingPot,
  ready: BellRing,
  served: UtensilsCrossed,
  paid: CreditCard,
  cancelled: ClipboardList,
}

const steps = computed(() => {
  const currentIndex = statusFlow.indexOf(
    props.status === 'cancelled' ? 'placed' : props.status,
  )
  return statusFlow.map((status, i) => ({
    status,
    icon: iconMap[status],
    done: i < currentIndex,
    current: i === currentIndex,
  }))
})
</script>
