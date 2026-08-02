<template>
  <div class="mx-auto max-w-4xl space-y-6">
    <div>
      <h1 class="text-2xl font-bold tracking-tight">Settings</h1>
      <p class="text-sm text-muted-foreground">Manage your account, workspace, team and billing.</p>
    </div>

    <nav class="flex flex-wrap gap-1 border-b">
      <NuxtLink
        v-for="tab in tabs"
        :key="tab.to"
        :to="tab.to"
        :class="cn(
          'flex items-center gap-2 border-b-2 px-3 py-2 text-sm font-medium transition-colors',
          isActive(tab.to)
            ? 'border-primary text-foreground'
            : 'border-transparent text-muted-foreground hover:text-foreground',
        )"
      >
        <component :is="tab.icon" class="size-4" />
        {{ tab.label }}
      </NuxtLink>
    </nav>

    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
import { User, Building2, Users, CreditCard } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

const route = useRoute()

const tabs = [
  { label: 'Profile', to: '/settings/profile', icon: User },
  { label: 'Organization', to: '/settings/organization', icon: Building2 },
  { label: 'Team', to: '/settings/team', icon: Users },
  { label: 'Billing', to: '/settings/billing', icon: CreditCard },
]

function isActive(to: string) {
  return route.path === to
}
</script>
