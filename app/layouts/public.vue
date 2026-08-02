<template>
  <div class="flex min-h-screen flex-col bg-background">
    <header class="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
      <div class="mx-auto flex h-16 w-full max-w-5xl items-center gap-3 px-4">
        <NuxtLink to="/menu" class="flex items-center gap-2">
          <div
            class="flex size-9 items-center justify-center rounded-lg bg-primary text-lg text-primary-foreground"
          >
            🍜
          </div>
          <div class="grid leading-tight">
            <span class="font-semibold">Warung Nusantara</span>
            <span class="text-xs text-muted-foreground">Authentic Malaysian</span>
          </div>
        </NuxtLink>
        <div class="ml-auto flex items-center gap-2">
          <Button as-child variant="ghost" size="sm">
            <NuxtLink to="/menu">Menu</NuxtLink>
          </Button>
          <DarkModeToggle />
        </div>
      </div>
    </header>

    <main class="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
      <slot />
    </main>

    <footer class="border-t py-6 text-center text-xs text-muted-foreground">
      Warung Nusantara · No. 12, Jalan Ampang, Kuala Lumpur · Open daily 8am–10pm
    </footer>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
</script>
