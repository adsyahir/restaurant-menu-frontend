<template>
  <div>
    <!-- Hero -->
    <section class="relative overflow-hidden">
      <div
        class="pointer-events-none absolute inset-0 bg-gradient-to-b from-amber-500/10 via-background to-background"
      />
      <div class="relative mx-auto max-w-6xl px-4 py-20 text-center sm:px-6 sm:py-28">
        <Badge variant="outline" class="mb-5 gap-1 border-primary/30 bg-primary/10 text-primary">
          <Sparkles class="size-3.5" /> The all-in-one restaurant OS
        </Badge>
        <h1 class="mx-auto max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
          Run your restaurant floor from
          <span class="text-primary">one dashboard</span>
        </h1>
        <p class="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
          Take orders, drive the kitchen display, manage your menu, and get paid —
          across every outlet, in real time. Set up in minutes, no hardware required.
        </p>
        <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" as-child>
            <NuxtLink to="/register">Start free — no card needed <ArrowRight class="size-4" /></NuxtLink>
          </Button>
          <Button size="lg" variant="outline" as-child>
            <NuxtLink to="/menu">See a live menu</NuxtLink>
          </Button>
        </div>
        <p class="mt-4 text-xs text-muted-foreground">
          Trusted by 1,200+ warungs, kopitiams & bistros across Malaysia
        </p>
      </div>
    </section>

    <!-- Stats bar -->
    <section class="border-y bg-muted/30">
      <div class="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 md:grid-cols-4">
        <div v-for="s in stats" :key="s.label" class="text-center">
          <div class="text-3xl font-bold text-primary">{{ s.value }}</div>
          <div class="mt-1 text-sm text-muted-foreground">{{ s.label }}</div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div class="mx-auto max-w-2xl text-center">
        <h2 class="text-3xl font-bold tracking-tight">Everything the floor needs</h2>
        <p class="mt-3 text-muted-foreground">
          One platform replaces the notepad, the POS, the kitchen printer and the spreadsheet.
        </p>
      </div>
      <div class="mt-12 grid gap-6 md:grid-cols-3">
        <Card v-for="f in features" :key="f.title" class="transition-shadow hover:shadow-md">
          <CardHeader>
            <div class="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <component :is="f.icon" class="size-5" />
            </div>
            <CardTitle class="mt-3 text-lg">{{ f.title }}</CardTitle>
            <CardDescription>{{ f.desc }}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </section>

    <!-- CTA -->
    <section class="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
      <div
        class="overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 to-orange-700 px-6 py-14 text-center text-white"
      >
        <h2 class="text-3xl font-bold">Ready to serve smarter?</h2>
        <p class="mx-auto mt-3 max-w-xl text-white/80">
          Create your workspace in under two minutes. Free forever on the starter plan.
        </p>
        <Button size="lg" variant="secondary" as-child class="mt-7">
          <NuxtLink to="/register">Create your restaurant <ArrowRight class="size-4" /></NuxtLink>
        </Button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import {
  Sparkles,
  ArrowRight,
  ClipboardList,
  CookingPot,
  BookOpen,
  BarChart3,
  QrCode,
  Building2,
} from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

definePageMeta({ layout: 'marketing' })

const stats = [
  { value: '1,200+', label: 'Restaurants' },
  { value: '4.8M', label: 'Orders processed' },
  { value: '99.9%', label: 'Uptime' },
  { value: '< 2 min', label: 'To set up' },
]

const features = [
  { icon: ClipboardList, title: 'Order taking', desc: 'Build orders with variants, add-ons and notes. Totals calculated as you go.' },
  { icon: CookingPot, title: 'Kitchen display', desc: 'Live tickets with wait-time colour bands so nothing gets forgotten.' },
  { icon: BookOpen, title: 'Menu management', desc: 'Categories, dietary tags, sold-out toggles — update once, everywhere.' },
  { icon: BarChart3, title: 'Sales analytics', desc: 'Revenue, top-sellers and trends by day, week or month.' },
  { icon: QrCode, title: 'QR customer menu', desc: 'Diners scan, browse and track their order without an app.' },
  { icon: Building2, title: 'Multi-outlet', desc: 'Switch between restaurants and manage them all from one login.' },
]
</script>
