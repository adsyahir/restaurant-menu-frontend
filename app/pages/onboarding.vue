<template>
  <div class="flex min-h-screen items-center justify-center bg-muted/30 p-6">
    <div class="w-full max-w-lg space-y-6">
      <div class="text-center">
        <div class="text-4xl">🍜</div>
        <h1 class="mt-2 text-2xl font-bold tracking-tight">Create your restaurant</h1>
        <p class="text-sm text-muted-foreground">
          This becomes your workspace. You can add more outlets later.
        </p>
      </div>

      <Card>
        <CardContent class="space-y-5 pt-6">
          <div class="space-y-2">
            <Label for="rname">Restaurant name</Label>
            <Input id="rname" v-model="name" placeholder="e.g. Warung Nusantara" />
          </div>

          <div class="space-y-2">
            <Label for="slug">Workspace URL</Label>
            <div class="flex items-center rounded-md border focus-within:ring-1 focus-within:ring-ring">
              <span class="px-3 text-sm text-muted-foreground">warungos.my/</span>
              <input
                id="slug"
                :value="slug"
                readonly
                class="h-9 flex-1 rounded-r-md bg-transparent px-1 text-sm outline-none"
              />
            </div>
          </div>

          <div class="space-y-2">
            <Label for="loc">Location</Label>
            <Input id="loc" placeholder="e.g. Kuala Lumpur" />
          </div>

          <div class="space-y-2">
            <Label for="cuisine">Cuisine type</Label>
            <Select>
              <SelectTrigger id="cuisine" class="w-full">
                <SelectValue placeholder="Choose a type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="malaysian">Malaysian</SelectItem>
                <SelectItem value="cafe">Café / Kopitiam</SelectItem>
                <SelectItem value="western">Western</SelectItem>
                <SelectItem value="chinese">Chinese</SelectItem>
                <SelectItem value="indian">Indian</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="space-y-2">
            <Label>Starting plan</Label>
            <div class="grid gap-2 sm:grid-cols-3">
              <button
                v-for="p in plans"
                :key="p.tier"
                type="button"
                :class="cn(
                  'rounded-lg border p-3 text-left text-sm transition-colors',
                  chosenPlan === p.tier ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : 'hover:bg-muted',
                )"
                @click="chosenPlan = p.tier"
              >
                <div class="font-medium">{{ p.name }}</div>
                <div class="text-xs text-muted-foreground">
                  {{ p.priceMonthly === 0 ? 'Free' : `RM${p.priceMonthly}/mo` }}
                </div>
              </button>
            </div>
          </div>

          <Button class="w-full" size="lg" @click="create">
            Create workspace <ArrowRight class="size-4" />
          </Button>
        </CardContent>
      </Card>

      <p class="text-center text-xs text-muted-foreground">
        UI demo — no workspace is actually created.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowRight } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { plans } from '@/data/workspace'
import type { PlanTier } from '@/data/types'

definePageMeta({ layout: false })

const name = ref('')
const chosenPlan = ref<PlanTier>('pro')
const slug = computed(() =>
  name.value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'your-restaurant',
)

// Presentational only — real workspace creation is yours to wire up.
function create() {
  navigateTo('/dashboard')
}
</script>
