<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">Tables</h1>
        <p class="text-sm text-muted-foreground">
          {{ counts.occupied }} occupied · {{ counts.available }} available · {{ counts.needs_cleaning }} to clean
        </p>
      </div>
      <Dialog v-model:open="addOpen">
        <DialogTrigger as-child>
          <Button><Plus class="size-4" /> Add Table</Button>
        </DialogTrigger>
        <DialogContent class="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Add table</DialogTitle>
            <DialogDescription>Define a new physical table.</DialogDescription>
          </DialogHeader>
          <div class="space-y-4 py-2">
            <div class="space-y-1.5">
              <Label>Label</Label>
              <Input placeholder="e.g. T13 or Patio 4" />
            </div>
            <div class="space-y-1.5">
              <Label>Seating capacity</Label>
              <Input type="number" placeholder="4" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" @click="addOpen = false">Cancel</Button>
            <Button @click="save">Add Table</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>

    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
      <Card
        v-for="t in tables"
        :key="t.id"
        :class="cn('border-l-4 transition-shadow hover:shadow-md', border(t.status))"
      >
        <CardContent class="space-y-2 p-4">
          <div class="flex items-center justify-between">
            <span class="text-lg font-bold">{{ t.label }}</span>
            <component :is="icon(t.status)" :class="cn('size-5', iconColor(t.status))" />
          </div>
          <div class="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users class="size-3.5" /> seats {{ t.seatingCapacity }}
          </div>
          <Badge :class="badge(t.status)" variant="outline" class="w-full justify-center">
            {{ tableStatusLabels[t.status] }}
          </Badge>
          <NuxtLink
            v-if="t.activeOrderNumber"
            :to="`/orders/${orderIdFor(t.activeOrderNumber)}`"
            class="block truncate text-center text-xs text-primary hover:underline"
          >
            {{ t.activeOrderNumber }}
          </NuxtLink>
          <p v-else class="text-center text-xs text-muted-foreground">—</p>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Plus, Users, CheckCircle2, CircleDot, Brush } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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
import { cn } from '@/lib/utils'
import { tables, tableStatusLabels } from '@/data/tables'
import { orders } from '@/data/orders'
import type { TableStatus } from '@/data/types'

const addOpen = ref(false)

const counts = computed(() => ({
  occupied: tables.filter((t) => t.status === 'occupied').length,
  available: tables.filter((t) => t.status === 'available').length,
  needs_cleaning: tables.filter((t) => t.status === 'needs_cleaning').length,
}))

function orderIdFor(orderNumber: string) {
  return orders.find((o) => o.orderNumber === orderNumber)?.id ?? ''
}

const borders: Record<TableStatus, string> = {
  available: 'border-l-emerald-500',
  occupied: 'border-l-amber-500',
  needs_cleaning: 'border-l-red-500',
}
const badges: Record<TableStatus, string> = {
  available: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  occupied: 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300',
  needs_cleaning: 'border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300',
}
const icons: Record<TableStatus, unknown> = {
  available: CheckCircle2,
  occupied: CircleDot,
  needs_cleaning: Brush,
}
const iconColors: Record<TableStatus, string> = {
  available: 'text-emerald-500',
  occupied: 'text-amber-500',
  needs_cleaning: 'text-red-500',
}
const border = (s: TableStatus) => borders[s]
const badge = (s: TableStatus) => badges[s]
const icon = (s: TableStatus) => icons[s]
const iconColor = (s: TableStatus) => iconColors[s]

function save() {
  addOpen.value = false
  toast.success('Table added (demo).')
}
</script>
