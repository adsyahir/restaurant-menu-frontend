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
                <Input v-model="form.name" placeholder="e.g. Nasi Goreng Kampung" />
              </div>
              <div class="space-y-1.5 sm:col-span-2">
                <Label>Description</Label>
                <Textarea v-model="form.description" placeholder="Short description shown to customers" class="min-h-16" />
              </div>
              <div class="space-y-1.5">
                <Label>Base price (RM)</Label>
                <Input v-model.number="form.basePrice" type="number" step="0.10" placeholder="12.90" />
              </div>
              <div class="space-y-1.5">
                <Label>Category</Label>
                <Select v-model="form.categoryId">
                  <SelectTrigger class="w-full"><SelectValue placeholder="Choose" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="c in cats" :key="c.id" :value="String(c.id)">{{ c.name }}</SelectItem>
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
                  <Checkbox
                    :model-value="form.dietaryTags.includes(tag)"
                    @update:model-value="toggleTag(tag)"
                  /> {{ label }}
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

    <p v-if="error" class="py-10 text-center text-sm text-destructive">{{ error }}</p>
    <p v-else-if="loading" class="py-10 text-center text-muted-foreground">Loading…</p>

    <div class="grid gap-6 lg:grid-cols-[240px_1fr]">
      <!-- Categories -->
      <Card class="h-fit">
        <CardHeader class="flex flex-row items-center justify-between space-y-0">
          <CardTitle class="text-base">Categories</CardTitle>
          <Button variant="ghost" size="icon" class="size-7" @click="addingCategory = !addingCategory">
            <Plus class="size-4" />
          </Button>
        </CardHeader>
        <CardContent class="space-y-1">
          <div v-if="addingCategory" class="flex items-center gap-1.5 pb-1">
            <Input
              v-model="newCategoryName"
              placeholder="New category"
              class="h-8"
              @keyup.enter="createCategory"
            />
            <Button size="sm" class="h-8" :disabled="!newCategoryName.trim()" @click="createCategory">Add</Button>
          </div>
          <div
            v-for="(c, i) in cats"
            :key="c.id"
            draggable="true"
            :class="cn(
              'group flex items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors',
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
            <button
              class="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
              title="Delete category"
              @click="deleteCategory(c)"
            >
              <Trash2 class="size-4" />
            </button>
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
              <TableCell><DietaryTags :tags="(item.dietaryTags as DietaryTag[])" /></TableCell>
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
import { computed, onMounted, reactive, ref } from 'vue'
import { Plus, GripVertical, Layers, Trash2 } from 'lucide-vue-next'
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
import { dietaryTagLabels } from '@/data/menu'
import type { DietaryTag } from '@/data/types'
import { api } from '@/composables/api'
import type { Category } from '@/composables/api/services/categories'
import type { MenuItem } from '@/composables/api/services/menuItems'

const items = ref<MenuItem[]>([])
const cats = ref<Category[]>([])
const addOpen = ref(false)
const loading = ref(true)
const error = ref<string | null>(null)
const addingCategory = ref(false)
const newCategoryName = ref('')

const form = reactive({
  name: '',
  description: '',
  basePrice: 0,
  categoryId: '' as string,
  dietaryTags: [] as DietaryTag[],
})

function resetForm() {
  form.name = ''
  form.description = ''
  form.basePrice = 0
  form.categoryId = ''
  form.dietaryTags = []
}

function toggleTag(tag: DietaryTag) {
  const idx = form.dietaryTags.indexOf(tag)
  if (idx === -1) form.dietaryTags.push(tag)
  else form.dietaryTags.splice(idx, 1)
}

function categoryName(categoryId: number): string {
  return cats.value.find((c) => c.id === categoryId)?.name ?? 'Uncategorised'
}

async function loadCategories() {
  cats.value = await api.categories.list()
}
async function loadItems() {
  items.value = await api.menuItems.list()
}

onMounted(async () => {
  try {
    await Promise.all([loadCategories(), loadItems()])
  } catch (e) {
    error.value = 'Failed to load'
  } finally {
    loading.value = false
  }
})

async function createCategory() {
  const name = newCategoryName.value.trim()
  if (!name) return
  try {
    await api.categories.create({ name, displayOrder: cats.value.length + 1 })
    await loadCategories()
    newCategoryName.value = ''
    addingCategory.value = false
    error.value = null
    toast.success(`Category “${name}” added`)
  } catch (e) {
    error.value = 'Failed to add category'
    toast.error('Could not add category')
  }
}

async function deleteCategory(category: Category) {
  const count = countByCategory.value[category.id] ?? 0
  const message = count > 0
    ? `Delete “${category.name}” and its ${count} item(s)?`
    : `Delete “${category.name}”?`
  if (!confirm(message)) return
  try {
    await api.categories.remove(category.id)
    await Promise.all([loadCategories(), loadItems()])
    error.value = null
    toast.success(`Category “${category.name}” deleted`)
  } catch (e) {
    error.value = 'Failed to delete category'
    toast.error('Could not delete category')
  }
}

const dragIndex = ref<number | null>(null)
const overIndex = ref<number | null>(null)

function onDragStart(i: number, e: DragEvent) {
  dragIndex.value = i
  if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move'
}
async function onDrop(target: number) {
  const from = dragIndex.value
  if (from === null || from === target) return
  const list = [...cats.value]
  const [moved] = list.splice(from, 1)
  if (!moved) return
  list.splice(target, 0, moved)
  cats.value = list
  // Persist the new display order for every affected category.
  try {
    await Promise.all(
      list.map((c, i) =>
        c.displayOrder === i + 1
          ? Promise.resolve(c)
          : api.categories.update(c.id, { displayOrder: i + 1 }),
      ),
    )
    list.forEach((c, i) => (c.displayOrder = i + 1))
    toast.success(`Moved “${moved.name}” to position ${target + 1}`)
  } catch (e) {
    error.value = 'Failed to save category order'
    await loadCategories()
  }
}
function onDragEnd() {
  dragIndex.value = null
  overIndex.value = null
}

const countByCategory = computed(() => {
  const map: Record<number, number> = {}
  for (const i of items.value) map[i.categoryId] = (map[i.categoryId] ?? 0) + 1
  return map
})

async function onToggle(item: MenuItem) {
  try {
    await api.menuItems.update(item.id, { isAvailable: item.isAvailable })
    error.value = null
    toast[item.isAvailable ? 'success' : 'warning'](
      `${item.name} is now ${item.isAvailable ? 'available' : 'sold out'}`,
    )
  } catch (e) {
    item.isAvailable = !item.isAvailable // revert on failure
    error.value = 'Failed to update availability'
    toast.error('Could not update availability')
  }
}

async function saveItem() {
  try {
    await api.menuItems.create({
      categoryId: Number(form.categoryId),
      name: form.name,
      description: form.description || null,
      basePrice: form.basePrice,
      dietaryTags: form.dietaryTags,
      variants: [],
      addOns: [],
    })
    await loadItems()
    error.value = null
    resetForm()
    addOpen.value = false
    toast.success('Item saved')
  } catch (e) {
    error.value = 'Failed to save item'
    toast.error('Could not save item')
  }
}
</script>
