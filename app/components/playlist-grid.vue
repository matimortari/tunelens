<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
    <div v-for="playlist in playlists" :key="playlist.id" class="flex flex-col items-center rounded border p-4">
      <img :src="playlist.images?.[0]?.url || ''" alt="Playlist cover" class="size-32 rounded object-cover">
      <p class="mt-2 text-center font-semibold">
        {{ playlist.name }}
      </p>

      <button class="btn" @click="$emit('updateCover', playlist.id)">
        Update Cover
      </button>
      <button class="btn mt-2" @click="openDialog(playlist)">
        See Playlist Info
      </button>
    </div>

    <PlaylistDialog :is-open="isDialogOpen" :playlist="selectedPlaylist" @update:is-open="isDialogOpen = $event" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  playlists: PlaylistType[]
}>()

defineEmits<{ (e: "updateCover", playlistId: string): void }>()

const isDialogOpen = ref(false)
const selectedPlaylist = ref<PlaylistType | null>(null)

function openDialog(playlist: typeof selectedPlaylist.value) {
  selectedPlaylist.value = playlist
  isDialogOpen.value = true
}
</script>
