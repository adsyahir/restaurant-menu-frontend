<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">Orders</h1>
        <p class="text-sm text-muted-foreground">Active and recent orders across the floor.</p>
      </div>
      <Button as-child>
        <NuxtLink to="/orders/new">
          <Plus class="size-4" /> New Order
        </NuxtLink>
      </Button>
    </div>

    <div class="flex flex-wrap items-center gap-2">
      <div class="relative flex-1 sm:max-w-xs">
        <Search class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input v-model="search" placeholder="Search order # or table…" class="pl-9" />
      </div>
      <Button
        v-for="f in filters"
        :key="f.value"
        size="sm"
        :variant="statusFilter === f.value ? 'default' : 'outline'"
        @click="statusFilter = f.value"
      >
        {{ f.label }}
      </Button>
    </div>

    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Table</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Waiter</TableHead>
            <TableHead class="text-right">Total</TableHead>
            <TableHead class="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow
            v-for="order in filtered"
            :key="order.id"
            class="cursor-pointer"
            @click="navigateTo(`/orders/${order.id}`)"
          >
            <TableCell>
              <div class="font-medium">{{ order.orderNumber }}</div>
              <div class="text-xs text-muted-foreground">{{ time(order.placedAt) }}</div>
            </TableCell>
            <TableCell class="font-medium">{{ order.tableLabel }}</TableCell>
            <TableCell class="text-muted-foreground">{{ order.items.length }} items</TableCell>
            <TableCell><StatusBadge :status="order.status" /></TableCell>
            <TableCell class="text-muted-foreground">{{ order.createdByName }}</TableCell>
            <TableCell class="text-right font-semibold">{{ rm(order.total) }}</TableCell>
            <TableCell><ChevronRight class="size-4 text-muted-foreground" /></TableCell>
          </TableRow>
          <TableRow v-if="filtered.length === 0">
            <TableCell colspan="7" class="py-10 text-center text-muted-foreground">
              No orders match your filter.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Plus, Search, ChevronRight } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { rm, time } from '@/lib/format'
import { orders } from '@/data/orders'
import type { OrderStatus } from '@/data/types'

type Filter = OrderStatus | 'all' | 'active'
const filters: { label: string; value: Filter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Placed', value: 'placed' },
  { label: 'Preparing', value: 'preparing' },
  { label: 'Ready', value: 'ready' },
  { label: 'Served', value: 'served' },
  { label: 'Paid', value: 'paid' },
]

const search = ref('')
const statusFilter = ref<Filter>('all')

const filtered = computed(() =>
  orders.filter((o) => {
    const matchesSearch =
      !search.value ||
      o.orderNumber.toLowerCase().includes(search.value.toLowerCase()) ||
      o.tableLabel.toLowerCase().includes(search.value.toLowerCase())
    const matchesStatus =
      statusFilter.value === 'all' ||
      (statusFilter.value === 'active'
        ? ['placed', 'preparing', 'ready', 'served'].includes(o.status)
        : o.status === statusFilter.value)
    return matchesSearch && matchesStatus
  }),
)
</script>
