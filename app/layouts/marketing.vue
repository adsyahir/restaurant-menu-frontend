<template>
  <div class="flex min-h-screen flex-col">
    <header class="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
      <div class="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4 sm:px-6">
        <NuxtLink to="/home" class="flex items-center gap-2 font-semibold">
          <span class="text-2xl">🍜</span> Warung<span class="text-primary">OS</span>
        </NuxtLink>
        <nav class="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <NuxtLink to="/home" class="transition-colors hover:text-foreground">Product</NuxtLink>
          <NuxtLink to="/pricing" class="transition-colors hover:text-foreground">Pricing</NuxtLink>
          <NuxtLink to="/menu" class="transition-colors hover:text-foreground">Live demo</NuxtLink>
        </nav>
        <div class="ml-auto flex items-center gap-2">
          <DarkModeToggle />
          <Button variant="ghost" as-child class="hidden sm:inline-flex">
            <NuxtLink to="/login">Sign in</NuxtLink>
          </Button>
          <Button as-child>
            <NuxtLink to="/register">Get started</NuxtLink>
          </Button>
        </div>
      </div>
    </header>

    <main class="flex-1">
      <slot />
    </main>

    <footer class="border-t">
      <div class="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div class="flex items-center gap-2 font-medium text-foreground">
          <span class="text-lg">🍜</span> WarungOS
        </div>
        <p>© 2026 WarungOS · Restaurant order & menu platform · Kuala Lumpur</p>
        <div class="flex gap-4">
          <NuxtLink to="/pricing" class="hover:text-foreground">Pricing</NuxtLink>
          <NuxtLink to="/login" class="hover:text-foreground">Sign in</NuxtLink>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
</script>
