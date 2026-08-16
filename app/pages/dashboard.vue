<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p class="text-sm text-muted-foreground">
          Performance at a glance — {{ rangeLabels[range].toLowerCase() }}.
        </p>
      </div>
      <Tabs v-model="range">
        <TabsList>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="week">Week</TabsTrigger>
          <TabsTrigger value="month">Month</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>

    <p v-if="error" class="py-10 text-center text-sm text-destructive">{{ error }}</p>
    <p v-else-if="loading" class="py-10 text-center text-muted-foreground">Loading…</p>

    <!-- Stat cards -->
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <StatCard
        label="Total Orders"
        :value="String(summary.totalOrders)"
        :icon="ClipboardList"
        :delta="summary.ordersDelta"
      />
      <StatCard
        label="Revenue"
        :value="rm(summary.revenue)"
        :icon="Banknote"
        :delta="summary.revenueDelta"
      />
      <StatCard
        label="Avg. Order Value"
        :value="rm(summary.avgOrderValue)"
        :icon="Receipt"
      />
    </div>

    <div class="grid gap-6 lg:grid-cols-5">
      <!-- Top-selling -->
      <Card class="lg:col-span-3">
        <CardHeader>
          <CardTitle>Top-selling items</CardTitle>
          <CardDescription>Ranked by quantity sold, {{ rangeLabels[range].toLowerCase() }}.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead class="w-8">#</TableHead>
                <TableHead>Item</TableHead>
                <TableHead class="text-right">Qty</TableHead>
                <TableHead class="text-right">Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="(item, i) in topSelling" :key="i">
                <TableCell class="font-medium text-muted-foreground">{{ i + 1 }}</TableCell>
                <TableCell>
                  <div class="font-medium">{{ item.name }}</div>
                </TableCell>
                <TableCell class="text-right font-medium">{{ item.quantitySold }}</TableCell>
                <TableCell class="text-right">{{ rm(item.revenue) }}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <!-- Recent orders -->
      <Card class="lg:col-span-2">
        <CardHeader class="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Recent orders</CardTitle>
            <CardDescription>Latest activity</CardDescription>
          </div>
          <Button as-child variant="ghost" size="sm">
            <NuxtLink to="/orders">View all</NuxtLink>
          </Button>
        </CardHeader>
        <CardContent class="space-y-1">
          <NuxtLink
            v-for="order in recentOrders"
            :key="order.id"
            :to="`/orders/${order.id}`"
            class="flex items-center justify-between rounded-lg px-2 py-2.5 transition-colors hover:bg-accent"
          >
            <div class="min-w-0">
              <div class="flex items-center gap-2">
                <span class="font-medium">{{ order.tableLabel }}</span>
                <StatusBadge :status="order.status" />
              </div>
              <p class="truncate text-xs text-muted-foreground">
                {{ order.orderNumber }} · {{ order.items.length }} items
              </p>
            </div>
            <span class="shrink-0 font-semibold">{{ rm(order.total) }}</span>
          </NuxtLink>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { ClipboardList, Banknote, Receipt } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { rm } from '@/lib/format'
import { api } from '@/composables/api'
import type {
  StatSummary,
  TopSellingItem,
} from '@/composables/api/services/dashboard'
import type { Order } from '@/composables/api/services/orders'
import { rangeLabels, type DateRange } from '@/data/dashboard'

const range = ref<DateRange>('today')
const summary = ref<StatSummary>({
  totalOrders: 0,
  revenue: 0,
  avgOrderValue: 0,
  ordersDelta: 0,
  revenueDelta: 0,
})
const topSelling = ref<TopSellingItem[]>([])
const recentOrders = ref<Order[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

async function loadStats() {
  const stats = await api.dashboard.stats(range.value)
  summary.value = stats.summary
  topSelling.value = stats.topSelling
}

onMounted(async () => {
  try {
    const [, orders] = await Promise.all([loadStats(), api.orders.list()])
    recentOrders.value = orders.slice(0, 5)
  } catch {
    error.value = 'Failed to load'
  } finally {
    loading.value = false
  }
})

watch(range, async () => {
  try {
    await loadStats()
  } catch {
    error.value = 'Failed to load'
  }
})
</script>
