<template>
  <div class="items-ceter flex flex-row justify-between border-b-2 bg-card p-4">
    <div class="flex flex-row items-center gap-2">
      TuneLens
    </div>

    <nav class="flex flex-row items-center gap-2">
      <button class="btn" aria-label="Toggle Theme" @click="toggleTheme">
        <icon :name="themeIcon" size="25" />
      </button>

      <button v-if="!loggedIn" class="btn" aria-label="Sign In" @click="navigateTo('/api/auth/spotify', { external: true })">
        <icon name="simple-icons:spotify" size="25" />
        <span>Sign In</span>
      </button>

      <button v-else class="btn" aria-label="Sign Out" @click="signOut">
        <icon name="material-symbols:logout" size="25" />
        <span>Sign Out</span>
      </button>
    </nav>
  </div>
</template>

<script setup lang="ts">
const { clear, loggedIn } = useUserSession()
const { toggleTheme, themeIcon } = useTheme()

function signOut() {
  clear()
  window.location.href = "/"
}
</script>
