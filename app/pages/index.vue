<template>
  <div class="m-8 flex min-h-screen flex-col gap-4 md:flex-row">
    <p v-if="isLoading" class="text-center text-lg">
      Loading...
    </p>
    <p v-if="error" class="text-center text-lg text-danger">
      {{ error }}
    </p>

    <div v-if="user" class="mb-8">
      <h2>{{ user.profile?.display_name }}</h2>
      <img v-if="user?.profile?.images?.length" :src="user.profile?.images[0]?.url" class="size-32 rounded-full">
    </div>

    <div v-if="playlists?.length" class="flex w-full flex-col gap-3">
      <h2 class="mb-4 text-xl font-bold">
        Playlists
      </h2>
      <PlaylistGrid :playlists="playlists ?? []" @update-cover="handleUpdatePlaylistCover" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "~/lib/stores/user-store"

const userStore = useUserStore()
const { user, playlists, isLoading, error } = storeToRefs(userStore)

onMounted(async () => {
  await userStore.getUser()
  await userStore.getPlaylists()
})

function handleUpdatePlaylistCover(playlistId: string) {
  alert(`Aqui você implementa atualizar capa da playlist ${playlistId}`)
}
</script>
