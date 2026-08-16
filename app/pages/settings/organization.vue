<template>
  <div class="space-y-6">
    <p v-if="error" class="py-10 text-center text-sm text-destructive">{{ error }}</p>
    <p v-else-if="loading" class="py-10 text-center text-muted-foreground">Loading…</p>

    <Card>
      <CardHeader>
        <CardTitle class="text-lg">Restaurant details</CardTitle>
        <CardDescription>Shown on receipts and your public QR menu.</CardDescription>
      </CardHeader>
      <CardContent class="space-y-5">
        <div class="flex items-center gap-4">
          <div class="flex size-16 items-center justify-center rounded-xl bg-primary/10 text-3xl">
            {{ form.emoji }}
          </div>
          <div class="space-y-1">
            <Input v-model="form.emoji" maxlength="4" class="h-9 w-24 text-center text-lg" />
            <p class="text-xs text-muted-foreground">Pick an emoji logo.</p>
          </div>
        </div>
        <div class="grid gap-4 sm:grid-cols-2">
          <div class="space-y-2">
            <Label for="oname">Restaurant name</Label>
            <Input id="oname" v-model="form.name" />
          </div>
          <div class="space-y-2">
            <Label for="oslug">Workspace URL</Label>
            <div class="flex items-center rounded-md border">
              <span class="px-3 text-sm text-muted-foreground">warungos.my/</span>
              <input :value="workspace?.slug" readonly class="h-9 flex-1 bg-transparent px-1 text-sm outline-none" />
            </div>
          </div>
          <div class="space-y-2">
            <Label for="oloc">Address</Label>
            <Input id="oloc" v-model="form.address" />
          </div>
          <div class="space-y-2">
            <Label for="ocur">Currency</Label>
            <Input id="ocur" :model-value="workspace?.currency ?? ''" readonly class="text-muted-foreground" />
          </div>
        </div>
        <div class="flex justify-end">
          <Button :disabled="saving" @click="save">Save changes</Button>
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
            <div class="text-xs text-muted-foreground">{{ w.city ?? w.address }}</div>
          </div>
          <Badge variant="outline" class="border-primary/30 bg-primary/10 text-primary">
            {{ planLabels[w.plan] }}
          </Badge>
          <Badge v-if="w.id === workspace?.id" variant="secondary">Current</Badge>
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
import { computed, onMounted, reactive, ref } from 'vue'
import { planLabels } from '@/data/workspace'
import { api } from '@/composables/api'
import type { Workspace } from '@/composables/api/services/workspace'

const workspace = ref<Workspace | null>(null)
const form = reactive({ name: '', emoji: '', address: '' })
const saving = ref(false)
const loading = ref(true)
const error = ref<string | null>(null)

// The account only exposes the current workspace via the API.
const workspaces = computed(() => (workspace.value ? [workspace.value] : []))

onMounted(async () => {
  try {
    const w = await api.workspace.current()
    workspace.value = w
    form.name = w.name
    form.emoji = w.emoji
    form.address = w.address ?? ''
  } catch {
    error.value = 'Failed to load'
  } finally {
    loading.value = false
  }
})

async function save() {
  saving.value = true
  try {
    workspace.value = await api.workspace.update({
      name: form.name,
      emoji: form.emoji,
      address: form.address,
    })
    toast.success('Organization saved.')
  } catch {
    toast.error('Failed to save organization.')
  } finally {
    saving.value = false
  }
}
</script>
