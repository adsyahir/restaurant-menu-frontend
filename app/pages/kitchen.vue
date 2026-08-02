<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">Kitchen Display</h1>
        <p class="text-sm text-muted-foreground">
          Live queue, sorted by wait time. Oldest orders first.
        </p>
      </div>
      <div class="flex items-center gap-4 text-xs">
        <span class="flex items-center gap-1.5"><span class="size-2.5 rounded-full bg-emerald-500" /> &lt; 10 min</span>
        <span class="flex items-center gap-1.5"><span class="size-2.5 rounded-full bg-amber-500" /> 10–20 min</span>
        <span class="flex items-center gap-1.5"><span class="size-2.5 rounded-full bg-red-500" /> &gt; 20 min</span>
      </div>
    </div>

    <div v-if="queue.length" class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      <KitchenTicket
        v-for="order in queue"
        :key="order.id"
        :order="order"
        @advance="advance"
      />
    </div>
    <div v-else class="py-20 text-center text-muted-foreground">
      🎉 All caught up — no active orders in the kitchen.
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { toast } from 'vue-sonner'
import { orders as seedOrders, waitMinutes } from '@/data/orders'
import { statusFlow, statusLabels } from '@/data/orders'
import type { Order } from '@/data/types'

// Local copy so status advances feel live in the demo.
const list = ref<Order[]>(seedOrders.map((o) => ({ ...o })))

// Kitchen only cares about placed/preparing, sorted oldest-first (US-3.5).
const queue = computed(() =>
  list.value
    .filter((o) => o.status === 'placed' || o.status === 'preparing')
    .sort((a, b) => waitMinutes(b.placedAt) - waitMinutes(a.placedAt)),
)

function advance(id: string) {
  const order = list.value.find((o) => o.id === id)
  if (!order) return
  const i = statusFlow.indexOf(order.status)
  const next = statusFlow[i + 1]
  if (next) {
    order.status = next
    toast.success(`${order.tableLabel} → ${statusLabels[next]}`)
  }
}
</script>
