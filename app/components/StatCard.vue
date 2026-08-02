<template>
  <Card>
    <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle class="text-sm font-medium text-muted-foreground">
        {{ label }}
      </CardTitle>
      <div class="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <component :is="icon" class="size-5" />
      </div>
    </CardHeader>
    <CardContent>
      <div class="text-2xl font-bold tracking-tight">{{ value }}</div>
      <p v-if="delta !== undefined" class="mt-1 flex items-center gap-1 text-xs">
        <component
          :is="delta >= 0 ? TrendingUp : TrendingDown"
          class="size-3.5"
          :class="delta >= 0 ? 'text-emerald-600' : 'text-red-600'"
        />
        <span :class="delta >= 0 ? 'text-emerald-600' : 'text-red-600'">
          {{ delta >= 0 ? '+' : '' }}{{ delta }}%
        </span>
        <span class="text-muted-foreground">vs previous period</span>
      </p>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { TrendingUp, TrendingDown } from 'lucide-vue-next'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

defineProps<{
  label: string
  value: string
  icon: unknown
  delta?: number
}>()
</script>
