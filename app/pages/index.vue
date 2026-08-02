<script setup lang="ts">
// Landing → send visitors to the login page first.
definePageMeta({ layout: false })
await navigateTo('/login', { redirectCode: 302 })
</script>

<template>
  <div />
</template>
