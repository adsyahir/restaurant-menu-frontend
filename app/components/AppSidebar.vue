<template>
  <Sidebar>
    <SidebarHeader class="border-b">
      <WorkspaceSwitcher />
    </SidebarHeader>

    <SidebarContent>
      <SidebarGroup v-for="group in visibleGroups" :key="group.label">
        <SidebarGroupLabel>{{ group.label }}</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="item in group.items" :key="item.to">
              <SidebarMenuButton as-child :is-active="isActive(item.to)" :tooltip="item.title">
                <NuxtLink :to="item.to">
                  <component :is="item.icon" />
                  <span>{{ item.title }}</span>
                </NuxtLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>

    <SidebarFooter class="border-t">
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <button
            class="flex w-full items-center gap-2 rounded-md px-1 py-1.5 text-left transition-colors hover:bg-sidebar-accent"
          >
            <Avatar class="size-8">
              <AvatarFallback class="bg-primary/15 text-primary">{{ initials }}</AvatarFallback>
            </Avatar>
            <div class="grid flex-1 leading-tight">
              <span class="truncate text-sm font-medium">{{ userName }}</span>
              <span class="truncate text-xs text-muted-foreground">{{ userEmail }}</span>
            </div>
            <ChevronsUpDown class="size-4 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-56" align="start" side="top">
          <DropdownMenuItem as-child class="gap-2">
            <NuxtLink to="/settings/profile">
              <UserRound class="size-4" /> Profile
            </NuxtLink>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem class="gap-2 text-destructive focus:text-destructive" :disabled="loggingOut" @click="handleLogout">
            <LogOut class="size-4" /> {{ loggingOut ? 'Logging out…' : 'Log out' }}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import {
  LayoutDashboard,
  ClipboardList,
  PlusCircle,
  CookingPot,
  BookOpen,
  Table2,
  Users,
  Settings,
  CreditCard,
  ChevronsUpDown,
  LogOut,
  UserRound,
} from 'lucide-vue-next'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { api } from '@/composables/api'
import { useAuthStore } from '@/stores/auth'
import type { StaffRole } from '@/data/types'

const route = useRoute()
const role = useState<StaffRole>('previewRole', () => 'admin')
const auth = useAuthStore()

interface NavItem {
  title: string
  to: string
  icon: unknown
  roles: StaffRole[]
}
interface NavGroup {
  label: string
  items: NavItem[]
}

const groups: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      { title: 'Dashboard', to: '/dashboard', icon: LayoutDashboard, roles: ['admin'] },
    ],
  },
  {
    label: 'Operations',
    items: [
      { title: 'Orders', to: '/orders', icon: ClipboardList, roles: ['admin', 'waiter'] },
      { title: 'New Order', to: '/orders/new', icon: PlusCircle, roles: ['admin', 'waiter'] },
      { title: 'Kitchen Display', to: '/kitchen', icon: CookingPot, roles: ['admin', 'kitchen'] },
    ],
  },
  {
    label: 'Management',
    items: [
      { title: 'Menu', to: '/admin/menu', icon: BookOpen, roles: ['admin'] },
      { title: 'Tables', to: '/admin/tables', icon: Table2, roles: ['admin', 'waiter'] },
      { title: 'Staff', to: '/admin/staff', icon: Users, roles: ['admin'] },
    ],
  },
  {
    label: 'Account',
    items: [
      { title: 'Settings', to: '/settings', icon: Settings, roles: ['admin'] },
      { title: 'Billing', to: '/settings/billing', icon: CreditCard, roles: ['admin'] },
    ],
  },
]

const visibleGroups = computed(() =>
  groups
    .map((g) => ({ ...g, items: g.items.filter((i) => i.roles.includes(role.value)) }))
    .filter((g) => g.items.length > 0),
)

// All nav targets, used to resolve the most-specific match so a parent like
// `/settings` doesn't stay highlighted when `/settings/billing` is open.
const allTargets = groups.flatMap((g) => g.items.map((i) => i.to))

function isActive(to: string) {
  const path = route.path
  const matches = (t: string) => path === t || path.startsWith(t + '/')

  if (!matches(to)) return false

  // Active only if no other nav item is a longer (more specific) match.
  return !allTargets.some((other) => other !== to && other.length > to.length && matches(other))
}

const loggingOut = ref(false)

const userName = computed(() => auth.user?.name ?? 'Account')
const userEmail = computed(() => auth.user?.email ?? '')
const initials = computed(() =>
  (userName.value
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2) || '?'
  ).toUpperCase(),
)

onMounted(() => {
  // Populate the footer with the real signed-in user if not already loaded.
  if (!auth.user) {
    api.auth.me().catch(() => {})
  }
})

async function handleLogout() {
  if (loggingOut.value) return
  loggingOut.value = true
  await api.auth.logout()
  await navigateTo('/login')
}
</script>
