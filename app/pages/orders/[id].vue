<template>
  <div v-if="order" class="mx-auto max-w-3xl space-y-6">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <Button as-child variant="ghost" size="sm" class="-ml-2 mb-1 text-muted-foreground">
          <NuxtLink to="/orders"><ChevronLeft class="size-4" /> Back to orders</NuxtLink>
        </Button>
        <h1 class="text-2xl font-bold tracking-tight">{{ order.orderNumber }}</h1>
        <p class="text-sm text-muted-foreground">
          {{ order.tableLabel }} · placed {{ time(order.placedAt) }} by {{ order.createdByName }}
        </p>
      </div>
      <div class="flex items-center gap-2">
        <Button
          v-if="order.trackToken"
          variant="outline"
          size="sm"
          @click="shareTrackingLink"
        >
          <Share2 class="size-4" /> Share tracking link
        </Button>
        <StatusBadge :status="order.status" />
      </div>
    </div>

    <!-- Status progression -->
    <Card>
      <CardHeader>
        <CardTitle class="text-base">Order status</CardTitle>
      </CardHeader>
      <CardContent>
        <StatusTimeline :status="order.status" />
      </CardContent>
    </Card>

    <!-- Items -->
    <Card>
      <CardHeader class="flex flex-row items-center justify-between space-y-0">
        <CardTitle class="text-base">Items</CardTitle>
        <Button
          v-if="editable"
          variant="outline"
          size="sm"
          @click="toast.info('Edit mode — wire up your own item editor here.')"
        >
          <Pencil class="size-4" /> Edit
        </Button>
      </CardHeader>
      <CardContent class="space-y-4">
        <div
          v-for="item in order.items"
          :key="item.id"
          class="flex items-start justify-between gap-4 border-b pb-3 last:border-0 last:pb-0"
        >
          <div class="flex gap-3">
            <span class="font-semibold text-primary">{{ item.quantity }}×</span>
            <div>
              <p class="font-medium">{{ item.name }}</p>
              <p v-if="item.variantLabel" class="text-xs text-muted-foreground">{{ item.variantLabel }}</p>
              <p
                v-if="item.notes"
                class="mt-1 inline-block rounded bg-amber-500/15 px-1.5 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-300"
              >
                {{ item.notes }}
              </p>
            </div>
          </div>
          <span class="font-medium">{{ rm(item.unitPrice * item.quantity) }}</span>
        </div>

        <div class="space-y-1 pt-1 text-sm">
          <div class="flex justify-between text-muted-foreground">
            <span>Subtotal</span><span>{{ rm(order.subtotal) }}</span>
          </div>
          <div class="flex justify-between text-base font-bold">
            <span>Total</span><span>{{ rm(order.total) }}</span>
          </div>
        </div>

        <div
          v-if="order.notes"
          class="rounded-lg border border-dashed p-3 text-sm text-muted-foreground"
        >
          <span class="font-medium text-foreground">Note:</span> {{ order.notes }}
        </div>
      </CardContent>
    </Card>

    <!-- Locked notice -->
    <p
      v-if="!editable && order.status !== 'paid'"
      class="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-300"
    >
      <Lock class="size-4" />
      This order is <strong>{{ statusLabels[order.status].toLowerCase() }}</strong> and can no longer
      be edited. Ask an admin for an override if a change is needed.
    </p>

    <!-- Actions -->
    <Card v-if="order.status !== 'paid'">
      <CardHeader><CardTitle class="text-base">Actions</CardTitle></CardHeader>
      <CardContent class="flex flex-wrap gap-2">
        <Button v-if="nextAction" @click="advance">
          <ArrowRight class="size-4" /> {{ nextAction }}
        </Button>

        <Dialog v-if="order.status === 'served'" v-model:open="payOpen">
          <DialogTrigger as-child>
            <Button><CreditCard class="size-4" /> Record Payment</Button>
          </DialogTrigger>
          <DialogContent class="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Record payment</DialogTitle>
              <DialogDescription>
                {{ order.orderNumber }} · {{ rm(order.total) }}
              </DialogDescription>
            </DialogHeader>
            <div class="space-y-3 py-2">
              <Label>Payment method</Label>
              <Select v-model="payMethod">
                <SelectTrigger class="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button variant="outline" @click="payOpen = false">Cancel</Button>
              <Button @click="recordPayment">Mark as Paid</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Button variant="outline" class="text-destructive" @click="toast.error('Cancel flow is yours to implement.')">
          Cancel order
        </Button>
      </CardContent>
    </Card>

    <div v-else class="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300">
      ✓ Paid via {{ order.paymentMethod }} · table released.
    </div>
  </div>

  <div v-else-if="loading" class="py-20 text-center text-muted-foreground">Loading…</div>
  <div v-else class="py-20 text-center text-muted-foreground">Order not found.</div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import {
  ChevronLeft,
  Pencil,
  Lock,
  ArrowRight,
  CreditCard,
  Share2,
} from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { rm, time } from '@/lib/format'
import { statusLabels, statusFlow } from '@/data/orders'
import { api } from '@/composables/api'
import type { Order, PaymentMethod } from '@/composables/api/services/orders'

const route = useRoute()
const order = ref<Order | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    order.value = await api.orders.get(Number(route.params.id))
  } catch {
    error.value = 'Failed to load'
  } finally {
    loading.value = false
  }
})

// Edits only allowed while placed/preparing (US-3.3)
const editable = computed(
  () => order.value?.status === 'placed' || order.value?.status === 'preparing',
)

const nextAction = computed(() => {
  const s = order.value?.status
  const labels: Record<string, string> = {
    placed: 'Start Preparing',
    preparing: 'Mark Ready',
    ready: 'Mark Served',
  }
  return s ? labels[s] : undefined
})

async function advance() {
  if (!order.value) return
  const i = statusFlow.indexOf(order.value.status)
  const next = statusFlow[i + 1]
  if (!next) return
  try {
    order.value = await api.orders.update(order.value.id, { status: next })
    toast.success(`Order moved to ${statusLabels[next]}`)
  } catch {
    toast.error('Could not update the order status.')
  }
}

async function shareTrackingLink() {
  if (!order.value?.trackToken) return
  const url = `${window.location.origin}/track/${order.value.trackToken}`
  try {
    await navigator.clipboard.writeText(url)
    toast.success('Tracking link copied to clipboard')
  } catch {
    toast.error('Could not copy — link: ' + url)
  }
}

const payOpen = ref(false)
const payMethod = ref<PaymentMethod>('cash')
async function recordPayment() {
  if (!order.value) return
  try {
    order.value = await api.orders.update(order.value.id, {
      status: 'paid',
      paymentMethod: payMethod.value,
    })
    payOpen.value = false
    toast.success('Payment recorded — table released.')
  } catch {
    toast.error('Could not record the payment.')
  }
}
</script>
