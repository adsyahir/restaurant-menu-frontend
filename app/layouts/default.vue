<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <header
        class="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur"
      >
        <SidebarTrigger class="-ml-1" />
        <Separator orientation="vertical" class="mr-2 !h-5" />
        <Breadcrumb>
          <BreadcrumbList>
            <template v-for="(crumb, i) in crumbs" :key="crumb.to">
              <BreadcrumbItem>
                <BreadcrumbPage v-if="i === crumbs.length - 1 || !crumb.link">
                  {{ crumb.label }}
                </BreadcrumbPage>
                <BreadcrumbLink v-else as-child>
                  <NuxtLink :to="crumb.to">{{ crumb.label }}</NuxtLink>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator v-if="i < crumbs.length - 1" />
            </template>
          </BreadcrumbList>
        </Breadcrumb>

        <div class="ml-auto flex items-center gap-2">
          <RoleSwitcher />
          <DarkModeToggle />
        </div>
      </header>

      <!-- Keyed on the active workspace so switching tenants remounts the page
           (re-running its onMounted fetches) without a full reload that would
           drop the in-memory auth token. -->
      <main class="flex-1 p-4 sm:p-6">
        <div :key="activeWorkspaceUuid">
          <slot />
        </div>
      </main>
    </SidebarInset>
  </SidebarProvider>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'

const route = useRoute()

// Bumped by the workspace switcher; changing it remounts the page slot.
const activeWorkspaceUuid = useState<string>('activeWorkspaceUuid', () => '')

const labelMap: Record<string, string> = {
  dashboard: 'Dashboard',
  orders: 'Orders',
  new: 'New Order',
  kitchen: 'Kitchen Display',
  admin: 'Management',
  menu: 'Menu',
  tables: 'Tables',
  staff: 'Staff',
  settings: 'Settings',
  profile: 'Profile',
  organization: 'Organization',
  team: 'Team',
  billing: 'Billing',
}

// Segments that have no index page of their own — shown as plain text, not links.
const nonRoutable = new Set(['admin'])

const crumbs = computed(() => {
  const parts = route.path.split('/').filter(Boolean)
  let acc = ''
  const list = parts.map((part) => {
    acc += `/${part}`
    return {
      to: acc,
      label: labelMap[part] ?? decodeURIComponent(part),
      link: !nonRoutable.has(part),
    }
  })
  return [{ to: '/dashboard', label: 'Warung Nusantara', link: true }, ...list]
})
</script>
