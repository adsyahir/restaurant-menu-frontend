<template>
  <div class="space-y-6">
    <Card>
      <CardHeader class="flex flex-row items-start justify-between gap-3 space-y-0">
        <div>
          <CardTitle class="text-lg">Team members</CardTitle>
          <CardDescription>{{ activeCount }} of {{ subscription.seats.total }} seats used.</CardDescription>
        </div>
        <Dialog v-model:open="inviteOpen">
          <DialogTrigger as-child>
            <Button><UserPlus class="size-4" /> Invite</Button>
          </DialogTrigger>
          <DialogContent class="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Invite a team member</DialogTitle>
              <DialogDescription>They'll get an email invite to join this workspace.</DialogDescription>
            </DialogHeader>
            <div class="space-y-4 py-2">
              <div class="space-y-1.5">
                <Label>Email address</Label>
                <Input type="email" placeholder="name@warungnusantara.my" />
              </div>
              <div class="space-y-1.5">
                <Label>Role</Label>
                <Select>
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
              <Button variant="outline" @click="inviteOpen = false">Cancel</Button>
              <Button @click="sendInvite">Send invite</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <!-- Seat usage -->
        <div class="mb-5 space-y-1.5">
          <div class="flex justify-between text-xs text-muted-foreground">
            <span>Seats</span><span>{{ activeCount }} / {{ subscription.seats.total }}</span>
          </div>
          <Progress :model-value="seatPct" />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead class="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="m in staff" :key="m.id">
              <TableCell>
                <div class="flex items-center gap-3">
                  <Avatar class="size-9">
                    <AvatarFallback class="bg-primary/15 text-xs text-primary">{{ initials(m.name) }}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div class="font-medium">{{ m.name }}</div>
                    <div class="text-xs text-muted-foreground">{{ m.email }}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge :class="roleClass(m.role)" variant="outline">{{ roleLabels[m.role] }}</Badge>
              </TableCell>
              <TableCell>
                <Badge v-if="m.isActive" variant="outline" class="border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                  Active
                </Badge>
                <Badge v-else variant="outline" class="text-muted-foreground">Invited</Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger as-child>
                    <Button variant="ghost" size="icon" class="size-8"><MoreHorizontal class="size-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Change role</DropdownMenuItem>
                    <DropdownMenuItem>Resend invite</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem class="text-destructive">Remove</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { UserPlus, MoreHorizontal } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { staff, roleLabels } from '@/data/staff'
import { subscription } from '@/data/workspace'
import type { StaffRole } from '@/data/types'

const inviteOpen = ref(false)
const activeCount = computed(() => staff.filter((s) => s.isActive).length)
const seatPct = computed(() => Math.round((activeCount.value / subscription.seats.total) * 100))

function initials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2)
}
const roleClasses: Record<StaffRole, string> = {
  admin: 'border-primary/30 bg-primary/10 text-primary',
  waiter: 'border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300',
  kitchen: 'border-violet-500/30 bg-violet-500/10 text-violet-700 dark:text-violet-300',
}
const roleClass = (role: StaffRole) => roleClasses[role]

function sendInvite() {
  inviteOpen.value = false
  toast.success('Invite sent (demo).')
}
</script>
