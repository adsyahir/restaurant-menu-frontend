<template>
  <div class="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle class="text-lg">Profile</CardTitle>
        <CardDescription>How you appear to your team.</CardDescription>
      </CardHeader>
      <CardContent class="space-y-5">
        <div class="flex items-center gap-4">
          <Avatar class="size-16">
            <AvatarFallback class="bg-primary/15 text-lg text-primary">{{ initials }}</AvatarFallback>
          </Avatar>
          <div class="space-y-1">
            <Button variant="outline" size="sm" disabled>Change photo</Button>
            <p class="text-xs text-muted-foreground">Avatar uploads coming soon.</p>
          </div>
        </div>
        <div class="grid gap-4 sm:grid-cols-2">
          <div class="space-y-2">
            <Label for="fname">Full name</Label>
            <Input id="fname" v-model="name" :disabled="loading" />
          </div>
          <div class="space-y-2">
            <Label for="pemail">Email</Label>
            <Input id="pemail" v-model="email" type="email" :disabled="loading" />
          </div>
          <div class="space-y-2">
            <Label for="role">Role</Label>
            <Input id="role" :model-value="role" readonly class="text-muted-foreground" />
          </div>
        </div>
        <div class="flex justify-end">
          <Button :disabled="loading || savingProfile" @click="saveProfile">
            {{ savingProfile ? 'Saving…' : 'Save changes' }}
          </Button>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle class="text-lg">Password</CardTitle>
        <CardDescription>Update the password used for email sign-in.</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="grid gap-4 sm:grid-cols-2">
          <div class="space-y-2">
            <Label for="cur">Current password</Label>
            <Input id="cur" v-model="currentPassword" type="password" placeholder="••••••••" />
          </div>
          <div />
          <div class="space-y-2">
            <Label for="np">New password</Label>
            <Input id="np" v-model="newPassword" type="password" placeholder="••••••••" />
          </div>
          <div class="space-y-2">
            <Label for="cp">Confirm new password</Label>
            <Input id="cp" v-model="confirmPassword" type="password" placeholder="••••••••" />
          </div>
        </div>
        <div class="flex justify-end">
          <Button variant="outline" :disabled="savingPassword" @click="changePassword">
            {{ savingPassword ? 'Updating…' : 'Update password' }}
          </Button>
        </div>
      </CardContent>
    </Card>

    <Card class="border-destructive/30">
      <CardHeader>
        <CardTitle class="text-lg text-destructive">Danger zone</CardTitle>
        <CardDescription>Permanently delete your account and remove access.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="destructive" @click="toast.warning('Account deletion is not enabled yet.')">
          Delete account
        </Button>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { toast } from 'vue-sonner'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { api } from '@/composables/api'

const name = ref('')
const email = ref('')
const role = ref('Member')

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const loading = ref(true)
const savingProfile = ref(false)
const savingPassword = ref(false)

const initials = computed(() => {
  const parts = name.value.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  return (parts[0]![0]! + (parts[1]?.[0] ?? '')).toUpperCase()
})

onMounted(async () => {
  try {
    const user = await api.auth.me()
    name.value = user.name
    email.value = user.email
    // The workspace loaded at login tells us whether this user owns it.
    const ws = user.current_workspace as { owner_id?: number } | null | undefined
    role.value = ws && ws.owner_id === user.id ? 'Admin / Owner' : 'Member'
  } catch {
    toast.error('Failed to load your profile.')
  } finally {
    loading.value = false
  }
})

async function saveProfile() {
  if (savingProfile.value) return
  if (!name.value.trim() || !email.value.trim()) {
    toast.error('Name and email are required.')
    return
  }

  savingProfile.value = true
  try {
    await api.auth.updateProfile({ name: name.value.trim(), email: email.value.trim() })
    toast.success('Profile saved.')
  } catch (err: unknown) {
    const status = (err as { response?: { status?: number } })?.response?.status
    toast.error(status === 422 ? 'That email is already in use.' : 'Failed to save profile.')
  } finally {
    savingProfile.value = false
  }
}

async function changePassword() {
  if (savingPassword.value) return
  if (!currentPassword.value || !newPassword.value) {
    toast.error('Enter your current and new password.')
    return
  }
  if (newPassword.value !== confirmPassword.value) {
    toast.error('New passwords do not match.')
    return
  }

  savingPassword.value = true
  try {
    await api.auth.updatePassword({
      current_password: currentPassword.value,
      password: newPassword.value,
      password_confirmation: confirmPassword.value,
    })
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
    toast.success('Password updated.')
  } catch (err: unknown) {
    const status = (err as { response?: { status?: number } })?.response?.status
    toast.error(status === 422 ? 'Current password is incorrect or new password is too weak.' : 'Failed to update password.')
  } finally {
    savingPassword.value = false
  }
}
</script>
