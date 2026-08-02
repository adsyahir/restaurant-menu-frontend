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
      <div class="flex items-center gap-2 px-1 py-1.5">
        <Avatar class="size-8">
          <AvatarFallback class="bg-primary/15 text-primary">{{ initials }}</AvatarFallback>
        </Avatar>
        <div class="grid flex-1 leading-tight">
          <span class="truncate text-sm font-medium">{{ currentUser.name }}</span>
          <span class="truncate text-xs text-muted-foreground">{{ roleLabels[role] }}</span>
        </div>
      </div>
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>

<script setup lang="ts">
import { computed } from 'vue'
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import type { StaffRole } from '@/data/types'
import { roleLabels } from '@/data/staff'

const route = useRoute()
const role = useState<StaffRole>('previewRole', () => 'admin')

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

function isActive(to: string) {
  if (to === '/orders') return route.path === '/orders'
  return route.path === to || route.path.startsWith(to + '/')
}

const users: Record<StaffRole, { name: string }> = {
  admin: { name: 'Zainab Rahman' },
  waiter: { name: 'Aisyah Karim' },
  kitchen: { name: 'Chef Ramesh' },
}
const currentUser = computed(() => users[role.value])
const initials = computed(() =>
  currentUser.value.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2),
)
</script>
