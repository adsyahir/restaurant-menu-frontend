<template>
  <div class="grid min-h-screen lg:grid-cols-2">
    <!-- Brand panel -->
    <div
      class="relative hidden flex-col justify-between bg-gradient-to-br from-amber-500 to-orange-700 p-10 text-white lg:flex"
    >
      <NuxtLink to="/home" class="flex items-center gap-2 text-lg font-semibold">
        <span class="text-2xl">🍜</span> Warung Nusantara
      </NuxtLink>
      <div class="space-y-3">
        <h2 class="text-3xl font-bold leading-tight">
          Order & Menu Management
        </h2>
        <p class="max-w-md text-white/80">
          From table to kitchen to payment — run the whole floor from one place.
          Sign in with your staff account to get started.
        </p>
      </div>
      <p class="text-sm text-white/60">© 2026 Warung Nusantara · Kuala Lumpur</p>
    </div>

    <!-- Login form -->
    <div class="flex items-center justify-center p-6">
      <div class="w-full max-w-sm space-y-6">
        <div class="space-y-2 text-center lg:hidden">
          <div class="text-4xl">🍜</div>
          <h1 class="text-xl font-semibold">Warung Nusantara</h1>
        </div>

        <Card>
          <CardHeader class="space-y-1">
            <CardTitle class="text-2xl">Staff sign in</CardTitle>
            <CardDescription>
              Enter your credentials, or continue with Keycloak SSO.
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <Button class="w-full gap-2" size="lg" @click="signIn">
              <ShieldCheck class="size-4" />
              Sign in with Keycloak
            </Button>

            <div class="relative">
              <Separator />
              <span
                class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground"
              >
                or with email
              </span>
            </div>

            <div class="space-y-2">
              <Label for="email">Email</Label>
              <Input id="email" type="email" placeholder="you@warungnusantara.my" />
            </div>
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <Label for="password">Password</Label>
                <a class="text-xs text-primary hover:underline" href="#">Forgot?</a>
              </div>
              <Input id="password" type="password" placeholder="••••••••" />
            </div>

            <!-- Example error state -->
            <p
              v-if="showError"
              class="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              <TriangleAlert class="size-4" />
              Invalid credentials. Please try again.
            </p>

            <Button variant="outline" class="w-full" @click="signIn">Sign in</Button>

            <p class="text-center text-sm text-muted-foreground">
              New here?
              <NuxtLink to="/register" class="text-primary hover:underline">Create an account</NuxtLink>
            </p>
          </CardContent>
        </Card>

        <p class="text-center text-xs text-muted-foreground">
          UI demo — no real authentication.
          <NuxtLink to="/dashboard" class="text-primary hover:underline">
            Skip to dashboard →
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ShieldCheck, TriangleAlert } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

definePageMeta({ layout: false })

const showError = ref(false)

// Presentational only — real Keycloak OIDC flow is yours to wire up.
function signIn() {
  navigateTo('/dashboard')
}
</script>
