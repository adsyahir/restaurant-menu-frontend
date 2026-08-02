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
            <AvatarFallback class="bg-primary/15 text-lg text-primary">ZR</AvatarFallback>
          </Avatar>
          <div class="space-y-1">
            <Button variant="outline" size="sm">Change photo</Button>
            <p class="text-xs text-muted-foreground">JPG or PNG, up to 2MB.</p>
          </div>
        </div>
        <div class="grid gap-4 sm:grid-cols-2">
          <div class="space-y-2">
            <Label for="fname">Full name</Label>
            <Input id="fname" model-value="Zainab Rahman" />
          </div>
          <div class="space-y-2">
            <Label for="pemail">Email</Label>
            <Input id="pemail" type="email" model-value="zainab@warungnusantara.my" />
          </div>
          <div class="space-y-2">
            <Label for="phone">Phone</Label>
            <Input id="phone" model-value="+60 12-345 6789" />
          </div>
          <div class="space-y-2">
            <Label for="role">Role</Label>
            <Input id="role" model-value="Admin / Owner" readonly class="text-muted-foreground" />
          </div>
        </div>
        <div class="flex justify-end">
          <Button @click="toast.success('Profile saved (demo).')">Save changes</Button>
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
            <Input id="cur" type="password" placeholder="••••••••" />
          </div>
          <div />
          <div class="space-y-2">
            <Label for="np">New password</Label>
            <Input id="np" type="password" placeholder="••••••••" />
          </div>
          <div class="space-y-2">
            <Label for="cp">Confirm new password</Label>
            <Input id="cp" type="password" placeholder="••••••••" />
          </div>
        </div>
        <div class="flex justify-end">
          <Button variant="outline" @click="toast.success('Password updated (demo).')">Update password</Button>
        </div>
      </CardContent>
    </Card>

    <Card class="border-destructive/30">
      <CardHeader>
        <CardTitle class="text-lg text-destructive">Danger zone</CardTitle>
        <CardDescription>Permanently delete your account and remove access.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="destructive" @click="toast.warning('Account deletion is disabled in the demo.')">
          Delete account
        </Button>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { toast } from 'vue-sonner'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
</script>
