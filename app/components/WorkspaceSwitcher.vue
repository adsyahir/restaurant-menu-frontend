<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <button
        class="flex w-full items-center gap-2 rounded-md px-1 py-1.5 text-left transition-colors hover:bg-sidebar-accent"
      >
        <div
          class="flex size-9 items-center justify-center rounded-lg bg-primary text-lg text-primary-foreground"
        >
          {{ active.emoji }}
        </div>
        <div class="grid flex-1 leading-tight">
          <span class="truncate font-semibold">{{ active.name }}</span>
          <span class="truncate text-xs text-muted-foreground">{{ planLabels[active.plan] }} plan</span>
        </div>
        <ChevronsUpDown class="size-4 text-muted-foreground" />
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-64" align="start">
      <DropdownMenuLabel class="text-xs text-muted-foreground">Restaurants</DropdownMenuLabel>
      <DropdownMenuItem
        v-for="w in workspaces"
        :key="w.id"
        class="gap-2"
        @click="active = w"
      >
        <div class="flex size-7 items-center justify-center rounded-md border bg-background text-sm">
          {{ w.emoji }}
        </div>
        <div class="grid flex-1 leading-tight">
          <span class="truncate text-sm">{{ w.name }}</span>
          <span class="truncate text-xs text-muted-foreground">{{ w.location }}</span>
        </div>
        <Check v-if="w.id === active.id" class="size-4 text-primary" />
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem as-child class="gap-2">
        <NuxtLink to="/onboarding">
          <Plus class="size-4" /> Add restaurant
        </NuxtLink>
      </DropdownMenuItem>
      <DropdownMenuItem as-child class="gap-2">
        <NuxtLink to="/settings/organization">
          <Settings class="size-4" /> Workspace settings
        </NuxtLink>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script setup lang="ts">
import { Check, ChevronsUpDown, Plus, Settings } from 'lucide-vue-next'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { workspaces, currentWorkspace, planLabels } from '@/data/workspace'
import type { Workspace } from '@/data/types'

// Presentational tenant switcher — swap for real workspace state later.
const active = useState<Workspace>('activeWorkspace', () => currentWorkspace)
</script>
