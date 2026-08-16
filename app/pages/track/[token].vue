<template>
  <div class="mx-auto max-w-lg space-y-6">
    <div v-if="order" class="space-y-6">
      <!-- Header -->
      <Card class="overflow-hidden">
        <div class="bg-gradient-to-br from-amber-500 to-orange-600 p-6 text-white">
          <p class="text-sm text-white/80">Order</p>
          <h1 class="text-2xl font-bold">{{ order.orderNumber }}</h1>
          <p class="mt-1 text-sm text-white/80">Table {{ order.tableLabel }}</p>
        </div>
        <CardContent class="space-y-1 py-5 text-center">
          <p class="text-sm text-muted-foreground">Current status</p>
          <div class="flex items-center justify-center gap-2">
            <span class="text-xl font-bold">{{ statusLabels[order.status] }}</span>
          </div>
          <p class="text-sm text-muted-foreground">{{ etaCopy }}</p>
        </CardContent>
      </Card>

      <!-- Progress -->
      <Card>
        <CardHeader><CardTitle class="text-base">Progress</CardTitle></CardHeader>
        <CardContent>
          <StatusTimeline :status="order.status" vertical />
        </CardContent>
      </Card>

      <!-- Items (customer-safe: no internal staff notes) -->
      <Card>
        <CardHeader><CardTitle class="text-base">Your order</CardTitle></CardHeader>
        <CardContent class="space-y-3">
          <div
            v-for="(item, i) in order.items"
            :key="i"
            class="flex items-center justify-between border-b pb-3 text-sm last:border-0 last:pb-0"
          >
            <div class="flex gap-2">
              <span class="font-semibold text-primary">{{ item.quantity }}×</span>
              <div>
                <p class="font-medium">{{ item.name }}</p>
                <p v-if="item.variantLabel" class="text-xs text-muted-foreground">{{ item.variantLabel }}</p>
              </div>
            </div>
          </div>
          <div class="flex justify-between pt-1 text-base font-bold">
            <span>Total</span><span>{{ rm(order.total) }}</span>
          </div>
        </CardContent>
      </Card>

      <p class="text-center text-xs text-muted-foreground">
        This page updates live — no need to refresh. Show it to staff if you need help.
      </p>
    </div>

    <Card v-else>
      <CardContent class="py-16 text-center">
        <p class="text-lg font-medium">Order not found</p>
        <p class="mt-1 text-sm text-muted-foreground">
          Check the link or scan the QR code on your table again.
        </p>
        <Button as-child class="mt-4"><NuxtLink to="/menu">Browse the menu</NuxtLink></Button>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { rm } from '@/lib/format'
import { statusLabels } from '@/data/orders'
import { api } from '@/composables/api'
import type { PublicOrder } from '@/composables/api/services/tracking'

definePageMeta({ layout: 'public' })

const route = useRoute()
const order = ref<PublicOrder | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    order.value = await api.tracking.track(String(route.params.token))
  } catch {
    // 404 / any failure -> show the "order not found" state
    order.value = null
    error.value = 'Failed to load'
  } finally {
    loading.value = false
  }
})

const etaCopy = computed(() => {
  switch (order.value?.status) {
    case 'placed':
      return 'We\'ve received your order — the kitchen will start soon.'
    case 'preparing':
      return 'Your food is being prepared. Roughly 10–15 minutes to go.'
    case 'ready':
      return 'Ready! A server is bringing it to your table now.'
    case 'served':
      return 'Enjoy your meal! 🍽️'
    case 'paid':
      return 'Thanks for dining with us — see you again soon!'
    default:
      return ''
  }
})
</script>
