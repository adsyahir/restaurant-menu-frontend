<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <button
        class="flex w-full items-center gap-2 rounded-md px-1 py-1.5 text-left transition-colors hover:bg-sidebar-accent"
      >
        <div
          class="flex size-9 items-center justify-center rounded-lg bg-primary text-lg text-primary-foreground"
        >
          {{ active?.emoji ?? '🍽️' }}
        </div>
        <div class="grid flex-1 leading-tight">
          <span class="truncate font-semibold">{{ active?.name ?? 'Loading…' }}</span>
          <span class="truncate text-xs text-muted-foreground">
            {{ accountPlan ? `${planLabels[accountPlan]} plan` : '' }}
          </span>
        </div>
        <ChevronsUpDown class="size-4 text-muted-foreground" />
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-64" align="start">
      <DropdownMenuLabel class="text-xs text-muted-foreground">Restaurants</DropdownMenuLabel>
      <DropdownMenuItem
        v-for="w in workspaces"
        :key="w.uuid"
        class="gap-2"
        :disabled="switching"
        @click="select(w)"
      >
        <div class="flex size-7 items-center justify-center rounded-md border bg-background text-sm">
          {{ w.emoji }}
        </div>
        <div class="grid flex-1 leading-tight">
          <span class="truncate text-sm">{{ w.name }}</span>
          <span class="truncate text-xs text-muted-foreground">{{ locationOf(w) }}</span>
        </div>
        <Check v-if="w.uuid === active?.uuid" class="size-4 text-primary" />
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
import { onMounted, ref } from 'vue'
import { toast } from 'vue-sonner'
import { Check, ChevronsUpDown, Plus, Settings } from 'lucide-vue-next'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { planLabels } from '@/data/workspace'
import { api } from '@/composables/api'
import type { Workspace, PlanTier } from '@/composables/api/services/workspace'

const workspaces = ref<Workspace[]>([])
const active = ref<Workspace | null>(null)
const accountPlan = ref<PlanTier | null>(null)
const switching = ref(false)

// Shared with the default layout; bumping it remounts the page after a switch.
const activeWorkspaceUuid = useState<string>('activeWorkspaceUuid', () => '')

onMounted(async () => {
  try {
    // Plan is account-level (same across every restaurant the user owns).
    const [list, current, sub] = await Promise.all([
      api.workspace.list(),
      api.workspace.current(),
      api.subscription.show(),
    ])
    workspaces.value = list
    active.value = list.find((w) => w.uuid === current.uuid) ?? current
    activeWorkspaceUuid.value = active.value?.uuid ?? ''
    accountPlan.value = sub.plan
  } catch {
    // Sidebar still renders; switcher just stays empty on failure.
  }
})

function locationOf(w: Workspace) {
  return w.city ?? w.state ?? w.countryCode
}

async function select(w: Workspace) {
  if (switching.value || w.uuid === active.value?.uuid) return
  switching.value = true
  try {
    const now = await api.workspace.switchTo(w.uuid)
    active.value = w
    // Remount the current page (SPA — keeps the in-memory token) so it refetches
    // against the new tenant.
    activeWorkspaceUuid.value = now.uuid
    toast.success(`Switched to ${w.name}.`)
  } catch {
    toast.error('Failed to switch restaurant.')
  } finally {
    switching.value = false
  }
}
</script>
