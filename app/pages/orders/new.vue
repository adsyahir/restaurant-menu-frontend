<template>
  <div class="space-y-4">
    <div>
      <h1 class="text-2xl font-bold tracking-tight">New Order</h1>
      <p class="text-sm text-muted-foreground">
        Pick a table, add items with variants, then place the order.
      </p>
    </div>

    <div class="grid gap-6 lg:grid-cols-[1fr_360px]">
      <!-- LEFT: menu picker -->
      <div class="space-y-4">
        <Tabs v-model="activeCat">
          <ScrollArea class="w-full whitespace-nowrap">
            <TabsList>
              <TabsTrigger v-for="c in categories" :key="c.id" :value="c.id">
                {{ c.name }}
              </TabsTrigger>
            </TabsList>
          </ScrollArea>
        </Tabs>

        <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <Card
            v-for="item in itemsInCat"
            :key="item.id"
            class="gap-3 py-4"
            :class="!item.isAvailable && 'opacity-60'"
          >
            <CardHeader class="px-4">
              <div class="flex items-start justify-between gap-2">
                <CardTitle class="text-sm leading-tight">{{ item.name }}</CardTitle>
                <span class="shrink-0 text-sm font-bold text-primary">{{ rm(item.basePrice) }}</span>
              </div>
            </CardHeader>
            <CardContent class="space-y-3 px-4">
              <div v-if="item.variants.length > 1" class="space-y-1.5">
                <Label class="text-xs">Variant</Label>
                <Select v-model="selectedVariant[item.id]">
                  <SelectTrigger class="h-8 w-full text-xs">
                    <SelectValue placeholder="Choose…" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="v in item.variants" :key="v.name" :value="v.name">
                      {{ v.name }}
                      <span v-if="v.priceModifier"> (+{{ rm(v.priceModifier) }})</span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                size="sm"
                class="w-full"
                :disabled="!item.isAvailable"
                @click="addToCart(item)"
              >
                <Plus class="size-4" />
                {{ item.isAvailable ? 'Add' : 'Sold out' }}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <!-- RIGHT: cart -->
      <div class="lg:sticky lg:top-20 lg:h-fit">
        <Card>
          <CardHeader class="gap-3">
            <div class="space-y-1.5">
              <Label>Table</Label>
              <Select v-model="table">
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="Select a table" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="t in availableTables"
                    :key="t.id"
                    :value="t.label"
                  >
                    {{ t.label }} · seats {{ t.seatingCapacity }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Separator />
            <CardTitle class="flex items-center gap-2 text-base">
              <ShoppingCart class="size-4" /> Current Order
              <Badge variant="secondary" class="ml-auto">{{ cartCount }} items</Badge>
            </CardTitle>
          </CardHeader>

          <CardContent class="space-y-3">
            <p v-if="cart.length === 0" class="py-6 text-center text-sm text-muted-foreground">
              No items yet. Add dishes from the left.
            </p>
            <ul v-else class="space-y-3">
              <li v-for="line in cart" :key="line.key" class="flex gap-3 text-sm">
                <div class="min-w-0 flex-1">
                  <p class="font-medium">{{ line.name }}</p>
                  <p v-if="line.variantLabel" class="text-xs text-muted-foreground">
                    {{ line.variantLabel }}
                  </p>
                  <div class="mt-1 flex items-center gap-1">
                    <Button variant="outline" size="icon" class="size-6" @click="dec(line.key)">
                      <Minus class="size-3" />
                    </Button>
                    <span class="w-6 text-center">{{ line.quantity }}</span>
                    <Button variant="outline" size="icon" class="size-6" @click="inc(line.key)">
                      <Plus class="size-3" />
                    </Button>
                  </div>
                </div>
                <div class="text-right">
                  <p class="font-medium">{{ rm(line.unitPrice * line.quantity) }}</p>
                  <button
                    class="text-xs text-muted-foreground hover:text-destructive"
                    @click="remove(line.key)"
                  >
                    Remove
                  </button>
                </div>
              </li>
            </ul>

            <div v-if="cart.length" class="space-y-1.5">
              <Label class="text-xs">Order notes</Label>
              <Textarea v-model="notes" placeholder="e.g. Bring drinks first" class="min-h-16 text-sm" />
            </div>
          </CardContent>

          <CardFooter class="flex-col gap-3 border-t pt-4">
            <div class="w-full space-y-1 text-sm">
              <div class="flex justify-between text-muted-foreground">
                <span>Subtotal</span><span>{{ rm(subtotal) }}</span>
              </div>
              <div class="flex justify-between text-base font-bold">
                <span>Total</span><span>{{ rm(subtotal) }}</span>
              </div>
            </div>
            <Button class="w-full" size="lg" :disabled="!table || cart.length === 0" @click="placeOrder">
              Place Order
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { Plus, Minus, ShoppingCart } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { rm } from '@/lib/format'
import { categories, menuItems } from '@/data/menu'
import { tables } from '@/data/tables'
import type { MenuItem } from '@/data/types'

const activeCat = ref(categories[0]!.id)
const itemsInCat = computed(() =>
  menuItems.filter((m) => m.categoryId === activeCat.value),
)

const selectedVariant = reactive<Record<string, string>>({})
const availableTables = computed(() =>
  tables.filter((t) => t.status === 'available'),
)
const table = ref<string>()
const notes = ref('')

interface CartLine {
  key: string
  name: string
  variantLabel?: string
  unitPrice: number
  quantity: number
}

// Presentational cart — local reactive state only. Real cart/session lives in
// Redis per the plan; wiring that up is yours.
const cart = ref<CartLine[]>([
  { key: 'seed-1', name: 'Nasi Lemak Special', variantLabel: 'Regular', unitPrice: 12.9, quantity: 1 },
  { key: 'seed-2', name: 'Teh Tarik', variantLabel: 'Ais (Iced)', unitPrice: 3.5, quantity: 2 },
])

function addToCart(item: MenuItem) {
  const variantName = selectedVariant[item.id] ?? item.variants[0]?.name
  const variant = item.variants.find((v) => v.name === variantName)
  const unitPrice = item.basePrice + (variant?.priceModifier ?? 0)
  const key = `${item.id}::${variantName}`
  const existing = cart.value.find((l) => l.key === key)
  if (existing) existing.quantity++
  else
    cart.value.push({
      key,
      name: item.name,
      variantLabel: variant && variant.name !== 'Regular' ? variant.name : undefined,
      unitPrice,
      quantity: 1,
    })
  toast.success(`Added ${item.name}`)
}

function inc(key: string) {
  const l = cart.value.find((x) => x.key === key)
  if (l) l.quantity++
}
function dec(key: string) {
  const l = cart.value.find((x) => x.key === key)
  if (l && l.quantity > 1) l.quantity--
}
function remove(key: string) {
  cart.value = cart.value.filter((x) => x.key !== key)
}

const cartCount = computed(() => cart.value.reduce((n, l) => n + l.quantity, 0))
const subtotal = computed(() =>
  cart.value.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0),
)

function placeOrder() {
  toast.success(`Order placed for ${table.value}`, {
    description: `${cartCount.value} items · ${rm(subtotal.value)} — sent to kitchen.`,
  })
  cart.value = []
  notes.value = ''
}
</script>
