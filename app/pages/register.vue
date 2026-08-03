<template>
  <div class="grid min-h-screen lg:grid-cols-2">
    <!-- Brand + step rail -->
    <div
      class="relative hidden flex-col justify-between bg-gradient-to-br from-amber-500 to-orange-700 p-10 text-white lg:flex"
    >
      <NuxtLink to="/home" class="flex items-center gap-2 text-lg font-semibold">
        <span class="text-2xl">🍜</span> Warung<span class="opacity-80">OS</span>
      </NuxtLink>

      <div class="space-y-8">
        <div class="space-y-2">
          <h2 class="text-3xl font-bold leading-tight">Set up your restaurant</h2>
          <p class="max-w-sm text-white/80">Three quick steps and you're serving. No card required.</p>
        </div>

        <ol class="space-y-1">
          <li v-for="s in steps" :key="s.n" class="flex items-start gap-3 py-2">
            <div
              :class="cn(
                'flex size-8 shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition-colors',
                step > s.n ? 'border-white bg-white text-orange-700'
                : step === s.n ? 'border-white bg-white/20 text-white'
                : 'border-white/40 text-white/60',
              )"
            >
              <Check v-if="step > s.n" class="size-4" />
              <span v-else>{{ s.n }}</span>
            </div>
            <div class="pt-0.5">
              <div :class="cn('text-sm font-medium', step >= s.n ? 'text-white' : 'text-white/60')">
                {{ s.label }}
              </div>
              <div class="text-xs text-white/60">{{ s.hint }}</div>
            </div>
          </li>
        </ol>
      </div>

      <p class="text-sm text-white/60">© 2026 WarungOS · Restaurant platform</p>
    </div>

    <!-- Form column -->
    <div class="flex items-center justify-center p-6">
      <div class="w-full max-w-md space-y-6">
        <!-- Mobile header -->
        <div class="space-y-2 text-center lg:hidden">
          <div class="text-4xl">🍜</div>
          <h1 class="text-xl font-semibold">Set up your restaurant</h1>
        </div>

        <!-- Progress -->
        <div class="space-y-2">
          <div class="flex items-center justify-between text-sm">
            <span class="font-medium">{{ current.label }}</span>
            <span class="text-muted-foreground">Step {{ step }} of {{ steps.length }}</span>
          </div>
          <div class="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              class="h-full rounded-full bg-primary transition-all duration-300"
              :style="{ width: `${(step / steps.length) * 100}%` }"
            />
          </div>
        </div>

        <Card>
          <CardHeader class="space-y-1">
            <CardTitle class="text-xl">{{ current.title }}</CardTitle>
            <CardDescription>{{ current.subtitle }}</CardDescription>
          </CardHeader>

          <CardContent>
            <Transition :name="dir" mode="out-in">
              <!-- Step 1 — Account -->
              <div v-if="step === 1" key="1" class="space-y-4">
                <div class="space-y-2">
                  <Label for="name">Full name</Label>
                  <Input id="name" v-model="form.name" placeholder="e.g. Nurul Izzah" :aria-invalid="!!fieldError('name')" />
                  <p v-if="fieldError('name')" class="text-xs text-destructive">{{ fieldError('name') }}</p>
                </div>
                <div class="space-y-2">
                  <Label for="email">Work email</Label>
                  <Input id="email" v-model="form.email" type="email" placeholder="you@yourrestaurant.com" :aria-invalid="!!fieldError('email')" />
                  <p v-if="fieldError('email')" class="text-xs text-destructive">{{ fieldError('email') }}</p>
                </div>
                <div class="space-y-2">
                  <Label for="password">Password</Label>
                  <Input id="password" v-model="form.password" type="password" placeholder="••••••••" :aria-invalid="!!fieldError('password')" />
                  <p v-if="fieldError('password')" class="text-xs text-destructive">{{ fieldError('password') }}</p>
                  <p v-else class="text-xs text-muted-foreground">At least 8 characters.</p>
                </div>
                <div class="space-y-2">
                  <Label for="confirm">Confirm password</Label>
                  <Input id="confirm" v-model="form.confirm" type="password" placeholder="••••••••" :aria-invalid="(attempted || !!form.confirm) && !!errors.confirm" />
                  <p v-if="(attempted || form.confirm) && errors.confirm" class="text-xs text-destructive">{{ errors.confirm }}</p>
                </div>
              </div>

              <!-- Step 2 — Restaurant -->
              <div v-else-if="step === 2" key="2" class="space-y-4">
                <div class="space-y-2">
                  <Label for="restaurant">Restaurant name</Label>
                  <Input id="restaurant" v-model="form.restaurant" placeholder="e.g. Warung Nusantara" :aria-invalid="!!fieldError('restaurant')" />
                  <p v-if="fieldError('restaurant')" class="text-xs text-destructive">{{ fieldError('restaurant') }}</p>
                </div>

                <div class="space-y-1.5">
                  <Label for="slug">Your subdomain</Label>
                  <div
                    :class="cn(
                      'flex items-center gap-1 rounded-md border px-2 focus-within:ring-1',
                      slugStatus === 'taken' ? 'border-destructive focus-within:ring-destructive'
                      : slugStatus === 'available' ? 'border-emerald-500 focus-within:ring-emerald-500'
                      : 'focus-within:ring-ring',
                    )"
                  >
                    <input
                      id="slug"
                      :value="form.slug"
                      placeholder="your-restaurant"
                      class="h-9 min-w-0 flex-1 bg-transparent text-sm outline-none"
                      @input="onSlugInput"
                    />
                    <span class="shrink-0 text-sm text-muted-foreground">.warungos.my</span>
                    <Loader2 v-if="slugStatus === 'checking'" class="size-4 animate-spin text-muted-foreground" />
                    <Check v-else-if="slugStatus === 'available'" class="size-4 text-emerald-500" />
                    <X v-else-if="slugStatus === 'taken'" class="size-4 text-destructive" />
                  </div>
                  <p v-if="slugStatus === 'checking'" class="text-xs text-muted-foreground">
                    Checking availability…
                  </p>
                  <p v-else-if="slugStatus === 'available'" class="text-xs text-emerald-600 dark:text-emerald-400">
                    <span class="font-medium">{{ form.slug }}.warungos.my</span> is available.
                  </p>
                  <p v-else-if="slugStatus === 'taken'" class="text-xs text-destructive">
                    That subdomain is already taken — try another.
                  </p>
                  <p v-else-if="slugStatus === 'invalid'" class="text-xs text-muted-foreground">
                    Use at least 3 characters: letters, numbers and hyphens.
                  </p>
                  <p v-if="serverErrors.slug" class="text-xs text-destructive">{{ serverErrors.slug }}</p>
                </div>
                <div class="space-y-2">
                  <Label for="cuisine">Cuisine</Label>
                  <Select v-model="form.cuisine">
                    <SelectTrigger id="cuisine" class="w-full"><SelectValue placeholder="Choose" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="malaysian">Malaysian</SelectItem>
                      <SelectItem value="cafe">Café / Coffee shop</SelectItem>
                      <SelectItem value="western">Western</SelectItem>
                      <SelectItem value="chinese">Chinese</SelectItem>
                      <SelectItem value="indian">Indian</SelectItem>
                      <SelectItem value="japanese">Japanese</SelectItem>
                      <SelectItem value="italian">Italian</SelectItem>
                      <SelectItem value="mexican">Mexican</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div class="space-y-2">
                  <Label for="address">Street address</Label>
                  <Input id="address" v-model="form.address" placeholder="e.g. 12 Jalan Bukit Bintang" />
                </div>

                <div class="space-y-2">
                  <Label for="country">Country</Label>
                  <Select v-model="form.country">
                    <SelectTrigger id="country" class="w-full"><SelectValue placeholder="Choose" /></SelectTrigger>
                    <SelectContent class="max-h-64">
                      <SelectItem v-for="c in countries" :key="c.code" :value="c.code">{{ c.name }}</SelectItem>
                    </SelectContent>
                  </Select>
                  <p v-if="fieldError('country')" class="text-xs text-destructive">{{ fieldError('country') }}</p>
                </div>

                <!-- Malaysia: cascading dropdowns from the DB -->
                <div v-if="isMalaysia" class="grid gap-4 sm:grid-cols-2">
                  <div class="space-y-2">
                    <Label for="state">State</Label>
                    <Select v-model="form.state_id">
                      <SelectTrigger id="state" class="w-full">
                        <SelectValue :placeholder="loadingStates ? 'Loading…' : 'Choose state'" />
                      </SelectTrigger>
                      <SelectContent class="max-h-64">
                        <SelectItem v-for="s in states" :key="s.id" :value="String(s.id)">{{ s.name }}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div class="space-y-2">
                    <Label for="city">City</Label>
                    <Select v-model="form.city_id" :disabled="!form.state_id">
                      <SelectTrigger id="city" class="w-full">
                        <SelectValue :placeholder="!form.state_id ? 'Select a state first' : loadingCities ? 'Loading…' : 'Choose city'" />
                      </SelectTrigger>
                      <SelectContent class="max-h-64">
                        <SelectItem v-for="c in cities" :key="c.id" :value="String(c.id)">{{ c.name }}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div class="space-y-2 sm:col-span-2">
                    <Label for="postcode">Postcode</Label>
                    <Select v-model="form.postcode_id" :disabled="!form.city_id">
                      <SelectTrigger id="postcode" class="w-full">
                        <SelectValue :placeholder="!form.city_id ? 'Select a city first' : loadingPostcodes ? 'Loading…' : 'Choose postcode'" />
                      </SelectTrigger>
                      <SelectContent class="max-h-64">
                        <SelectItem v-for="p in postcodes" :key="p.id" :value="String(p.id)">{{ p.code }}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <!-- Other countries: free text -->
                <div v-else class="grid gap-4 sm:grid-cols-2">
                  <div class="space-y-2">
                    <Label for="stateText">State / Province</Label>
                    <Input id="stateText" v-model="form.state" placeholder="e.g. California" />
                  </div>
                  <div class="space-y-2">
                    <Label for="cityText">City</Label>
                    <Input id="cityText" v-model="form.city" placeholder="e.g. Los Angeles" />
                  </div>
                  <div class="space-y-2 sm:col-span-2">
                    <Label for="postcodeText">Postcode / ZIP</Label>
                    <Input id="postcodeText" v-model="form.postcode" placeholder="e.g. 90001" />
                  </div>
                </div>

                <p class="text-xs text-muted-foreground">
                  Currency &amp; timezone are set from your country automatically.
                </p>
              </div>

              <!-- Step 3 — Plan -->
              <div v-else key="3" class="space-y-4">
                <div class="space-y-2">
                  <button
                    v-for="p in plans"
                    :key="p.tier"
                    type="button"
                    :class="cn(
                      'flex w-full items-center justify-between rounded-lg border p-3 text-left transition-colors',
                      form.plan === p.tier ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : 'hover:bg-muted',
                    )"
                    @click="form.plan = p.tier"
                  >
                    <div>
                      <div class="flex items-center gap-2 font-medium">
                        {{ p.name }}
                        <Badge v-if="p.featured" variant="secondary" class="text-[10px]">Popular</Badge>
                      </div>
                      <div class="text-xs text-muted-foreground">{{ p.tagline }}</div>
                    </div>
                    <div class="shrink-0 text-right">
                      <div class="font-semibold">{{ p.priceMonthly === 0 ? 'Free' : `RM${p.priceMonthly}` }}</div>
                      <div v-if="p.priceMonthly > 0" class="text-xs text-muted-foreground">/mo</div>
                    </div>
                  </button>
                </div>

                <div class="space-y-1.5">
                  <label class="flex items-start gap-2">
                    <Checkbox id="terms" v-model="form.terms" class="mt-0.5" />
                    <span class="text-sm font-normal leading-snug text-muted-foreground">
                      I agree to the
                      <a href="#" class="text-primary hover:underline">Terms</a> and
                      <a href="#" class="text-primary hover:underline">Privacy Policy</a>.
                    </span>
                  </label>
                  <p v-if="fieldError('terms')" class="text-xs text-destructive">{{ fieldError('terms') }}</p>
                </div>
              </div>
            </Transition>

            <!-- Nav buttons -->
            <!-- Server/network error -->
            <p
              v-if="serverErrors._general"
              class="mt-4 flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              <TriangleAlert class="size-4 shrink-0" /> {{ serverErrors._general }}
            </p>

            <div class="mt-6 flex items-center gap-3">
              <Button v-if="step > 1" variant="outline" class="gap-1" :disabled="submitting" @click="back">
                <ArrowLeft class="size-4" /> Back
              </Button>
              <Button v-if="step < steps.length" class="ml-auto gap-1" @click="next">
                Continue <ArrowRight class="size-4" />
              </Button>
              <Button v-else class="ml-auto gap-2" :disabled="submitting" @click="submit">
                <Loader2 v-if="submitting" class="size-4 animate-spin" />
                {{ submitting ? 'Creating…' : 'Create restaurant' }}
              </Button>
            </div>
          </CardContent>
        </Card>

        <p class="text-center text-sm text-muted-foreground">
          Already have an account?
          <NuxtLink to="/login" class="text-primary hover:underline">Sign in</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { Check, X, Loader2, ArrowLeft, ArrowRight, TriangleAlert } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { api } from '@/composables/api'
import { plans, workspaces } from '@/data/workspace'
import type { PlanTier } from '@/data/types'

definePageMeta({ layout: false })

const steps = [
  { n: 1, label: 'Account', hint: 'Your login details', title: 'Create your account', subtitle: "You'll be the owner of this workspace." },
  { n: 2, label: 'Restaurant', hint: 'Name & location', title: 'About your restaurant', subtitle: 'This becomes your workspace.' },
  { n: 3, label: 'Plan', hint: 'Pick a plan', title: 'Choose your plan', subtitle: 'Start free — upgrade anytime.' },
]

const step = ref(1)
const dir = ref<'slide-next' | 'slide-back'>('slide-next')
const attempted = ref(false) // reveal validation feedback only after a click
const current = computed(() => steps[step.value - 1])

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirm: '',
  restaurant: '',
  slug: '',
  cuisine: '',
  address: '',
  city: '',
  postcode: '',
  state: '',
  country: 'MY',
  // Malaysia: FK ids selected from the cascading dropdowns.
  state_id: '',
  city_id: '',
  postcode_id: '',
  plan: 'pro' as PlanTier,
  terms: false,
})

// --- Cascading location dropdowns (Malaysia), loaded from the backend API ---
const isMalaysia = computed(() => form.country === 'MY')

const states = ref<{ id: number; name: string }[]>([])
const cities = ref<{ id: number; name: string }[]>([])
const postcodes = ref<{ id: number; code: string }[]>([])
const loadingStates = ref(false)
const loadingCities = ref(false)
const loadingPostcodes = ref(false)

async function loadStates() {
  loadingStates.value = true
  try {
    states.value = await api.location.states()
  } catch {
    states.value = []
  } finally {
    loadingStates.value = false
  }
}
async function loadCities(stateId: string) {
  loadingCities.value = true
  try {
    cities.value = await api.location.cities(stateId)
  } catch {
    cities.value = []
  } finally {
    loadingCities.value = false
  }
}
async function loadPostcodes(cityId: string) {
  loadingPostcodes.value = true
  try {
    postcodes.value = await api.location.postcodes(cityId)
  } catch {
    postcodes.value = []
  } finally {
    loadingPostcodes.value = false
  }
}

// Country change → reset location, load states when Malaysia.
watch(
  () => form.country,
  (country) => {
    form.state = form.city = form.postcode = ''
    form.state_id = form.city_id = form.postcode_id = ''
    states.value = cities.value = postcodes.value = []
    if (country === 'MY') loadStates()
  },
)

// State chosen → mirror its name, load its cities, reset downstream.
watch(
  () => form.state_id,
  (id) => {
    form.city = form.postcode = ''
    form.city_id = form.postcode_id = ''
    cities.value = postcodes.value = []
    form.state = states.value.find((s) => String(s.id) === String(id))?.name ?? ''
    if (id) loadCities(id)
  },
)

// City chosen → mirror its name, load its postcodes, reset downstream.
watch(
  () => form.city_id,
  (id) => {
    form.postcode = ''
    form.postcode_id = ''
    postcodes.value = []
    form.city = cities.value.find((c) => String(c.id) === String(id))?.name ?? ''
    if (id) loadPostcodes(id)
  },
)

// Postcode chosen → mirror its code.
watch(
  () => form.postcode_id,
  (id) => {
    form.postcode = postcodes.value.find((p) => String(p.id) === String(id))?.code ?? ''
  },
)

// ISO 3166-1 alpha-2. Backend derives default currency & timezone from this.
const countries = [
  { code: 'MY', name: 'Malaysia' },
  { code: 'SG', name: 'Singapore' },
  { code: 'ID', name: 'Indonesia' },
  { code: 'TH', name: 'Thailand' },
  { code: 'PH', name: 'Philippines' },
  { code: 'VN', name: 'Vietnam' },
  { code: 'AU', name: 'Australia' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'US', name: 'United States' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'IN', name: 'India' },
  { code: 'JP', name: 'Japan' },
]

// --- Workspace URL slug: user-editable, with availability check ---
// Demo source of "taken" subdomains = existing sample workspaces + reserved
// system hosts. Swap this for a real API call (e.g.
// GET /api/workspaces/slug-available?slug=…) when wiring up.
const reservedSlugs = ['www', 'app', 'api', 'admin', 'mail', 'blog', 'status', 'help', 'support', 'dashboard']
const existingSlugs = new Set([...workspaces.map((w) => w.slug), ...reservedSlugs])

type SlugStatus = 'idle' | 'checking' | 'available' | 'taken' | 'invalid'
const slugStatus = ref<SlugStatus>('idle')
let slugEdited = false
let slugTimer: ReturnType<typeof setTimeout> | undefined

function slugify(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

function checkSlug() {
  clearTimeout(slugTimer)
  const s = form.slug
  if (!s) return (slugStatus.value = 'idle')
  if (s.length < 3) return (slugStatus.value = 'invalid')

  slugStatus.value = 'checking'
  // Simulated async lookup — replace with a debounced API request.
  slugTimer = setTimeout(() => {
    slugStatus.value = existingSlugs.has(s) ? 'taken' : 'available'
  }, 500)
}

function onSlugInput(e: Event) {
  slugEdited = true
  form.slug = slugify((e.target as HTMLInputElement).value)
  checkSlug()
}

// Auto-fill the slug from the restaurant name until the user edits it directly.
watch(
  () => form.restaurant,
  (name) => {
    if (!slugEdited) {
      form.slug = slugify(name)
      checkSlug()
    }
  },
)

// --- Persist wizard progress across refreshes (sessionStorage) ---
// Passwords are intentionally NOT stored; the user re-enters them on reload.
const STORAGE_KEY = 'register-wizard'

onMounted(() => {
  const saved = sessionStorage.getItem(STORAGE_KEY)
  if (saved) {
    try {
      const data = JSON.parse(saved)
      Object.assign(form, data.form ?? {})
      if (data.step) step.value = data.step
      if (form.slug) {
        slugEdited = true
        checkSlug()
      }
    } catch {
      sessionStorage.removeItem(STORAGE_KEY)
    }
  }

  // Load Malaysian states for the dropdown (location itself isn't persisted).
  if (isMalaysia.value) loadStates()
})

watch(
  [form, step],
  () => {
    if (!import.meta.client) return
    // Don't persist passwords, or the cascading location selection (re-picked on reload).
    const {
      password: _p,
      confirm: _c,
      state: _s,
      city: _ci,
      postcode: _pc,
      state_id: _si,
      city_id: _cid,
      postcode_id: _pid,
      ...safe
    } = form
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ form: safe, step: step.value }))
  },
  { deep: true },
)

// Per-field validation errors for the current step (single source of truth).
const errors = computed(() => {
  const e: Record<string, string> = {}
  if (step.value === 1) {
    if (!form.name.trim()) e.name = 'Please enter your full name.'
    if (!/.+@.+\..+/.test(form.email)) e.email = 'Please enter a valid email address.'
    if (form.password.length < 8) e.password = 'Password must be at least 8 characters.'
    if (form.confirm !== form.password) e.confirm = 'Passwords do not match.'
  }
  if (step.value === 2) {
    if (!form.restaurant.trim()) e.restaurant = 'Please enter your restaurant name.'
    if (slugStatus.value === 'checking') e.slug = 'Checking availability…'
    else if (slugStatus.value !== 'available') e.slug = 'Choose an available subdomain.'
    if (!form.country) e.country = 'Please select your country.'
  }
  if (step.value === 3 && !form.terms) {
    e.terms = 'You must accept the Terms and Privacy Policy.'
  }
  return e
})

// The step passes when there are no errors.
const canContinue = computed(() => Object.keys(errors.value).length === 0)

function next() {
  if (step.value >= steps.length) return
  // Button is always clickable — validate on click.
  if (!canContinue.value) {
    attempted.value = true
    return
  }
  dir.value = 'slide-next'
  step.value++
  attempted.value = false
}
function back() {
  if (step.value <= 1) return
  dir.value = 'slide-back'
  step.value--
  attempted.value = false
}

// --- Submission ---------------------------------------------------------
const submitting = ref(false)
const serverErrors = reactive<Record<string, string>>({})

// Show the server error if present, otherwise the client error (after a click).
function fieldError(field: string): string {
  return serverErrors[field] || (attempted.value ? errors.value[field] ?? '' : '')
}

function clearServerErrors() {
  for (const key in serverErrors) delete serverErrors[key]
}

// Backend field name → form field name (for inline display + step routing).
const serverFieldMap: Record<string, string> = {
  restaurant_name: 'restaurant',
  country_code: 'country',
}

const stepFields: Record<number, string[]> = {
  1: ['name', 'email', 'password'],
  2: ['restaurant', 'slug', 'cuisine', 'address', 'country', 'state_id', 'city_id', 'postcode_id', 'state', 'city', 'postcode'],
  3: ['plan', 'terms'],
}

function goToFirstErrorStep() {
  for (const s of [1, 2, 3]) {
    if (stepFields[s]!.some((f) => serverErrors[f])) {
      step.value = s
      attempted.value = true
      break
    }
  }
}

async function submit() {
  if (!canContinue.value) {
    attempted.value = true
    return
  }
  clearServerErrors()
  submitting.value = true
  try {
    await api.auth.register({
      name: form.name,
      email: form.email,
      password: form.password,
      password_confirmation: form.confirm,
      restaurant_name: form.restaurant,
      slug: form.slug,
      cuisine: form.cuisine || null,
      address: form.address || null,
      country_code: form.country,
      state_id: form.state_id || null,
      city_id: form.city_id || null,
      postcode_id: form.postcode_id || null,
      state: form.state || null,
      city: form.city || null,
      postcode: form.postcode || null,
      plan: form.plan,
      terms: form.terms,
    })
    if (import.meta.client) sessionStorage.removeItem(STORAGE_KEY)
    await navigateTo('/dashboard')
  } catch (e) {
    const res = (e as { response?: { status: number, data?: { errors?: Record<string, string[]> } } }).response
    if (res?.status === 422 && res.data?.errors) {
      for (const [key, messages] of Object.entries(res.data.errors)) {
        serverErrors[serverFieldMap[key] ?? key] = messages[0]!
      }
      goToFirstErrorStep()
    } else {
      serverErrors._general = 'Something went wrong. Please try again.'
    }
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.slide-next-enter-active,
.slide-next-leave-active,
.slide-back-enter-active,
.slide-back-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.slide-next-enter-from {
  opacity: 0;
  transform: translateX(12px);
}
.slide-next-leave-to {
  opacity: 0;
  transform: translateX(-12px);
}
.slide-back-enter-from {
  opacity: 0;
  transform: translateX(-12px);
}
.slide-back-leave-to {
  opacity: 0;
  transform: translateX(12px);
}
</style>
