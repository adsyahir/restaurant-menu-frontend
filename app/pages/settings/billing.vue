<template>
  <div class="space-y-6">
    <!-- Current plan -->
    <Card class="border-primary/30">
      <CardHeader class="flex flex-row items-start justify-between gap-3 space-y-0">
        <div>
          <div class="flex items-center gap-2">
            <CardTitle class="text-lg">{{ planLabels[subscription.plan] }} plan</CardTitle>
            <Badge variant="outline" class="border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
              {{ statusLabel }}
            </Badge>
          </div>
          <CardDescription>
            RM{{ currentPlan.priceMonthly }}/month · renews on {{ date(subscription.renewsOn) }}
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
                    p.tier === subscription.plan ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : '',
                  )"
                >
                  <div class="font-semibold">{{ p.name }}</div>
                  <div class="mt-1 text-2xl font-bold">
                    {{ p.priceMonthly === 0 ? 'Free' : `RM${p.priceMonthly}` }}
                    <span v-if="p.priceMonthly > 0" class="text-sm font-normal text-muted-foreground">/mo</span>
                  </div>
                  <p class="mt-1 text-xs text-muted-foreground">{{ p.tagline }}</p>
                  <Button
                    :variant="p.tier === subscription.plan ? 'secondary' : 'default'"
                    :disabled="p.tier === subscription.plan"
                    size="sm"
                    class="mt-4"
                    @click="choosePlan(p.name)"
                  >
                    {{ p.tier === subscription.plan ? 'Current plan' : 'Select' }}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
    </Card>

    <!-- Usage -->
    <div class="grid gap-4 sm:grid-cols-3">
      <Card>
        <CardHeader class="pb-2"><CardDescription>Orders this month</CardDescription></CardHeader>
        <CardContent class="space-y-2">
          <div class="text-2xl font-bold">{{ subscription.usage.ordersThisMonth.toLocaleString() }}</div>
          <p class="text-xs text-muted-foreground">
            {{ subscription.usage.ordersLimit === 0 ? 'Unlimited on Pro' : `of ${subscription.usage.ordersLimit}` }}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="pb-2"><CardDescription>Staff seats</CardDescription></CardHeader>
        <CardContent class="space-y-2">
          <div class="text-2xl font-bold">{{ subscription.seats.used }} / {{ subscription.seats.total }}</div>
          <Progress :model-value="seatPct" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="pb-2"><CardDescription>Menu items</CardDescription></CardHeader>
        <CardContent class="space-y-2">
          <div class="text-2xl font-bold">{{ subscription.usage.menuItems }}</div>
          <p class="text-xs text-muted-foreground">
            {{ subscription.usage.menuItemsLimit === 0 ? 'Unlimited on Pro' : `of ${subscription.usage.menuItemsLimit}` }}
          </p>
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
          <div>
            <div class="text-sm font-medium">{{ subscription.paymentMethod.brand }} ending {{ subscription.paymentMethod.last4 }}</div>
            <div class="text-xs text-muted-foreground">Expires {{ subscription.paymentMethod.expiry }}</div>
          </div>
        </div>
        <Button variant="outline" @click="toast.success('Payment method updated (demo).')">Update card</Button>
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
            <TableRow v-for="inv in invoices" :key="inv.id">
              <TableCell class="font-medium">{{ inv.number }}</TableCell>
              <TableCell class="text-muted-foreground">{{ date(inv.date) }}</TableCell>
              <TableCell>{{ rm(inv.amount) }}</TableCell>
              <TableCell>
                <Badge variant="outline" class="border-emerald-500/30 bg-emerald-500/10 text-emerald-700 capitalize dark:text-emerald-300">
                  {{ inv.status }}
                </Badge>
              </TableCell>
              <TableCell class="text-right">
                <Button variant="ghost" size="sm" @click="toast.success(`Downloading ${inv.number} (demo).`)">
                  <Download class="size-4" /> PDF
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>

    <p class="text-center text-xs text-muted-foreground">
      UI demo — no real charges. Wire up Stripe / Laravel Cashier for live billing.
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Rocket, CreditCard, Download } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { rm } from '@/lib/format'
import { plans, planLabels, subscription, invoices } from '@/data/workspace'

const planOpen = ref(false)

const currentPlan = computed(() => plans.find((p) => p.tier === subscription.plan)!)
const seatPct = computed(() => Math.round((subscription.seats.used / subscription.seats.total) * 100))
const statusLabel = computed(() =>
  ({ active: 'Active', past_due: 'Past due', trialing: 'Trial' }[subscription.status]),
)

function date(iso: string) {
  return new Date(iso).toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' })
}
function choosePlan(name: string) {
  planOpen.value = false
  toast.success(`Switched to ${name} (demo).`)
}
</script>
