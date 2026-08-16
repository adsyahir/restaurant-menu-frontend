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

    <p v-if="error" class="py-10 text-center text-sm text-destructive">{{ error }}</p>
    <p v-else-if="loading" class="py-10 text-center text-muted-foreground">Loading…</p>

    <div v-else-if="queue.length" class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
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
import { computed, onMounted, ref } from 'vue'
import { toast } from 'vue-sonner'
import { statusFlow, statusLabels } from '@/data/orders'
import { api } from '@/composables/api'
import type { Order } from '@/composables/api/services/orders'

const list = ref<Order[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    list.value = await api.orders.list()
  } catch {
    error.value = 'Failed to load'
  } finally {
    loading.value = false
  }
})

/** Minutes an order has been waiting, from its real placedAt to now. */
function waitMinutes(placedAt: string | null): number {
  if (!placedAt) return 0
  return Math.max(0, Math.round((Date.now() - new Date(placedAt).getTime()) / 60000))
}

// Kitchen only cares about placed/preparing, sorted oldest-first (US-3.5).
const queue = computed(() =>
  list.value
    .filter((o) => o.status === 'placed' || o.status === 'preparing')
    .sort((a, b) => waitMinutes(b.placedAt) - waitMinutes(a.placedAt)),
)

async function advance(id: number | string) {
  const order = list.value.find((o) => o.id === Number(id))
  if (!order) return
  const i = statusFlow.indexOf(order.status)
  const next = statusFlow[i + 1]
  if (!next) return
  try {
    const updated = await api.orders.update(order.id, { status: next })
    Object.assign(order, updated)
    toast.success(`${order.tableLabel} → ${statusLabels[next]}`)
  } catch {
    toast.error('Could not update the order status.')
  }
}
</script>
