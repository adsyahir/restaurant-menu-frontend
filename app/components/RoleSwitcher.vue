<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="outline" size="sm" class="gap-2">
        <component :is="roleIcon" class="size-4 text-primary" />
        <span class="hidden sm:inline">Viewing as</span>
        <span class="font-semibold">{{ roleLabels[role] }}</span>
        <ChevronsUpDown class="size-3.5 text-muted-foreground" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="w-48">
      <DropdownMenuLabel>Preview role</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        v-for="r in roles"
        :key="r"
        class="gap-2"
        @select="role = r"
      >
        <component :is="iconFor(r)" class="size-4" />
        {{ roleLabels[r] }}
        <Check v-if="r === role" class="ml-auto size-4 text-primary" />
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  ChevronsUpDown,
  Check,
  Shield,
  ConciergeBell,
  CookingPot,
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { StaffRole } from '@/data/types'
import { roleLabels } from '@/data/staff'

// Purely presentational: previews how the nav changes per role.
// Real auth/role resolution is yours to implement.
const role = useState<StaffRole>('previewRole', () => 'admin')

const roles: StaffRole[] = ['admin', 'waiter', 'kitchen']
const iconMap: Record<StaffRole, unknown> = {
  admin: Shield,
  waiter: ConciergeBell,
  kitchen: CookingPot,
}
function iconFor(r: StaffRole) {
  return iconMap[r]
}
const roleIcon = computed(() => iconMap[role.value])
</script>
