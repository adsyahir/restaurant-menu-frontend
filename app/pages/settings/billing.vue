<template>
  <div class="space-y-6">
    <!-- Trial banner -->
    <div
      v-if="sub && sub.status === 'trialing'"
      :class="cn(
        'flex flex-wrap items-center justify-between gap-3 rounded-lg border px-4 py-3 text-sm',
        sub.trialExpired
          ? 'border-destructive/30 bg-destructive/10 text-destructive'
          : 'border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-200',
      )"
    >
      <span v-if="sub.trialExpired">
        Your free trial has ended — this restaurant is read-only. Upgrade to keep taking orders.
      </span>
      <span v-else>
        Free trial active — {{ trialDaysLeft }} day{{ trialDaysLeft === 1 ? '' : 's' }} left. 1 restaurant included.
      </span>
      <Button size="sm" @click="planOpen = true">Upgrade</Button>
    </div>

    <!-- Current plan -->
    <Card class="border-primary/30">
      <CardHeader class="flex flex-row items-start justify-between gap-3 space-y-0">
        <div>
          <div class="flex items-center gap-2">
            <CardTitle class="text-lg">{{ planLabels[plan] }} plan</CardTitle>
            <Badge variant="outline" class="border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
              {{ statusLabel }}
            </Badge>
          </div>
          <CardDescription>
            RM{{ currentPlan.priceMonthly }}/month
            <template v-if="renewsOn"> · renews on {{ date(renewsOn) }}</template>
          </CardDescription>
        </div>
        <div class="flex gap-2">
          <Dialog v-model:open="planOpen">
            <DialogTrigger as-child>
              <Button><Rocket class="size-4" /> Change plan</Button>
            </DialogTrigger>
            <DialogContent class="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Change your plan</DialogTitle>
                <DialogDescription>Upgrades apply instantly. Downgrades take effect next cycle.</DialogDescription>
              </DialogHeader>
              <div class="grid gap-4 py-2 sm:grid-cols-3">
                <div
                  v-for="p in plans"
                  :key="p.tier"
                  :class="cn(
                    'flex flex-col rounded-lg border p-4',
                    p.tier === plan ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : '',
                  )"
                >
                  <div class="font-semibold">{{ p.name }}</div>
                  <div class="mt-1 text-2xl font-bold">
                    {{ p.priceMonthly === 0 ? 'Free' : `RM${p.priceMonthly}` }}
                    <span v-if="p.priceMonthly > 0" class="text-sm font-normal text-muted-foreground">/mo</span>
                  </div>
                  <p class="mt-1 text-xs text-muted-foreground">{{ p.tagline }}</p>
                  <Button
                    :variant="p.tier === plan ? 'secondary' : 'default'"
                    :disabled="p.tier === plan"
                    size="sm"
                    class="mt-4"
                    @click="choosePlan(p.tier)"
                  >
                    {{ p.tier === plan ? 'Current plan' : 'Select' }}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
    </Card>

    <!-- Usage -->
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader class="pb-2"><CardDescription>Restaurants</CardDescription></CardHeader>
        <CardContent class="space-y-2">
          <div class="text-2xl font-bold">{{ sub?.usage.restaurants ?? 0 }}</div>
          <p class="text-xs text-muted-foreground">{{ restaurantLimitLabel }}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="pb-2"><CardDescription>Orders this month</CardDescription></CardHeader>
        <CardContent class="space-y-2">
          <div class="text-2xl font-bold">{{ (usage?.ordersThisMonth ?? 0).toLocaleString() }}</div>
          <p class="text-xs text-muted-foreground">{{ ordersLimitLabel }}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="pb-2"><CardDescription>Staff seats</CardDescription></CardHeader>
        <CardContent class="space-y-2">
          <div class="text-2xl font-bold">{{ seatsUsed }} / {{ seatsTotalLabel }}</div>
          <Progress :model-value="seatPct" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="pb-2"><CardDescription>Menu items</CardDescription></CardHeader>
        <CardContent class="space-y-2">
          <div class="text-2xl font-bold">{{ usage?.menuItems ?? 0 }}</div>
          <p class="text-xs text-muted-foreground">{{ menuItemsLimitLabel }}</p>
        </CardContent>
      </Card>
    </div>

    <!-- Payment method -->
    <Card>
      <CardHeader>
        <CardTitle class="text-lg">Payment method</CardTitle>
        <CardDescription>Charged automatically on each renewal.</CardDescription>
      </CardHeader>
      <CardContent class="flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <div class="flex size-10 items-center justify-center rounded-md border bg-muted">
            <CreditCard class="size-5" />
          </div>
          <div v-if="card">
            <div class="text-sm font-medium">{{ card.brand }} ending {{ card.last4 }}</div>
            <div class="text-xs text-muted-foreground">Expires {{ expiryLabel }}</div>
          </div>
          <div v-else class="text-sm text-muted-foreground">No card on file.</div>
        </div>

        <Dialog v-model:open="cardOpen">
          <DialogTrigger as-child>
            <Button variant="outline">{{ card ? 'Update card' : 'Add card' }}</Button>
          </DialogTrigger>
          <DialogContent class="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{{ card ? 'Update' : 'Add' }} payment card</DialogTitle>
              <DialogDescription>Stored locally — no real charges are made.</DialogDescription>
            </DialogHeader>
            <div class="space-y-4 py-2">
              <div class="space-y-2">
                <Label for="brand">Card brand</Label>
                <Input id="brand" v-model="form.brand" placeholder="Visa" />
              </div>
              <div class="space-y-2">
                <Label for="last4">Last 4 digits</Label>
                <Input id="last4" v-model="form.last4" inputmode="numeric" maxlength="4" placeholder="4242" />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <Label for="expMonth">Exp. month</Label>
                  <Input id="expMonth" v-model.number="form.expMonth" type="number" min="1" max="12" placeholder="8" />
                </div>
                <div class="space-y-2">
                  <Label for="expYear">Exp. year</Label>
                  <Input id="expYear" v-model.number="form.expYear" type="number" min="2026" max="2100" placeholder="2029" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button :disabled="savingCard" @click="saveCard">
                {{ savingCard ? 'Saving…' : 'Save card' }}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>

    <!-- Invoices -->
    <Card>
      <CardHeader>
        <CardTitle class="text-lg">Billing history</CardTitle>
        <CardDescription>Download past invoices for your records.</CardDescription>
      </CardHeader>
      <CardContent class="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead class="text-right">Receipt</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-if="invoices.length === 0">
              <TableCell colspan="5" class="py-6 text-center text-sm text-muted-foreground">
                No invoices yet.
              </TableCell>
            </TableRow>
            <TableRow v-for="inv in invoices" :key="inv.id">
              <TableCell class="font-medium">{{ inv.number }}</TableCell>
              <TableCell class="text-muted-foreground">{{ inv.issuedOn ? date(inv.issuedOn) : '—' }}</TableCell>
              <TableCell>{{ rm(inv.amount) }}</TableCell>
              <TableCell>
                <Badge variant="outline" :class="statusClass(inv.status)">
                  {{ inv.status }}
                </Badge>
              </TableCell>
              <TableCell class="text-right">
                <Button variant="ghost" size="sm" :disabled="downloadingId === inv.id" @click="downloadInvoice(inv)">
                  <Download class="size-4" /> {{ downloadingId === inv.id ? '…' : 'PDF' }}
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>

    <p class="text-center text-xs text-muted-foreground">
      Plan, usage, card and invoices are stored in your database. Wire up Stripe / Laravel Cashier for real charges.
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { Rocket, CreditCard, Download } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { rm } from '@/lib/format'
import { plans, planLabels } from '@/data/workspace'
import { api } from '@/composables/api'
import type {
  BillingUsage,
  Invoice,
  InvoiceStatus,
  PaymentMethod,
} from '@/composables/api/services/billing'
import type { Subscription, SubscriptionStatus } from '@/composables/api/services/subscription'
import type { PlanTier } from '@/data/types'

const planOpen = ref(false)
const cardOpen = ref(false)

// Plan/trial/limits come from the account subscription; usage/card/invoices
// come from the current workspace's billing endpoint.
const plan = ref<PlanTier>('free')
const usage = ref<BillingUsage | null>(null)
const card = ref<PaymentMethod | null>(null)
const invoices = ref<Invoice[]>([])
const status = ref<SubscriptionStatus>('active')
const renewsOn = ref<string | null>(null)
const sub = ref<Subscription | null>(null)

const loading = ref(true)
const savingCard = ref(false)
const downloadingId = ref<number | null>(null)

const form = reactive({ brand: '', last4: '', expMonth: 1, expYear: new Date().getFullYear() + 1 })

const currentPlan = computed(() => plans.find((p) => p.tier === plan.value)!)

// Usage helpers — a 0 limit means "unlimited".
const seatsUsed = computed(() => usage.value?.staffSeats ?? 0)
const seatsTotalLabel = computed(() =>
  !usage.value || usage.value.staffLimit === 0 ? '∞' : String(usage.value.staffLimit),
)
const seatPct = computed(() => {
  if (!usage.value || usage.value.staffLimit === 0) return 0
  return Math.round((usage.value.staffSeats / usage.value.staffLimit) * 100)
})
const ordersLimitLabel = computed(() =>
  !usage.value || usage.value.ordersLimit === 0 ? 'Unlimited' : `of ${usage.value.ordersLimit}`,
)
const menuItemsLimitLabel = computed(() =>
  !usage.value || usage.value.menuItemsLimit === 0 ? 'Unlimited' : `of ${usage.value.menuItemsLimit}`,
)

const statusLabel = computed(
  () => ({ active: 'Active', past_due: 'Past due', trialing: 'Trial', canceled: 'Canceled' })[status.value],
)

const restaurantLimitLabel = computed(() => {
  if (!sub.value) return ''
  return sub.value.limits.restaurants === null ? 'Unlimited' : `of ${sub.value.limits.restaurants}`
})
const trialDaysLeft = computed(() => {
  if (!sub.value?.trialEndsAt) return null
  const ms = new Date(sub.value.trialEndsAt).getTime() - Date.now()
  return Math.max(0, Math.ceil(ms / 86_400_000))
})
const expiryLabel = computed(() =>
  card.value ? `${String(card.value.expMonth).padStart(2, '0')}/${card.value.expYear}` : '',
)

onMounted(load)

async function load() {
  try {
    const [b, s] = await Promise.all([api.billing.show(), api.subscription.show()])
    sub.value = s
    plan.value = s.plan
    status.value = s.status
    renewsOn.value = s.renewsOn
    usage.value = b.usage
    card.value = b.paymentMethod
    invoices.value = b.invoices
    if (b.paymentMethod) {
      form.brand = b.paymentMethod.brand
      form.last4 = b.paymentMethod.last4
      form.expMonth = b.paymentMethod.expMonth
      form.expYear = b.paymentMethod.expYear
    }
  } catch {
    toast.error('Failed to load billing.')
  } finally {
    loading.value = false
  }
}

function date(iso: string) {
  return new Date(iso).toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' })
}

function statusClass(s: InvoiceStatus) {
  return {
    paid: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 capitalize dark:text-emerald-300',
    due: 'border-amber-500/30 bg-amber-500/10 text-amber-700 capitalize dark:text-amber-300',
    failed: 'border-destructive/30 bg-destructive/10 text-destructive capitalize',
  }[s]
}

async function choosePlan(tier: PlanTier) {
  planOpen.value = false
  try {
    const s = await api.subscription.update(tier)
    sub.value = s
    plan.value = s.plan
    status.value = s.status
    renewsOn.value = s.renewsOn
    toast.success(`Switched to ${planLabels[tier]}.`)
  } catch {
    toast.error('Failed to change plan.')
  }
}

async function downloadInvoice(inv: Invoice) {
  if (downloadingId.value) return
  downloadingId.value = inv.id
  try {
    await api.billing.downloadInvoicePdf(inv.id, inv.number)
  } catch {
    toast.error('Failed to download invoice.')
  } finally {
    downloadingId.value = null
  }
}

async function saveCard() {
  if (savingCard.value) return
  if (!form.brand.trim() || !/^\d{4}$/.test(form.last4)) {
    toast.error('Enter a brand and the last 4 digits.')
    return
  }

  savingCard.value = true
  try {
    const payload = {
      brand: form.brand.trim(),
      last4: form.last4,
      expMonth: form.expMonth,
      expYear: form.expYear,
      isDefault: true,
    }
    card.value = card.value
      ? await api.billing.updatePaymentMethod(card.value.id, payload)
      : await api.billing.createPaymentMethod(payload)
    cardOpen.value = false
    toast.success('Card saved.')
  } catch {
    toast.error('Failed to save card.')
  } finally {
    savingCard.value = false
  }
}
</script>
