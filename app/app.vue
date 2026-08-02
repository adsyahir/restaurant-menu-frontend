<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <Toaster rich-colors />
  </div>
</template>

<script setup lang="ts">
import { Toaster } from '@/components/ui/sonner'

useHead({
  title: 'Warung Nusantara — Order & Menu System',
  meta: [
    {
      name: 'description',
      content:
        'Restaurant order and menu management system (UI demo, hardcoded data).',
    },
  ],
})
</script>
