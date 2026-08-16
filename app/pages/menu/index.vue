<template>
  <div class="mx-auto max-w-md space-y-6 py-10 text-center">
    <div class="text-5xl">🍜</div>
    <div class="space-y-1">
      <h1 class="text-2xl font-bold tracking-tight">Find a menu</h1>
      <p class="text-sm text-muted-foreground">
        Scan the QR code on your table, or enter the restaurant's handle below.
      </p>
    </div>

    <form class="flex items-center gap-2" @submit.prevent="go">
      <Input v-model="slug" placeholder="e.g. warung-nusantara" />
      <Button type="submit" :disabled="!slug.trim()">View menu</Button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

definePageMeta({ layout: 'public' })

const slug = ref('')

function go() {
  const s = slug.value.trim().toLowerCase()
  if (s) navigateTo(`/menu/${s}`)
}
</script>
