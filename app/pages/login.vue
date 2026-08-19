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
          Order & Menu Management test
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
              Enter your credentials to continue.
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="space-y-2">
              <Label for="email">Email</Label>
              <Input id="email" v-model="email" type="email" placeholder="you@warungnusantara.my" @keyup.enter="signIn" />
            </div>
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <Label for="password">Password</Label>
                <a class="text-xs text-primary hover:underline" href="#">Forgot?</a>
              </div>
              <Input id="password" v-model="password" type="password" placeholder="••••••••" @keyup.enter="signIn" />
            </div>

            <p
              v-if="errorMessage"
              class="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              <TriangleAlert class="size-4" />
              {{ errorMessage }}
            </p>

            <Button variant="outline" class="w-full" :disabled="loading" @click="signIn">
              {{ loading ? 'Signing in…' : 'Sign in' }}
            </Button>

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
import { TriangleAlert } from 'lucide-vue-next'
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
import { api } from '@/composables/api'

definePageMeta({ layout: false })

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')

async function signIn() {
  if (loading.value) return
  errorMessage.value = ''

  if (!email.value || !password.value) {
    errorMessage.value = 'Enter your email and password.'
    return
  }

  loading.value = true
  try {
    await api.auth.login(email.value, password.value)
    await navigateTo('/dashboard')
  } catch (err: unknown) {
    const status = (err as { response?: { status?: number } })?.response?.status
    errorMessage.value = status === 401
      ? 'Invalid credentials. Please try again.'
      : 'Something went wrong. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
