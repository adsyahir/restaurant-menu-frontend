<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">Staff</h1>
        <p class="text-sm text-muted-foreground">Manage accounts and role-based access.</p>
      </div>
      <Dialog v-model:open="addOpen">
        <DialogTrigger as-child>
          <Button><UserPlus class="size-4" /> Add Staff</Button>
        </DialogTrigger>
        <DialogContent class="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add staff member</DialogTitle>
            <DialogDescription>Add an existing user by email and assign their role.</DialogDescription>
          </DialogHeader>
          <div class="space-y-4 py-2">
            <div class="space-y-1.5">
              <Label>Full name</Label>
              <Input v-model="form.name" placeholder="e.g. Nurul Izzah" />
            </div>
            <div class="space-y-1.5">
              <Label>Email</Label>
              <Input v-model="form.email" type="email" placeholder="name@warungnusantara.my" />
            </div>
            <div class="space-y-1.5">
              <Label>Role</Label>
              <Select v-model="form.role">
                <SelectTrigger class="w-full"><SelectValue placeholder="Choose role" /></SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="(label, role) in roleLabels" :key="role" :value="role">
                    {{ label }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" @click="addOpen = false">Cancel</Button>
            <Button @click="save">Create Account</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>

    <p v-if="error" class="py-10 text-center text-sm text-destructive">{{ error }}</p>
    <p v-else-if="loading" class="py-10 text-center text-muted-foreground">Loading…</p>

    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead class="text-center">Active</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="member in list" :key="member.id" :class="!member.isActive && 'opacity-60'">
            <TableCell>
              <div class="flex items-center gap-3">
                <Avatar class="size-9">
                  <AvatarFallback class="bg-primary/15 text-xs text-primary">
                    {{ initials(member.name) }}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div class="font-medium">{{ member.name }}</div>
                  <div class="text-xs text-muted-foreground">{{ member.email }}</div>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Badge :class="roleClass(member.role)" variant="outline">{{ roleLabels[member.role] }}</Badge>
            </TableCell>
            <TableCell class="text-muted-foreground">{{ joined(member.createdAt) }}</TableCell>
            <TableCell class="text-center">
              <Switch v-model="member.isActive" @update:model-value="onToggle(member)" />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { UserPlus } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { roleLabels } from '@/data/staff'
import type { StaffRole } from '@/data/types'
import { api } from '@/composables/api'
import type { StaffMember } from '@/composables/api/services/staff'

const list = ref<StaffMember[]>([])
const addOpen = ref(false)
const loading = ref(true)
const error = ref<string | null>(null)

const form = reactive({
  name: '',
  email: '',
  role: '' as StaffRole | '',
})

async function loadStaff() {
  list.value = await api.staff.list()
}

onMounted(async () => {
  try {
    await loadStaff()
  } catch (e) {
    error.value = 'Failed to load'
  } finally {
    loading.value = false
  }
})

function initials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2)
}
function joined(iso: string | undefined) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' })
}
const roleClasses: Record<StaffRole, string> = {
  admin: 'border-primary/30 bg-primary/10 text-primary',
  waiter: 'border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300',
  kitchen: 'border-violet-500/30 bg-violet-500/10 text-violet-700 dark:text-violet-300',
}
function roleClass(role: StaffRole) {
  return roleClasses[role]
}
async function onToggle(member: StaffMember) {
  try {
    await api.staff.setActive(member.id, member.isActive)
    toast[member.isActive ? 'success' : 'warning'](
      `${member.name} ${member.isActive ? 'reactivated' : 'deactivated'}`,
    )
  } catch (e) {
    member.isActive = !member.isActive // revert optimistic toggle
    toast.error('Could not update status')
  }
}
async function save() {
  if (!form.role) return
  try {
    await api.staff.add({ email: form.email, role: form.role })
    await loadStaff()
    error.value = null
    form.name = ''
    form.email = ''
    form.role = ''
    addOpen.value = false
    toast.success('Account created')
  } catch (e) {
    error.value = 'Failed to create account'
    toast.error('Could not create account')
  }
}
</script>
