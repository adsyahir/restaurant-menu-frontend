<template>
  <div class="mx-auto max-w-6xl px-4 py-20 sm:px-6">
    <div class="mx-auto max-w-2xl text-center">
      <Badge variant="outline" class="mb-4 border-primary/30 bg-primary/10 text-primary">Pricing</Badge>
      <h1 class="text-4xl font-bold tracking-tight">Simple pricing that scales with you</h1>
      <p class="mt-3 text-muted-foreground">
        Start free. Upgrade when your floor gets busy. Cancel anytime — no lock-in.
      </p>
    </div>

    <div class="mt-14 grid gap-6 lg:grid-cols-3">
      <Card
        v-for="plan in plans"
        :key="plan.tier"
        :class="cn('relative flex flex-col', plan.featured && 'border-primary shadow-lg ring-1 ring-primary/20')"
      >
        <div
          v-if="plan.featured"
          class="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground"
        >
          Most popular
        </div>
        <CardHeader>
          <CardTitle class="text-xl">{{ plan.name }}</CardTitle>
          <CardDescription>{{ plan.tagline }}</CardDescription>
          <div class="mt-3 flex items-baseline gap-1">
            <span class="text-4xl font-bold">{{ plan.priceMonthly === 0 ? 'Free' : `RM${plan.priceMonthly}` }}</span>
            <span v-if="plan.priceMonthly > 0" class="text-sm text-muted-foreground">/ month</span>
          </div>
        </CardHeader>
        <CardContent class="flex flex-1 flex-col gap-5">
          <div class="grid gap-1.5 rounded-lg bg-muted/50 p-3 text-sm">
            <div class="flex items-center gap-2"><ClipboardList class="size-4 text-primary" /> {{ plan.limits.orders }}</div>
            <div class="flex items-center gap-2"><Users class="size-4 text-primary" /> {{ plan.limits.staff }}</div>
            <div class="flex items-center gap-2"><Table2 class="size-4 text-primary" /> {{ plan.limits.tables }}</div>
          </div>
          <ul class="space-y-2 text-sm">
            <li v-for="feat in plan.features" :key="feat" class="flex items-start gap-2">
              <Check class="mt-0.5 size-4 shrink-0 text-primary" />
              <span>{{ feat }}</span>
            </li>
          </ul>
          <Button
            :variant="plan.featured ? 'default' : 'outline'"
            class="mt-auto w-full"
            as-child
          >
            <NuxtLink to="/register">
              {{ plan.priceMonthly === 0 ? 'Start free' : `Choose ${plan.name}` }}
            </NuxtLink>
          </Button>
        </CardContent>
      </Card>
    </div>

    <!-- FAQ -->
    <div class="mx-auto mt-20 max-w-3xl">
      <h2 class="text-center text-2xl font-bold tracking-tight">Frequently asked</h2>
      <div class="mt-8 grid gap-4 sm:grid-cols-2">
        <div v-for="q in faqs" :key="q.q" class="rounded-lg border p-5">
          <h3 class="font-medium">{{ q.q }}</h3>
          <p class="mt-1.5 text-sm text-muted-foreground">{{ q.a }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Check, ClipboardList, Users, Table2 } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { plans } from '@/data/workspace'

definePageMeta({ layout: 'marketing' })

const faqs = [
  { q: 'Do I need special hardware?', a: 'No. WarungOS runs in any browser — phone, tablet or desktop. Diners just scan a QR code.' },
  { q: 'Can I switch plans later?', a: 'Anytime. Upgrades apply instantly; downgrades take effect at the next billing cycle.' },
  { q: 'Is there a free trial?', a: 'The Free plan is free forever. Pro and Business come with a 14-day trial, no card required.' },
  { q: 'Can I run multiple outlets?', a: 'Yes — the Business plan lets you manage unlimited restaurants from a single login.' },
]
</script>
