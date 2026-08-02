<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">Menu Management</h1>
        <p class="text-sm text-muted-foreground">Categories, items, variants, and availability.</p>
      </div>
      <Dialog v-model:open="addOpen">
        <DialogTrigger as-child>
          <Button><Plus class="size-4" /> Add Item</Button>
        </DialogTrigger>
        <DialogContent class="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add menu item</DialogTitle>
            <DialogDescription>Create a new dish with variants and add-ons.</DialogDescription>
          </DialogHeader>
          <div class="space-y-4 py-2">
            <div class="grid gap-4 sm:grid-cols-2">
              <div class="space-y-1.5 sm:col-span-2">
                <Label>Name</Label>
                <Input placeholder="e.g. Nasi Goreng Kampung" />
              </div>
              <div class="space-y-1.5 sm:col-span-2">
                <Label>Description</Label>
                <Textarea placeholder="Short description shown to customers" class="min-h-16" />
              </div>
              <div class="space-y-1.5">
                <Label>Base price (RM)</Label>
                <Input type="number" step="0.10" placeholder="12.90" />
              </div>
              <div class="space-y-1.5">
                <Label>Category</Label>
                <Select>
                  <SelectTrigger class="w-full"><SelectValue placeholder="Choose" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="c in cats" :key="c.id" :value="c.id">{{ c.name }}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div class="space-y-2">
              <Label>Dietary tags</Label>
              <div class="flex flex-wrap gap-3">
                <label
                  v-for="(label, tag) in dietaryTagLabels"
                  :key="tag"
                  class="flex items-center gap-2 text-sm"
                >
                  <Checkbox /> {{ label }}
                </label>
              </div>
            </div>

            <div class="rounded-lg border p-3 text-sm text-muted-foreground">
              <div class="mb-1 flex items-center gap-2 font-medium text-foreground">
                <Layers class="size-4" /> Variants &amp; add-ons
              </div>
              Variant/add-on rows (with price modifiers) go here — build the repeater with your own state.
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" @click="addOpen = false">Cancel</Button>
            <Button @click="saveItem">Save Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>

    <div class="grid gap-6 lg:grid-cols-[240px_1fr]">
      <!-- Categories -->
      <Card class="h-fit">
        <CardHeader class="flex flex-row items-center justify-between space-y-0">
          <CardTitle class="text-base">Categories</CardTitle>
          <Button variant="ghost" size="icon" class="size-7"><Plus class="size-4" /></Button>
        </CardHeader>
        <CardContent class="space-y-1">
          <div
            v-for="(c, i) in cats"
            :key="c.id"
            draggable="true"
            :class="cn(
              'flex items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors',
              dragIndex === i ? 'opacity-40' : 'hover:bg-accent',
              overIndex === i && dragIndex !== i ? 'ring-2 ring-primary ring-inset' : '',
            )"
            @dragstart="onDragStart(i, $event)"
            @dragenter.prevent="overIndex = i"
            @dragover.prevent
            @drop="onDrop(i)"
            @dragend="onDragEnd"
          >
            <GripVertical class="size-4 cursor-grab text-muted-foreground active:cursor-grabbing" />
            <span class="flex-1 select-none">{{ c.name }}</span>
            <Badge variant="secondary" class="text-xs">
              {{ countByCategory[c.id] ?? 0 }}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <!-- Items -->
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead class="text-right">Price</TableHead>
              <TableHead class="text-center">Available</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="item in items" :key="item.id">
              <TableCell>
                <div class="font-medium">{{ item.name }}</div>
                <div class="text-xs text-muted-foreground">
                  {{ item.variants.length }} variant(s) · {{ item.addOns.length }} add-on(s)
                </div>
              </TableCell>
              <TableCell class="text-muted-foreground">{{ categoryName(item.categoryId) }}</TableCell>
              <TableCell><DietaryTags :tags="item.dietaryTags" /></TableCell>
              <TableCell class="text-right font-medium">{{ rm(item.basePrice) }}</TableCell>
              <TableCell class="text-center">
                <Switch v-model="item.isAvailable" @update:model-value="onToggle(item)" />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Plus, GripVertical, Layers } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
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
import { Textarea } from '@/components/ui/textarea'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { rm } from '@/lib/format'
import {
  categories,
  menuItems,
  categoryName,
  dietaryTagLabels,
} from '@/data/menu'
import type { Category, MenuItem } from '@/data/types'

const items = ref<MenuItem[]>(menuItems.map((m) => ({ ...m })))
const addOpen = ref(false)

// Local reactive copy so drag-reordering doesn't mutate the shared sample data.
const cats = ref<Category[]>(categories.map((c) => ({ ...c })))
const dragIndex = ref<number | null>(null)
const overIndex = ref<number | null>(null)

function onDragStart(i: number, e: DragEvent) {
  dragIndex.value = i
  if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move'
}
function onDrop(target: number) {
  const from = dragIndex.value
  if (from === null || from === target) return
  const list = [...cats.value]
  const [moved] = list.splice(from, 1)
  list.splice(target, 0, moved)
  cats.value = list
  toast.success(`Moved “${moved.name}” to position ${target + 1} (demo — persist the order via your API).`)
}
function onDragEnd() {
  dragIndex.value = null
  overIndex.value = null
}

const countByCategory = computed(() => {
  const map: Record<string, number> = {}
  for (const i of items.value) map[i.categoryId] = (map[i.categoryId] ?? 0) + 1
  return map
})

function onToggle(item: MenuItem) {
  toast[item.isAvailable ? 'success' : 'warning'](
    `${item.name} is now ${item.isAvailable ? 'available' : 'sold out'}`,
  )
}

function saveItem() {
  addOpen.value = false
  toast.success('Item saved (demo — persist it via your API).')
}
</script>
