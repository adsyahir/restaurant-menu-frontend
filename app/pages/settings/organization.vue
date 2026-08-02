<template>
  <div class="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle class="text-lg">Restaurant details</CardTitle>
        <CardDescription>Shown on receipts and your public QR menu.</CardDescription>
      </CardHeader>
      <CardContent class="space-y-5">
        <div class="flex items-center gap-4">
          <div class="flex size-16 items-center justify-center rounded-xl bg-primary/10 text-3xl">
            {{ active.emoji }}
          </div>
          <div class="space-y-1">
            <Button variant="outline" size="sm">Change logo</Button>
            <p class="text-xs text-muted-foreground">Square image works best.</p>
          </div>
        </div>
        <div class="grid gap-4 sm:grid-cols-2">
          <div class="space-y-2">
            <Label for="oname">Restaurant name</Label>
            <Input id="oname" :model-value="active.name" />
          </div>
          <div class="space-y-2">
            <Label for="oslug">Workspace URL</Label>
            <div class="flex items-center rounded-md border">
              <span class="px-3 text-sm text-muted-foreground">warungos.my/</span>
              <input :value="active.slug" readonly class="h-9 flex-1 bg-transparent px-1 text-sm outline-none" />
            </div>
          </div>
          <div class="space-y-2">
            <Label for="oloc">Location</Label>
            <Input id="oloc" :model-value="active.location" />
          </div>
          <div class="space-y-2">
            <Label for="ocur">Currency</Label>
            <Input id="ocur" model-value="MYR (RM)" readonly class="text-muted-foreground" />
          </div>
        </div>
        <div class="flex justify-end">
          <Button @click="toast.success('Organization saved (demo).')">Save changes</Button>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle class="text-lg">Your restaurants</CardTitle>
        <CardDescription>Outlets in this account. Switch between them anytime.</CardDescription>
      </CardHeader>
      <CardContent class="space-y-3">
        <div
          v-for="w in workspaces"
          :key="w.id"
          class="flex items-center gap-3 rounded-lg border p-3"
        >
          <div class="flex size-10 items-center justify-center rounded-lg bg-muted text-lg">{{ w.emoji }}</div>
          <div class="flex-1">
            <div class="font-medium">{{ w.name }}</div>
            <div class="text-xs text-muted-foreground">{{ w.location }}</div>
          </div>
          <Badge variant="outline" class="border-primary/30 bg-primary/10 text-primary">
            {{ planLabels[w.plan] }}
          </Badge>
          <Badge v-if="w.id === active.id" variant="secondary">Current</Badge>
        </div>
        <Button variant="outline" class="w-full" as-child>
          <NuxtLink to="/onboarding"><Plus class="size-4" /> Add restaurant</NuxtLink>
        </Button>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Plus } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { workspaces, currentWorkspace, planLabels } from '@/data/workspace'
import type { Workspace } from '@/data/types'

const active = useState<Workspace>('activeWorkspace', () => currentWorkspace)
</script>
